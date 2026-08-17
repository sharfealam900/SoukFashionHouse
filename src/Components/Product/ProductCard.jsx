import React, { useEffect, useState } from "react";
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

  // =====================================================
  // AUTH
  // =====================================================

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // =====================================================
  // WISHLIST
  // =====================================================

  const { wishlist } = useSelector(
    (state) => state.wishlist
  );

  const isWishlisted = wishlist.some(
    (item) =>
      item?._id?.toString() ===
      product?._id?.toString()
  );

  // =====================================================
  // PRODUCT IMAGES
  // =====================================================

  const images =
    Array.isArray(product?.images)
      ? product.images.filter(
          (image) => image?.url
        )
      : [];

  // Current slide
  const [currentImage, setCurrentImage] =
    useState(0);

  // Is mouse currently over product?
  const [isHovering, setIsHovering] =
    useState(false);

  // =====================================================
  // AUTO IMAGE SLIDER
  // =====================================================

  useEffect(() => {
    // Don't start slider if:
    // - user isn't hovering
    // - product has only one image
    if (
      !isHovering ||
      images.length <= 1
    ) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage((previous) => {
        if (
          previous >=
          images.length - 1
        ) {
          return 0;
        }

        return previous + 1;
      });
    }, 1300);

    return () => {
      clearInterval(interval);
    };
  }, [
    isHovering,
    images.length,
  ]);

  // =====================================================
  // MOUSE ENTER
  // =====================================================

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  // =====================================================
  // MOUSE LEAVE
  // =====================================================

  const handleMouseLeave = () => {
    setIsHovering(false);

    /*
      IMPORTANT:
      We DO NOT reset currentImage to 0.

      This prevents the card from suddenly
      jumping back to the first image.
    */
  };

  // =====================================================
  // PRICE CALCULATION
  // =====================================================

  const discount = Number(
    product?.discount || 0
  );

  const originalPrice = Number(
    product?.price || 0
  );

  const finalPrice =
    originalPrice -
    (originalPrice * discount) / 100;

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Product stock
    if (
      Number(product?.stock || 0) <= 0
    ) {
      toast.error(
        "Product is out of stock"
      );
      return;
    }

    // Authentication
    if (!isAuthenticated) {
      toast.error(
        "Please login first"
      );
      return;
    }

    try {
      await addToCart(product._id);

      const { data } =
        await getCart();

      dispatch(
        setCart(data.cart)
      );

      toast.success(
        "Product added to cart"
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Unable to add product"
      );
    }
  };

  // =====================================================
  // WISHLIST
  // =====================================================

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(
        "Please login first"
      );
      return;
    }

    try {
      if (isWishlisted) {
        await removeWishlistItem(
          product._id
        );

        toast.success(
          "Removed from wishlist"
        );
      } else {
        await addToWishlist(
          product._id
        );

        toast.success(
          "Added to wishlist"
        );
      }

      const { data } =
        await getWishlist();

      dispatch(
        setWishlist(
          data.wishlist
            ?.products || []
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Wishlist update failed"
      );
    }
  };

  // =====================================================
  // IMAGE SLIDER POSITION
  // =====================================================

  const sliderPosition =
    currentImage * 100;

  // =====================================================
  // PRODUCT CARD
  // =====================================================

  return (
    <Link
      to={`/products/${product._id}`}
      className="premium-product-card"
      onMouseEnter={
        handleMouseEnter
      }
      onMouseLeave={
        handleMouseLeave
      }
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >

      {/* =================================================
          IMAGE SECTION
      ================================================= */}

      <div className="premium-image-wrapper">

        {/* ===============================
            BESTSELLER
        =============================== */}

        {product.featured && (
          <span className="premium-badge">
            Bestseller
          </span>
        )}

        {/* ===============================
            DISCOUNT
        =============================== */}

        {discount > 0 && (
          <span className="discount-badge">
            {discount}% OFF
          </span>
        )}

        {/* ===============================
            WISHLIST BUTTON
        =============================== */}

        <button
          type="button"
          className="premium-wishlist"
          onClick={
            handleWishlist
          }
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          <FaHeart
            color={
              isWishlisted
                ? "#E53935"
                : "#666"
            }
          />
        </button>

        {/* ===============================
            IMAGE SLIDER VIEWPORT
        =============================== */}

        <div className="product-slider-viewport">

          {/* =============================
              IMAGE SLIDER TRACK
          ============================= */}

          {images.length > 0 ? (
            <div
              className="product-slider-track"
              style={{
                transform: `translateX(-${sliderPosition}%)`,
              }}
            >

              {images.map(
                (image, index) => (
                  <div
                    className="product-slide"
                    key={
                      image._id ||
                      image.public_id ||
                      image.url ||
                      index
                    }
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${
                        index + 1
                      }`}
                      className={
                        product.stock <= 0
                          ? "product-disabled-image"
                          : ""
                      }
                    />
                  </div>
                )
              )}

            </div>
          ) : (
            <div className="product-slide">
              <img
                src="https://via.placeholder.com/700x900"
                alt={product.name}
              />
            </div>
          )}

        </div>

        {/* ===============================
            OUT OF STOCK
        =============================== */}

        {Number(
          product?.stock || 0
        ) <= 0 && (
          <div className="out-stock-overlay">
            <span>
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* ===============================
            IMAGE DOTS
        =============================== */}

        {images.length > 1 && (
          <div className="product-image-dots">

            {images.map(
              (_, index) => (
                <span
                  key={index}
                  className={
                    currentImage === index
                      ? "image-dot active"
                      : "image-dot"
                  }
                />
              )
            )}

          </div>
        )}

      </div>

      {/* =================================================
          PRODUCT CONTENT
      ================================================= */}

      <div className="premium-content">

        {/* ===============================
            RATING
        =============================== */}

        <div className="product-rating">

          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />

          <span>
            {product.averageRating
              ? Number(
                  product.averageRating
                ).toFixed(1)
              : "4.8"}
          </span>

        </div>

        {/* ===============================
            CATEGORY
        =============================== */}

        <span className="product-category">
          {product.category?.name ||
            ""}
        </span>

        {/* ===============================
            PRODUCT NAME
        =============================== */}

        <h3>
          {product.name}
        </h3>

        {/* ===============================
            PRICE
        =============================== */}

        <div className="price-box">

          <span className="current-price">
            ₹
            {finalPrice.toFixed(0)}
          </span>

          {discount > 0 && (
            <span className="previous-price">
              ₹
              {originalPrice.toFixed(0)}
            </span>
          )}

        </div>

        {/* ===============================
            STOCK STATUS
        =============================== */}

        <div className="stock-status">

          {Number(
            product?.stock || 0
          ) > 0 ? (
            <span className="in-stock">
              In Stock
            </span>
          ) : (
            <span className="out-stock">
              Out of Stock
            </span>
          )}

        </div>

        {/* ===============================
            ADD TO CART
        =============================== */}

        <button
          type="button"
          className={`premium-cart-btn ${
            Number(
              product?.stock || 0
            ) <= 0
              ? "disabled-cart-btn"
              : ""
          }`}
          disabled={
            Number(
              product?.stock || 0
            ) <= 0
          }
          onClick={
            handleAddToCart
          }
        >

          <FaShoppingBag />

          {Number(
            product?.stock || 0
          ) <= 0
            ? "Out of Stock"
            : "Add to Cart"}

        </button>

      </div>

    </Link>
  );
}