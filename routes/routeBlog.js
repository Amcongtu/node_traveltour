import express from "express";
import { createBlog,getAllBlog,getBlog,deleteBlog } from "../Controllers/blog.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router()


router.post("/",verifyAdmin,createBlog)
router.get('/',getAllBlog)
router.get('/:id',getBlog)
router.delete('/:id',verifyAdmin,deleteBlog)
export default router

