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
            newContent = content.replace(imgUrl, newImgUrl); // Thay đổi đường dẫn của ảnh trong nội dung

            content = newContent; // Cập nhật nội dung mới
            arrayCloud.push(result)
            public_id_cloud.push(result.public_id)
            imageUrls.push(newImgUrl); // Thêm đường dẫn của ảnh mới vào mảng
        }
        return { newContent, imageUrls ,arrayCloud,public_id_cloud}; // Trả về nội dung mới và mảng đường dẫn ảnh
    }
    }catch(err){
        return { content, imageUrls ,arrayCloud,public_id_cloud}
    }
}


export const getAllTours = async(req,res,next)=>{
  try{
    const data = await Tour.find({}).sort({ createdAt: "desc" }) 
    return res.status(200).json(data)
  }catch(err){
    next()
  }
}
export const getAllToursStatusPublish = async(req,res,next)=>{
  try{
    const data = await Tour.find({status:"published"}).sort({ createdAt: "desc" }) 
    return res.status(200).json(data)
  }catch(err){
    next()
  }
}

export const getTour =async (req,res,next)=>{
  try {
    const tourID = req.params.id;
    const tour = await Tour.findById(tourID).populate('reviews');
    if (!tour) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    return res.status(200).json(tour)
  } catch (error) {
    next(error)
  }
}

export const createTour = async (req, res, next) => {
  connectCloud();
  var savedTour={}
  try {
    const {destination,rating,price,...detail} = req.body
    var ratingEdited=rating
    var priceEdited =price

    if(rating>=5||rating<=0){
      ratingEdited  =5 

    }
    if(price<=0){
      priceEdited=0
    }

    const tour = new Tour({
      ...detail,
      rating:ratingEdited,
      price:priceEdited,
      destination:destination.name
    });

    // // Save the new document to the database
     savedTour = await tour.save();
    const data = await Destination.findOneAndUpdate(
      { name: req.body.destination.name },
      { $push: { tours: savedTour._id } },
      { new: true }
    );

  //  res.status(200).json(savedTour);
    return res.status(200).json("Bạn đã hoàn thành")
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

export const deleteTour = async (req, res, next) => {
  connectCloud()
  try {
    const tourID = req.params.id;
    const tour = await Tour.findById(tourID);

    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    const destination = await Destination.findOne({ tours: tourID });
    if (destination) {
      destination.tours.pull(tourID);
      await destination.save();

    }
    try {

      if (tour.image_public_id) {
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
      .json({ message: "Tour deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateTour = async (req, res, next) => {
  connectCloud();
  try {
    // console.log(req.body)
    const tourID = req.params.id;
    // const {...updatedTour} = req.body;
    const {destination,rating,price,...updatedTour} = req.body
    var ratingEdited=rating
    var priceEdited =price

    if(rating>=5||rating<=0){
      ratingEdited  =5 

    }
    if(price<=0){
      priceEdited=0
    }

    // const tour = new Tour({
    //   ...detail,
    //   rating:ratingEdited,
    //   price:priceEdited,
    //   destination:destination.name
    // });

    const existingTour = await Tour.findById(tourID);
    if (!existingTour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    if(req.body.image_public_id){
      await cloudinary.uploader.destroy(existingTour.image_public_id, {
        invalidate: true,
      });
    }
    // Update tour document in database
    const tour = await Tour.findByIdAndUpdate(tourID, {  rating:ratingEdited,
      price:priceEdited, ...updatedTour }, { new: true });
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    
    // Update tour reference in destination document
    // if (Destination.tours.indexOf(tourID) === -1) {
    //   Destination.tours.push(tourID);
    //   await Destination.save();
    // }

    return res.status(200).json({ message: "Tour updated successfully", tour });
  } catch (err) {
    next(err);
  }
};


export const findTour_Name = async (req, res,next) => {
  const { keyword } = req.body;

  try {
    const tours = await Tour.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ]
    });
    return res.status(200).json({ message: "Success",tours});
  } catch (error) {
  
     next()
  }
}