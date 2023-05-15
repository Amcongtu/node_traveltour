import express from "express";
import { deleteReview, getAllReviews, getAllReviewsOfTour, insertReview, updateReview } from "../Controllers/review.js";
import { verifyClient } from "../utils/verifyToken.js";
const router = express.Router()


router.post("/",verifyClient,insertReview)
router.get('/',verifyClient,getAllReviews)
router.delete('/:id',verifyClient,deleteReview)
router.put('/:id',verifyClient,updateReview)
router.get('/getreviewoftour/:id',getAllReviewsOfTour)


export default router

