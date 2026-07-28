import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

// ==============================
// Update Product Rating
// ==============================
const updateProductRating = async (productId) => {
    const reviews = await Review.find({ product: productId });

    const totalReviews = reviews.length;

    const averageRating =
        totalReviews === 0
            ? 0
            : reviews.reduce((acc, item) => acc + item.rating, 0) / totalReviews;

    await Product.findByIdAndUpdate(productId, {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews,
    });
};

// ==============================
// Create Review
// ==============================
export const createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body;

        const existingReview = await Review.findOne({
            user: req.user._id,
            product,
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product.",
            });
        }

        const review = await Review.create({
            user: req.user._id,
            product,
            rating,
            comment,
        });

        await updateProductRating(product);

        res.status(201).json({
            success: true,
            message: "Review added successfully.",
            review,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==============================
// Get Product Reviews
// ==============================
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            product: req.params.productId,
        })
            .populate("user", "fullname profilePhoto")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==============================
// Update Review
// ==============================
export const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found.",
            });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        review.rating = rating;
        review.comment = comment;

        await review.save();

        await updateProductRating(review.product);

        res.status(200).json({
            success: true,
            message: "Review updated successfully.",
            review,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==============================
// Delete Review
// ==============================
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found.",
            });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized.",
            });
        }

        const productId = review.product;

        await review.deleteOne();

        await updateProductRating(productId);

        res.status(200).json({
            success: true,
            message: "Review deleted successfully.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};