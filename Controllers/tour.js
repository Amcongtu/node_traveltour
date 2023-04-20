import Tour from "../models/Tour.js";
import cloudinary from 'cloudinary';
import Destination from "../models/Destination.js";

function connectCloud(){
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
      });
}
// Chạy hàm này để thay đổi đường dẫn của ảnh và upload lên Cloudinary hàm này trả về nội dung mới và đường dẫn mới.
async function processImages(content,folder_url) {
    const images = content.match(/<img.*?src="(.*?)"[^>]+>/g);
    let imageUrls = [];
    let arrayCloud = [];
    let newContent=""
    let public_id_cloud=[]
    try{
        if (images) {
        for (let i = 0; i < images.length; i++) {
            const imgUrl = images[i].match(/src="(.*?)"/)[1];
           
            const result = await cloudinary.uploader.upload(imgUrl,function(res){return;},{
                folder: folder_url,
                use_filename: true
            }); // Upload ảnh lên Cloudinary
            const newImgUrl = result.secure_url; // Lấy đường dẫn của ảnh từ Cloudinary
            // console.log(content)
            newContent = content.replace(imgUrl, newImgUrl); // Thay đổi đường dẫn của ảnh trong nội dung
            // console.log("===========")
            // console.log(newContent)

            content = newContent; // Cập nhật nội dung mới
            // console.log("---------------------")
            // console.log(content)
            arrayCloud.push(result)
            public_id_cloud.push(result.public_id)
            imageUrls.push(newImgUrl); // Thêm đường dẫn của ảnh mới vào mảng
        }
        // console.log("---------------------")
        //     console.log(newContent)
        return { newContent, imageUrls ,arrayCloud,public_id_cloud}; // Trả về nội dung mới và mảng đường dẫn ảnh
    }
    }catch(err){
        return { content, imageUrls ,arrayCloud,public_id_cloud}
    }
}


export const createTour = async (req, res, next) => {
  connectCloud();
  // console.log(req.body)
  var savedTour={}
  try {

    const tour = new Tour(req.body);

    // // Save the new document to the database
     savedTour = await tour.save();
    console.log("1111")
    await Destination.findOneAndUpdate(
      { name: req.body.destination },
      { $push: { tours: savedTour._id } },
      { new: true }
    );

    res.status(200).json(savedTour);
    // return res.status(200).json("Bạn đã hoàn thành")
  } catch (err) {
    if(req.body.image_public_id ){
      cloudinary.uploader.destroy(req.body.image_public_id, { invalidate: true });
    }
    if(req.body.public_id.length>0){
      for (let i = 0; i < req.body.public_id.length; i++) {
        if (req.body.public_id[i]) {
          cloudinary.uploader.destroy(req.body.public_id[i], { invalidate: true });
        }
      }
    }
    // If adding fails, delete images on cloudinary
 
      await Destination.findOneAndUpdate(
      { name: req.body.destination },
      { $pull: { tours: savedTour._id } }
    );
    next(err);
  }
  
};



export const getAllTours = async(req,res,next)=>{
  try{
    const data = await Tour.find({})
    return res.status(200).json(data)
  }catch(err){
    next()
  }
}

export const getTour =async (req,res,next)=>{
  try {
    const tourID = req.params.id;
    const tour = await Tour.findById(tourID);
    if (!tour) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    return res.status(200).json(tour)
  } catch (error) {
    next(error)
  }
}

export const deleteTour = async (req, res, next) => {
  try {
    const tourID = req.params.id;
    const tour = await Destination.findById(tourID);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    
    try {
      if (tour.public_key_image) {
        await cloudinary.uploader.destroy(tour.image_public_id, {
          invalidate: true,
        });
      }
    } catch (error) {
      return res.status(500).json({message:"Delete image failed."})
    }
    try {
      if(tour.public_id[0]){
        for(let i=0;i<tour.public_id.length;i++){
          if (tour.public_id[i]) {
            await cloudinary.uploader.destroy(tour.public_id[i], {
              invalidate: true,
            });
        }
      }
    }
    } catch (error) {
      return res.status(500).json({message:"Delete images in content failed."})
      
    }

    await Tour.findByIdAndRemove(tourID);
    return res
      .status(200)
      .json({ message: "Destination deleted successfully" });
  } catch (err) {
    next(err);
  }
};
