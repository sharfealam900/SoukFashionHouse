import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  FaShoppingBag,
  FaHeart,
  FaStar,
  FaTimes,
} from "react-icons/fa";

import { toast } from "react-hot-toast";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  addToCart,
  getCart,
} from "../../features/cart/cartApi";

import {
  setCart,
} from "../../features/cart/cartSlice";

import {
  addToWishlist,
  removeWishlistItem,
  getWishlist,
} from "../../features/wishlist/wishlistApi";

import {
  setWishlist,
} from "../../features/wishlist/wishlistSlice";


export default function ProductCard({ product }) {

  const dispatch = useDispatch();


  // =====================================================
  // AUTH
  // =====================================================

  const { isAuthenticated } =
    useSelector(
      (state) => state.auth
    );


  // =====================================================
  // WISHLIST
  // =====================================================

  const { wishlist } =
    useSelector(
      (state) => state.wishlist
    );

  const isWishlisted =
    wishlist.some(
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


  // Current image
  const [currentImage, setCurrentImage] =
    useState(0);


  // Mouse hover
  const [isHovering, setIsHovering] =
    useState(false);


  // =====================================================
  // SIZE MODAL
  // =====================================================

  const [showSizeModal, setShowSizeModal] =
    useState(false);

  const [selectedSize, setSelectedSize] =
    useState(null);

  const [addingToCart, setAddingToCart] =
    useState(false);


  // =====================================================
  // NORMALIZE PRODUCT SIZES
  // =====================================================

  const getProductSizes = () => {

    let sizes =
      product?.sizes || [];


    /*
      Sometimes sizes can arrive like:

      [
        "[{\"size\":38,\"stock\":5}]"
      ]

      Normalize that format.
    */

    if (
      Array.isArray(sizes) &&
      sizes.length === 1 &&
      typeof sizes[0] === "string"
    ) {

      try {

        sizes = JSON.parse(
          sizes[0]
        );

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


        /*
          If size is already an object
        */

        if (
          typeof item === "object"
        ) {

          return {
            size: item.size,
            stock: Number(
              item.stock || 0
            ),
          };

        }


        return null;

      })
      .filter(Boolean);

  };


  const productSizes =
    getProductSizes();


  // =====================================================
  // HAS SIZE
  // =====================================================

  const hasSizes =
    productSizes.length > 0;


  // =====================================================
  // SIZE STOCK
  // =====================================================

  const hasAvailableSize =
    productSizes.some(
      (item) =>
        Number(item.stock) > 0
    );


  // =====================================================
  // PRODUCT STOCK
  // =====================================================

  /*
    Important:

    For a size-based product, the individual
    size stock should determine availability.

    Do NOT rely only on product.stock.
  */

  const isOutOfStock =
    hasSizes
      ? !hasAvailableSize
      : Number(
          product?.stock || 0
        ) <= 0;


  // =====================================================
  // AUTO IMAGE SLIDER
  // =====================================================

  useEffect(() => {

    if (
      !isHovering ||
      images.length <= 1
    ) {
      return;
    }


    const interval =
      setInterval(() => {

        setCurrentImage(
          (previous) => {

            if (
              previous >=
              images.length - 1
            ) {
              return 0;
            }

            return previous + 1;

          }
        );

      }, 1300);


    return () => {

      clearInterval(
        interval
      );

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
      Do NOT reset currentImage.

      This keeps the existing behavior.
    */

  };


  // =====================================================
  // PRICE CALCULATION
  // =====================================================

  const discount =
    Number(
      product?.discount || 0
    );


  const originalPrice =
    Number(
      product?.price || 0
    );


  const finalPrice =
    originalPrice -
    (
      originalPrice *
      discount
    ) / 100;


  // =====================================================
  // CLOSE SIZE MODAL
  // =====================================================

  const closeSizeModal = () => {

    if (addingToCart) {
      return;
    }

    setShowSizeModal(false);

    setSelectedSize(null);

  };


  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async (e) => {

    e.preventDefault();
    e.stopPropagation();


    // ---------------------------------------------------
    // AUTHENTICATION
    // ---------------------------------------------------

    if (!isAuthenticated) {

      toast.error(
        "Please login first"
      );

      return;

    }


    // ---------------------------------------------------
    // PRODUCT OUT OF STOCK
    // ---------------------------------------------------

    if (isOutOfStock) {

      toast.error(
        "Product is out of stock"
      );

      return;

    }


    // ---------------------------------------------------
    // PRODUCT HAS SIZE
    // ---------------------------------------------------

    if (hasSizes) {

      /*
        Instead of showing:

        "Please select a size"

        open the premium size selector.
      */

      setSelectedSize(null);

      setShowSizeModal(true);

      return;

    }


    // ---------------------------------------------------
    // PRODUCT WITHOUT SIZE
    // ---------------------------------------------------

    try {

      setAddingToCart(true);


      await addToCart(
        product._id,
        1,
        null
      );


      const { data } =
        await getCart();


      dispatch(
        setCart(
          data.cart
        )
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
        error.response?.data
          ?.message ||
        "Unable to add product"
      );


    } finally {

      setAddingToCart(false);

    }

  };


  // =====================================================
  // ADD SELECTED SIZE TO CART
  // =====================================================

  const handleSizeAddToCart =
    async () => {

      if (!selectedSize) {

        toast.error(
          "Please select a size"
        );

        return;

      }


      // -------------------------------------------------
      // FIND SELECTED SIZE
      // -------------------------------------------------

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


      // -------------------------------------------------
      // CHECK SIZE STOCK
      // -------------------------------------------------

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


        // ------------------------------------------------
        // SEND SIZE TO BACKEND
        // ------------------------------------------------

        await addToCart(
          product._id,
          1,
          selectedSize
        );


        // ------------------------------------------------
        // REFRESH CART
        // ------------------------------------------------

        const { data } =
          await getCart();


        dispatch(
          setCart(
            data.cart
          )
        );


        // ------------------------------------------------
        // CLOSE MODAL
        // ------------------------------------------------

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
          error.response?.data
            ?.message ||
          "Unable to add product"
        );


      } finally {

        setAddingToCart(false);

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

    <>

      {/* =================================================
          EXISTING PRODUCT CARD
      ================================================= */}

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

        {/* ===============================================
            IMAGE SECTION
        =============================================== */}

        <div className="premium-image-wrapper">


          {/* BESTSELLER */}

          {product.featured && (

            <span className="premium-badge">

              Bestseller

            </span>

          )}


          {/* DISCOUNT */}

          {discount > 0 && (

            <span className="discount-badge">

              {discount}% OFF

            </span>

          )}


          {/* WISHLIST */}

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


          {/* IMAGE SLIDER */}

          <div className="product-slider-viewport">

            {images.length > 0 ? (

              <div
                className="product-slider-track"
                style={{
                  transform:
                    `translateX(-${sliderPosition}%)`,
                }}
              >

                {images.map(
                  (
                    image,
                    index
                  ) => (

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
                        src={
                          image.url
                        }
                        alt={
                          `${product.name} ${index + 1}`
                        }
                        className={
                          isOutOfStock
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
                  alt={
                    product.name
                  }
                />

              </div>

            )}

          </div>


          {/* OUT OF STOCK */}

          {isOutOfStock && (

            <div className="out-stock-overlay">

              <span>

                OUT OF STOCK

              </span>

            </div>

          )}


          {/* IMAGE DOTS */}

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


          {/* RATING */}

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


          {/* CATEGORY */}

          <span className="product-category">

            {product.category?.name ||
              ""}

          </span>


          {/* PRODUCT NAME */}

          <h3>

            {product.name}

          </h3>


          {/* PRICE */}

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


          {/* STOCK */}

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


          {/* ADD TO CART */}

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


      {/* =================================================
          PREMIUM SIZE MODAL
      ================================================= */}

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


            {/* =========================================
                CLOSE BUTTON
            ========================================= */}

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


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="product-size-modal-header">

              <span className="product-size-modal-label">

                SELECT YOUR SIZE

              </span>


              <h2>

                Choose Your Size

              </h2>


              <p>

                Select your preferred size
                before adding this product
                to your cart.

              </p>

            </div>


            {/* =========================================
                PRODUCT PREVIEW
            ========================================= */}

            <div className="product-size-preview">

              <div className="product-size-preview-image">

                {images.length > 0 && (

                  <img
                    src={
                      images[0].url
                    }
                    alt={
                      product.name
                    }
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


            {/* =========================================
                SIZE HEADER
            ========================================= */}

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

                  Selected:
                  {" "}
                  {selectedSize}

                </small>

              )}

            </div>


            {/* =========================================
                SIZE OPTIONS
            ========================================= */}

            <div className="product-size-options">

              {productSizes.map(
                (
                  item,
                  index
                ) => {

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
                      key={
                        `${size}-${index}`
                      }
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

                        if (
                          available
                        ) {

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


            {/* =========================================
                SELECTED SIZE INFO
            ========================================= */}

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


            {/* =========================================
                ADD TO CART
            ========================================= */}

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


            {/* =========================================
                CONTINUE SHOPPING
            ========================================= */}

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