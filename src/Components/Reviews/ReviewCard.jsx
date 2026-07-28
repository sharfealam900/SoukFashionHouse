import React from "react";
import { FaStar } from "react-icons/fa";

export default function ReviewCard({ review }) {
  return (
    <div className="review-card">

      <div className="review-header">

        <div className="review-user">

          <img
            src={
              review.user?.profilePhoto ||
              "https://ui-avatars.com/api/?name=User&background=1d2746&color=fff"
            }
            alt={review.user?.fullname}
            className="review-avatar"
          />

          <div>

            <h4>{review.user?.fullname}</h4>

            <span>
              {new Date(review.createdAt).toLocaleDateString()}
            </span>

          </div>

        </div>

        <div className="review-rating">

          {[1, 2, 3, 4, 5].map((star) => (

            <FaStar
              key={star}
              color={
                star <= review.rating
                  ? "#d4af37"
                  : "#ddd"
              }
            />

          ))}

        </div>

      </div>

      <p className="review-comment">
        {review.comment}
      </p>

    </div>
  );
}