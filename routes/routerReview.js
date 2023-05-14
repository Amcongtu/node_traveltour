import express from "express";
import { deleteReview, getAllReviews, insertReview, updateReview } from "../Controllers/review.js";
import { verifyClient } from "../utils/verifyToken.js";
import { deleteContact, getAllContact, updateContact } from "../Controllers/contact.js";
const router = express.Router()


router.post("/",insertReview)
router.get('/',getAllReviews)
router.delete('/:id',deleteReview)
router.put('/:id',updateReview)
router.get('/',getAllContact)
router.put('/update',updateContact),
router.delete('/:id',deleteContact)
export default router

