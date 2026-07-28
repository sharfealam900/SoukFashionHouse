import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

import { getProductReviews } from "../../features/review/reviewApi";
import ReviewCard from "./ReviewCard";
import { useSelector } from "react-redux";
import ReviewForm from "./ReviewForm";

export default function ReviewList({ productId, refresh, onReviewAdded }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);

    const fetchReviews = async () => {
        try {
            setLoading(true);

            const { data } = await getProductReviews(productId);

            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId, refresh]);

    if (loading) {
        return (
            <p className="review-loading">
                Loading reviews...
            </p>
        );
    }

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length
            ).toFixed(1)
            : 0;

    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((review) => review.rating === star).length,
    }));

    const myReview = reviews.find(
        (review) => review.user?._id === user?._id
    );
 

    return (
        <section className="review-section">
            <ReviewForm
                productId={productId}
                review={myReview}
                onReviewAdded={() => {
                    fetchReviews();

                    if (onReviewAdded) {
                        onReviewAdded();
                    }
                }}
            />
            <div className="review-summary">
                <h2>Customer Reviews</h2>

                <div className="review-average">
                    <span className="average-rating">
                        {averageRating}
                    </span>

                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                color={
                                    star <= Math.round(averageRating)
                                        ? "#d4af37"
                                        : "#ddd"
                                }
                            />
                        ))}
                    </div>

                    <p>
                        {reviews.length}{" "}
                        {reviews.length === 1 ? "Review" : "Reviews"}
                    </p>
                </div>

                {/* Rating Breakdown */}
                <div className="rating-breakdown">
                    {ratingCounts.map(({ star, count }) => (
                        <div key={star} className="rating-row">
                            <span>{star} ★</span>

                            <div className="rating-bar">
                                <div
                                    className="rating-fill"
                                    style={{
                                        width: `${reviews.length
                                                ? (count / reviews.length) * 100
                                                : 0
                                            }%`,
                                    }}
                                />
                            </div>

                            <span>{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <ReviewCard
                        key={review._id}
                        review={review}
                    />
                ))
            ) : (
                <div className="no-review">
                    <h3>No Reviews Yet</h3>
                    <p>Be the first to review this product.</p>
                </div>
            )}
        </section>
    );
}