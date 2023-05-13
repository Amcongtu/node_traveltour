import cloudinary from 'cloudinary';
import Blog from './../models/Blog.js';

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
    try{
        if (images) {
        for (let i = 0; i < images.length; i++) {
            const imgUrl = images[i].match(/src="(.*?)"/)[1];
           
            const result = await cloudinary.uploader.upload(imgUrl,function(res){return;},{
                folder: folder_url,
                use_filename: true
            }); // Upload ảnh lên Cloudinary
            const newImgUrl = result.secure_url; // Lấy đường dẫn của ảnh từ Cloudinary
            const newContent = content.replace(imgUrl, newImgUrl); // Thay đổi đường dẫn của ảnh trong nội dung
            content = newContent; // Cập nhật nội dung mới
            arrayCloud.push(result)
            imageUrls.push(newImgUrl); // Thêm đường dẫn của ảnh mới vào mảng
        }
        return { content, imageUrls ,arrayCloud}; // Trả về nội dung mới và mảng đường dẫn ảnh
    }
    }catch(err){
        return { content, imageUrls ,arrayCloud}
    }
  
}


export const createBlog = async (req, res, next) => {
  connectCloud();

  try {

    // Create a new document for the Blog
    const blog = new Blog(req.body
      );

    // Save the new document to the database
    const savedBlog = await blog.save();
    res.status(200).json(savedBlog);
  } catch (err) {
    if(req.body.image_public_id){
      cloudinary.uploader.destroy(req.body.image_public_id, { invalidate: true });
    }
    // If adding fails, delete images on cloudinary
    if(req.body.public_id.length>0){
      for (let i = 0; i < req.body.public_id.length; i++) {
        if (req.body.public_id[i]) {
          cloudinary.uploader.destroy(req.body.public_id[i], { invalidate: true });
        }
      }
    }
  
    next(err);
  }
};


export const getAllBlog  = async (req,res,next)=>{
  try {
    const blogs = await Blog.find()
    res.status(200).json(blogs)
  } catch (error) {
   next(error)
  }
}
export const getAllBlogStatusPublish  = async (req,res,next)=>{
  try {
    const blogs = await Blog.find({status:"published"})
    return res.status(200).json(blogs)
  } catch (error) {
   next(error)
  }
}
export const getBlog =async (req,res,next)=>{
  try {
    
    const BlogID = req.params.id;
    const blog = await Blog.findById(BlogID);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    return res.status(200).json(blog)
  } catch (error) {
    next(error)
  }
}

export const deleteBlog = async(req,res,next)=>{
  connectCloud()
  try {
    const blogID = req.params.id;
    const blog = await Blog.findById(blogID);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
  
    try {

      if (blog.image_public_id) {
        await cloudinary.uploader.destroy(blog.image_public_id, {
          invalidate: true,
        });

      }
    } catch (error) {
      return res.status(500).json({message:"Delete image failed."})
    }
    try {
      if(blog.public_id[0]){
        for(let i=0;i<blog.public_id.length;i++){
          if (blog.public_id[i]) {
            await cloudinary.uploader.destroy(blog.public_id[i], {
              invalidate: true,
            });

        }
      }
    }
    } catch (error) {
      return res.status(500).json({message:"Delete images in content failed."})
      
    }

     await Blog.findByIdAndRemove(blogID);

    return res
      .status(200)
      .json({ message: "Blog deleted successfully" });
  } catch (err) {
    next(err);
  }
}



export const updateBlog = async (req, res, next) => {
  connectCloud();
  try {
    const blogID = req.params.id;
    const {...updatedBlog} = req.body;
    const existingBlog = await Blog.findById(blogID);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if(req.body.image_public_id){
      await cloudinary.uploader.destroy(existingBlog.image_public_id, {
        invalidate: true,
      });
    
    }
    console.log(req.body)
    // Update blog document in database
    const blog = await Blog.findByIdAndUpdate(blogID, { ...updatedBlog }, { new: true });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }


    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (err) {
    next(err);
  }
};