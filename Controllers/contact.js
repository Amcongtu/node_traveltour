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