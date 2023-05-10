import express from "express";
import { createBlog,getAllBlog,getBlog,deleteBlog,updateBlog } from "../Controllers/blog.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router()


router.post("/",verifyAdmin,createBlog)
router.get('/',getAllBlog)
router.get('/:id',getBlog)
router.delete('/:id',verifyAdmin,deleteBlog)
router.put('/:id',verifyAdmin,updateBlog)
export default router

