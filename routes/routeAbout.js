import express from "express";
import About from '../models/About.js';
import { verifyAdmin } from "../utils/verifyToken.js";

const app = express.Router()
// API thêm dữ liệu
app.post('/',verifyAdmin, async (req, res) => {
    try {
        const { content, id } = req.body;

        const newAbout = new About({
            content,
            id
        });

        const savedAbout = await newAbout.save();

        res.status(201).json(savedAbout);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API sửa dữ liệu
app.put('/',verifyAdmin, async (req, res) => {
    try {
        const { content } = req.body;
        const updatedAbout = await About.findOneAndUpdate(
            { id: "IDAbout"},
            { $set: { content: content } },
            { new: true }
          );
      
          if (!updatedAbout) {
            return res.status(404).json({ error: 'About not found' });
          }
      
          return res.status(200).json(updatedAbout);

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default app
