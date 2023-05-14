import express from "express";
import { deleteReview, getAllReviews, insertReview, updateReview } from "../Controllers/review.js";
import { verifyClient } from "../utils/verifyToken.js";
const router = express.Router()


router.post("/",insertReview)
router.get('/',getAllReviews)
router.delete('/:id',deleteReview)
router.put('/:id',updateReview)
export default router

