import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { createReview, updateReview, deleteReview, } from "../../features/review/reviewApi";

export default function ReviewForm({
    productId,
    review,
    onReviewAdded,


}) {
    const [rating, setRating] = useState(5);

    const [hover, setHover] = useState(0);

    const [comment, setComment] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setComment(review.comment);
        } else {
            setRating(5);
            setComment("");
        }
    }, [review]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment.trim()) {
            return toast.error("Please write a review.");
        }

        try {
            setLoading(true);

            let data;

            if (review) {

                const response = await updateReview(
                    review._id,
                    {
                        rating,
                        comment,
                    }
                );

                data = response.data;

            } else {

                const response = await createReview({
                    product: productId,
                    rating,
                    comment,
                });

                data = response.data;

            }

            if (data.success) {
                toast.success(
                    review
                        ? "Review updated successfully!"
                        : "Review submitted successfully!"
                );

                setRating(5);
                setComment("");

                if (onReviewAdded) {
                    onReviewAdded();
                }
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async () => {
        if (!review) return;

        const result = await Swal.fire({
            title: "Delete Review?",
            text: "You won't be able to recover this review.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            setLoading(true);

            const { data } = await deleteReview(review._id);

            if (data.success) {
                toast.success("Review deleted successfully!");

                setRating(5);
                setComment("");

                if (onReviewAdded) {
                    onReviewAdded();
                }
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to delete review."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-form">

            <h2>Write a Review</h2>

            <form onSubmit={handleSubmit}>

                <div className="rating-select">

                    {[1, 2, 3, 4, 5].map((star) => (

                        <FaStar
                            key={star}
                            size={30}
                            className="star"
                            color={
                                star <= (hover || rating)
                                    ? "#d4af37"
                                    : "#ddd"
                            }
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                        />

                    ))}

                </div>

                <textarea
                    rows="5"
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <div className="review-actions">

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? review
                                ? "Updating..."
                                : "Submitting..."
                            : review
                                ? "Update Review"
                                : "Submit Review"}
                    </button>

                    {review && (
                        <button
                            type="button"
                            className="delete-review-btn"
                            onClick={handleDelete}
                        >
                            Delete Review
                        </button>
                    )}

                </div>

            </form>

        </div>
    );
}