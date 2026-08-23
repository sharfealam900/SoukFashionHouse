import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaShoppingBag,
  FaHeart,
  FaStar,
  FaTimes,
} from "react-icons/fa";

import toast from "react-hot-toast";

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

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const { wishlist = [] } = useSelector(
    (state) => state.wishlist
  );

  const images = useMemo(() => {
    if (!Array.isArray(product?.images)) {
      return [];
    }

    return product.images.filter(
      (image) => image?.url
    );
  }, [product?.images]);

  const isWishlisted = wishlist.some(
    (item) =>
      item?._id?.toString() ===
      product?._id?.toString()
  );

  const [currentImage, setCurrentImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const [showSizeModal, setShowSizeModal] =
    useState(false);

  const [selectedSize, setSelectedSize] =
    useState(null);

  const [addingToCart, setAddingToCart] =
    useState(false);

  const getProductSizes = () => {
    let sizes = product?.sizes || [];

    if (
      Array.isArray(sizes) &&
      sizes.length === 1 &&
      typeof sizes[0] === "string"
    ) {
      try {
        sizes = JSON.parse(sizes[0]);
      } catch (error) {
        console.error(
          "Invalid product sizes:",
          error
        );

        sizes = [];
      }
    }

    if (!Array.isArray(sizes)) {
      return [];
    }

    return sizes
      .map((item) => {
        if (
          item === null ||
          item === undefined
        ) {
          return null;
        }

        if (
          typeof item === "object"
        ) {
          return {
            size: item.size,
            stock: Number(item.stock || 0),
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  const productSizes = useMemo(
    () => getProductSizes(),
    [product?.sizes]
  );

  const hasSizes = productSizes.length > 0;

  const hasAvailableSize =
    productSizes.some(
      (item) => Number(item.stock) > 0
    );

  const isOutOfStock = hasSizes
    ? !hasAvailableSize
    : Number(product?.stock || 0) <= 0;

  const discount = Number(
    product?.discount || 0
  );

  const originalPrice = Number(
    product?.price || 0
  );

  const finalPrice =
    originalPrice -
    (originalPrice * discount) / 100;

  const currentImageData =
    images[currentImage] || null;

  const nextImageIndex =
    images.length > 1
      ? (currentImage + 1) % images.length
      : currentImage;

  const nextImageData =
    images[nextImageIndex] || null;

  /*
   * Keep current image valid if the product
   * images change after the component renders.
   */
  useEffect(() => {
    if (currentImage >= images.length) {
      setCurrentImage(0);
    }
  }, [currentImage, images.length]);

  /*
   * Preload the next image only when the
   * user interacts with the card.
   *
   * This avoids downloading every product
   * image during initial page load.
   */
  useEffect(() => {
    if (!isHovering || !nextImageData?.url) {
      return;
    }

    const image = new Image();
    image.src = nextImageData.url;
  }, [
    isHovering,
    nextImageData?.url,
  ]);

  /*
   * Auto image slider while hovering.
   */
  useEffect(() => {
    if (
      !isHovering ||
      images.length <= 1
    ) {
      return undefined;
    }

    const interval = setInterval(() => {
      setCurrentImage((previous) => {
        if (
          previous >= images.length - 1
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

  const handleMouseEnter = () => {
    if (images.length > 1) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const closeSizeModal = () => {
    if (addingToCart) {
      return;
    }

    setShowSizeModal(false);
    setSelectedSize(null);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (addingToCart) {
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    if (isOutOfStock) {
      toast.error("Product is out of stock");
      return;
    }

    if (hasSizes) {
      setSelectedSize(null);
      setShowSizeModal(true);
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(
        product._id,
        1,
        null
      );

      /*
       * Keep the existing Redux behavior
       * until the backend cart response is
       * verified.
       */
      const { data } = await getCart();

      dispatch(
        setCart(data.cart)
      );

      toast.success(
        "Product added to cart"
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        toast.error(
          "Please login first"
        );
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Unable to add product"
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSizeAddToCart =
    async () => {
      if (addingToCart) {
        return;
      }

      if (!selectedSize) {
        toast.error(
          "Please select a size"
        );
        return;
      }

      const selectedSizeData =
        productSizes.find(
          (item) =>
            String(item.size) ===
            String(selectedSize)
        );

      if (!selectedSizeData) {
        toast.error(
          "Selected size is unavailable"
        );
        return;
      }

      if (
        Number(
          selectedSizeData.stock
        ) <= 0
      ) {
        toast.error(
          "Selected size is out of stock"
        );
        return;
      }

      try {
        setAddingToCart(true);

        await addToCart(
          product._id,
          1,
          selectedSize
        );

        const { data } =
          await getCart();

        dispatch(
          setCart(data.cart)
        );

        setShowSizeModal(false);
        setSelectedSize(null);

        toast.success(
          "Product added to cart"
        );
      } catch (error) {
        console.error(
          "Size cart error:",
          error
        );

        if (
          error.response?.status === 401
        ) {
          toast.error(
            "Please login first"
          );
          return;
        }

        toast.error(
          error.response?.data?.message ||
            "Unable to add product"
        );
      } finally {
        setAddingToCart(false);
      }
    };

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

      /*
       * Keep the existing Redux behavior
       * until the wishlist API response is
       * verified.
       */
      const { data } =
        await getWishlist();

      dispatch(
        setWishlist(
          data.wishlist?.products || []
        )
      );
    } catch (error) {
      console.error(
        "Wishlist update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Wishlist update failed"
      );
    }
  };

  const sliderPosition =
    currentImage * 100;

  return (
    <>
      <Link
        to={`/products/${product.slug}`}
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
            type="button"
            className="premium-wishlist"
            onClick={handleWishlist}
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

          <div className="product-slider-viewport">
            {currentImageData ? (
              <div
                className="product-slider-track"
                style={{
                  transform: `translateX(-${sliderPosition}%)`,
                }}
              >
                <div
                  className="product-slide"
                  key={
                    currentImageData._id ||
                    currentImageData.public_id ||
                    currentImageData.url ||
                    "current-image"
                  }
                >
                  <img
                    src={currentImageData.url}
                    alt={`${product.name} 1`}
                    className={
                      isOutOfStock
                        ? "product-disabled-image"
                        : ""
                    }
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {nextImageData &&
                  images.length > 1 && (
                    <div
                      className="product-slide"
                      key={
                        nextImageData._id ||
                        nextImageData.public_id ||
                        nextImageData.url ||
                        "next-image"
                      }
                      style={{
                        visibility:
                          "hidden",
                      }}
                      aria-hidden="true"
                    >
                      <img
                        src={nextImageData.url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
              </div>
            ) : (
              <div className="product-slide">
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f5f5f5",
                  }}
                >
                  <span>
                    No Image
                  </span>
                </div>
              </div>
            )}
          </div>

          {isOutOfStock && (
            <div className="out-stock-overlay">
              <span>
                OUT OF STOCK
              </span>
            </div>
          )}

          {images.length > 1 && (
            <div className="product-image-dots">
              {images.map(
                (image, index) => (
                  <span
                    key={
                      image._id ||
                      image.public_id ||
                      image.url ||
                      index
                    }
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

        <div className="premium-content">
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

          <span className="product-category">
            {product.category?.name || ""}
          </span>

          <h3>
            {product.name}
          </h3>

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

          <div className="stock-status">
            {!isOutOfStock ? (
              <span className="in-stock">
                In Stock
              </span>
            ) : (
              <span className="out-stock">
                Out of Stock
              </span>
            )}
          </div>

          <button
            type="button"
            className={`premium-cart-btn ${
              isOutOfStock
                ? "disabled-cart-btn"
                : ""
            }`}
            disabled={
              isOutOfStock ||
              addingToCart
            }
            onClick={
              handleAddToCart
            }
          >
            <FaShoppingBag />

            {isOutOfStock
              ? "Out of Stock"
              : addingToCart
                ? "Adding..."
                : "Add to Cart"}
          </button>
        </div>
      </Link>

      {showSizeModal && (
        <div
          className="product-size-modal-overlay"
          onClick={
            closeSizeModal
          }
        >
          <div
            className="product-size-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              type="button"
              className="product-size-modal-close"
              onClick={
                closeSizeModal
              }
              disabled={
                addingToCart
              }
            >
              <FaTimes />
            </button>

            <div className="product-size-modal-header">
              <span className="product-size-modal-label">
                SELECT YOUR SIZE
              </span>

              <h2>
                Choose Your Size
              </h2>

              <p>
                Select your preferred
                size before adding
                this product to your
                cart.
              </p>
            </div>

            <div className="product-size-preview">
              <div className="product-size-preview-image">
                {images[0]?.url && (
                  <img
                    src={images[0].url}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>

              <div className="product-size-preview-info">
                <span>
                  {product.category?.name ||
                    "Collection"}
                </span>

                <h4>
                  {product.name}
                </h4>

                <strong>
                  ₹
                  {finalPrice.toFixed(0)}
                </strong>
              </div>
            </div>

            <div className="product-size-selection-header">
              <div>
                <strong>
                  Select Size
                </strong>

                <span>
                  Required
                </span>
              </div>

              {selectedSize && (
                <small>
                  Selected:{" "}
                  {selectedSize}
                </small>
              )}
            </div>

            <div className="product-size-options">
              {productSizes.map(
                (item, index) => {
                  const size =
                    item.size;

                  const stock =
                    Number(
                      item.stock || 0
                    );

                  const available =
                    stock > 0;

                  const selected =
                    String(
                      selectedSize
                    ) ===
                    String(size);

                  return (
                    <button
                      key={`${size}-${index}`}
                      type="button"
                      disabled={
                        !available ||
                        addingToCart
                      }
                      className={`
                        product-size-option
                        ${
                          selected
                            ? "selected"
                            : ""
                        }
                        ${
                          !available
                            ? "unavailable"
                            : ""
                        }
                      `}
                      onClick={() => {
                        if (available) {
                          setSelectedSize(
                            size
                          );
                        }
                      }}
                    >
                      <span>
                        {size}
                      </span>

                      {!available && (
                        <small>
                          Out of Stock
                        </small>
                      )}
                    </button>
                  );
                }
              )}
            </div>

            {selectedSize && (
              <div className="product-size-selected-info">
                <span>
                  Selected Size
                </span>

                <strong>
                  {selectedSize}
                </strong>
              </div>
            )}

            <button
              type="button"
              className="product-size-add-cart"
              disabled={
                !selectedSize ||
                addingToCart
              }
              onClick={
                handleSizeAddToCart
              }
            >
              <FaShoppingBag />

              {addingToCart
                ? "Adding..."
                : selectedSize
                  ? "Add to Cart"
                  : "Select a Size"}
            </button>

            <button
              type="button"
              className="product-size-continue"
              onClick={
                closeSizeModal
              }
              disabled={
                addingToCart
              }
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
}