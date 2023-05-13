import Review from "../models/Review.js";
import Tour from "../models/Tour.js";

export const insertReview = async (req, res, next) => {
    try {
        const { username, comment, rating, tourId, customerId } = req.body;

        // Tạo một document mới cho review
        const newReview = new Review({
            username,
            comment,
            rating,
            tour: tourId,
            customer: customerId,
        });

        // Lưu document mới vào database
        const savedReview = await newReview.save();

        // Tìm tour tương ứng và cập nhật lại rating
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: "Tour not found" });
        }

        // Tính toán lại rating của tour
        const reviews = await Review.find({ tour: tourId });
        const totalRating = reviews.reduce((total, review) => {
            return total + review.rating;
        }, 0);
        const averageRating = totalRating / reviews.length;

        tour.rating = averageRating;
        await tour.save();

        res.status(200).json({ message: "Review added successfully", savedReview });
    } catch (err) {
        next(err);
    }
};




