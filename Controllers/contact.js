
import Contact from "../models/Contact.js"
export const insertContact = async (req, res, next) => {
    try {
      const { name, email, subject, message } = req.body;
  
      // Tạo một document mới cho liên hệ
      const newContact = new Contact({
        name,
        email,
        subject,
        message,
      });
  
      // Lưu document mới vào database
      const savedContact = await newContact.save();
  
      res.status(201).json({ message: 'Contact created successfully', contact: savedContact });
    } catch (err) {
      next(err);
    }
};

export const getAllContact = async(req,res,next)=>{
  try {
    const contacts = await Contact.find()
    res.status(200).json(contacts)
  } catch (error) {
    next(error)
  }
}

export const updateContact = async(req,res,next)=>{
  try {
    const update = await Contact.findOneAndUpdate({_id: req.body._id},req.body,{new: true})
    update ? res.status(200).json({success: true,data: update, message:'Update Success!'}): res.status(405).json({success: false, message: 'Some thing went worng!',data: null})
  } catch (error) {
    next(error)
  }
}

export const deleteContact = async(req,res,next)=>{
  try {
    const deleteContact = await Contact.findOneAndDelete({_id: req.params.id})
    deleteContact ? res.status(200).json({success: true,data: deleteContact, message:'Delete Success!'}): res.status(405).json({success: false, message: 'Some thing went worng!',data: null})
  } catch (error) {
    next(error)
  }
}