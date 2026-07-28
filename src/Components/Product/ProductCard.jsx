import React from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingBag,
  FaHeart,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import {
  addToCart,
  getCart,
} from "../../features/cart/cartApi";
import { setCart } from "../../features/cart/cartSlice";

import {
  addToWishlist,
  removeWishlistItem,
  getWishlist,
} from "../../features/wishlist/wishlistApi";

import { setWishlist } from "../../features/wishlist/wishlistSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const { wishlist } = useSelector(
    (state) => state.wishlist
  );

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const isWishlisted = wishlist.some(
    (item) => item._id === product._id
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    try {
      await addToCart(product._id);

      const { data } = await getCart();

      dispatch(setCart(data.cart));

      toast.success("Product added to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to add product"
      );
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    try {
      if (isWishlisted) {
        await removeWishlistItem(product._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product._id);
        toast.success("Added to wishlist");
      }

      const { data } = await getWishlist();

      dispatch(setWishlist(data.wishlist?.products || []));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Wishlist update failed"
      );
    }
  };

  // ===== Price Calculation =====

  const discount = Number(product.discount || 0);

  const finalPrice =
    product.price -
    (product.price * discount) / 100;

  return (
    <Link
      to={`/products/${product._id}`}
      className="premium-product-card"
    >
      <div className="premium-image-wrapper">
        {product.featured && (
          <span className="premium-badge">
            Bestseller
          </span>
        )}

        {discount > 0 && (
          <span className="discount-badge">
            {discount}% OFF
          </span>
        )}

        <button
          className="premium-wishlist"
          onClick={handleWishlist}
        >
          <FaHeart
            color={
              isWishlisted ? "#E53935" : "#666"
            }
          />
        </button>

        <img
          src={
            product.images?.length
              ? product.images[0].url
              : "https://via.placeholder.com/700x900"
          }
          alt={product.name}
        />
      </div>

      <div className="premium-content">
        <div className="product-rating">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />

          <span>4.8</span>
        </div>

        <span className="product-category">
          {product.category?.name}
        </span>

        <h3>{product.name}</h3>

        <div className="price-box">
          <span className="current-price">
            ₹{finalPrice.toFixed(0)}
          </span>

          {discount > 0 && (
            <span className="previous-price">
              ₹{product.price}
            </span>
          )}
        </div>

        <button
          className="premium-cart-btn"
          onClick={handleAddToCart}
        >
          <FaShoppingBag />
          Add to Cart
        </button>
      </div>
    </Link>
  );
}