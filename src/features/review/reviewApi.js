import api from "../../api/axios";

// ==============================
// Get Product Reviews
// ==============================
export const getProductReviews = (productId) => {
  return api.get(`/reviews/${productId}`);
};

// ==============================
// Create Review
// ==============================
export const createReview = (reviewData) => {
  return api.post("/reviews", reviewData);
};

// ==============================
// Update Review
// ==============================
export const updateReview = (reviewId, reviewData) => {
  return api.put(`/reviews/${reviewId}`, reviewData);
};

// ==============================
// Delete Review
// ==============================
export const deleteReview = (reviewId) => {
  return api.delete(`/reviews/${reviewId}`);
};