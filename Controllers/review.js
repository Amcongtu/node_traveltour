import Review from "../models/Review.js";
import Tour from "../models/Tour.js";

export const insertReview = async (req, res, next) => {
  try {
    const { comment, rating, tourId, customerId } = req.body;
    var ratingEdit = rating
    if (!rating) {
      ratingEdit = 1
    }
    // Tạo một document mới cho review
    const newReview = new Review({

      comment,
      rating: ratingEdit,
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

    tour.reviews.push(savedReview);

    tour.rating = averageRating;
    await tour.save();

    res.status(200).json({ message: "Review added successfully", savedReview });
  } catch (err) {
    next(err);
  }
};

// export const deleteReview = async (req, res, next) => {
//     try {
//       const reviewId = req.params.id;


//       // Xóa review khỏi database
//       const deletedReview = await Review.findByIdAndDelete(reviewId);
//       if (!deletedReview) {
//         return res.status(404).json({ message: "Review not found" });
//       }

//       // Tìm tour tương ứng và cập nhật lại rating
//       const tour = await Tour.findById(deletedReview.tour);
//       if (!tour) {
//         return res.status(404).json({ message: "Tour not found" });
//       }

//       // Tính toán lại rating của tour
//       const reviews = await Review.find({ tour: deletedReview.tour });
//       const totalRating = reviews.reduce((total, review) => {
//         return total + review.rating;
//       }, 0);
//       const averageRating = totalRating / reviews.length;

//       tour.rating = averageRating;
//       await tour.save();

//       res.status(200).json({ message: "Review deleted successfully", deletedReview });
//     } catch (err) {
//       next(err);
//     }
//   };

export const deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const userId = req.body.userId; // Assuming user ID is available in the request

    // Kiểm tra xem người dùng đã đăng review này hay chưa
    const review = await Review.findOne({ _id: reviewId, customer: userId });
    if (!review) {
      return res.status(403).json({ message: "You are not authorized to delete this review" });
    }

    // Xóa review khỏi database
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    // Tìm tour tương ứng và cập nhật lại rating
    const tour = await Tour.findById(deletedReview.tour);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Tính toán lại rating của tour
    const reviews = await Review.find({ tour: deletedReview.tour });
    const totalRating = reviews.reduce((total, review) => {
      return total + review.rating;
    }, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    tour.rating = averageRating;
    await tour.save();

   return res.status(200).json({ message: "Review deleted successfully",data: deletedReview });
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const { comment, rating } = req.body;

    // Tìm review trong database
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Cập nhật thông tin review

    review.comment = comment;
    review.rating = rating;

    // Lưu review đã được cập nhật vào database
    const updatedReview = await review.save();

    // Tìm tour tương ứng và cập nhật lại rating
    const tour = await Tour.findById(review.tour);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Tính toán lại rating của tour
    const reviews = await Review.find({ tour: review.tour });
    const totalRating = reviews.reduce((total, review) => {
      return total + review.rating;
    }, 0);
    const averageRating = totalRating / reviews.length;

    tour.rating = averageRating;
    await tour.save();

    res.status(200).json({ message: "Review updated successfully", updatedReview });
  } catch (err) {
    next(err);
  }
};


export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

export const getAllReviewsOfTour = async (req, res, next) => {
  try {
    const tourID = req.params.id;

    // Truy vấn danh sách review dựa vào tourID
    const reviews = await Review.find({ tour: tourID }).sort({ createdAt: "desc" }).populate("customer");

    return res.status(200).json({ message: "Successfully", data: reviews });
  } catch (error) {

    next(error)
  }
}