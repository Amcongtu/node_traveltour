import express from "express";
import { deleteReview, getAllReviews, getAllReviewsOfTour, getAllReviewsRatingGt3, insertReview, updateReview } from "../Controllers/review.js";
import { verifyClient } from "../utils/verifyToken.js";
const router = express.Router()


router.post("/",verifyClient,insertReview)
router.get('/',getAllReviews)
router.get('/ratinggt3',getAllReviewsRatingGt3)

router.delete('/:id',verifyClient,deleteReview)
router.put('/:id',verifyClient,updateReview)
router.get('/getreviewoftour/:id',getAllReviewsOfTour)


export default router

