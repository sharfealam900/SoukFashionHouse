import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import {
  removeWishlistItem,
  getWishlist,
} from "../features/wishlist/wishlistApi";

import { setWishlist } from "../features/wishlist/wishlistSlice";

import {
  addToCart,
  getCart,
} from "../features/cart/cartApi";

import { setCart } from "../features/cart/cartSlice";

export default function Wishlist() {
  const dispatch = useDispatch();

  const { wishlist } = useSelector(
    (state) => state.wishlist
  );

  // Selected product for size modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Selected size
  const [selectedSize, setSelectedSize] = useState(null);

  // Loading state
  const [movingToCart, setMovingToCart] = useState(false);

  const handleRemove = async (productId) => {
    try {
      await removeWishlistItem(productId);

      const { data } = await getWishlist();

      dispatch(
        setWishlist(data.wishlist?.products || [])
      );

      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to remove item"
      );
    }
  };

  // ------------------------------------------
  // Move to Cart
  // ------------------------------------------
  const handleMoveToCart = async (product) => {
    try {
      /*
       * If product has sizes,
       * open size selection modal.
       */
      if (product.sizes && product.sizes.length > 0) {
        setSelectedProduct(product);
        setSelectedSize(null);
        return;
      }

      /*
       * Product has no sizes.
       * Add directly to cart.
       */
      setMovingToCart(true);

      await addToCart(product._id, 1);

      const cartResponse = await getCart();

      dispatch(
        setCart(cartResponse.data.cart)
      );

      await removeWishlistItem(product._id);

      const wishlistResponse = await getWishlist();

      dispatch(
        setWishlist(
          wishlistResponse.data.wishlist?.products || []
        )
      );

      toast.success("Moved to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to move product"
      );
    } finally {
      setMovingToCart(false);
    }
  };

  // ------------------------------------------
  // Confirm size and move to cart
  // ------------------------------------------
  const handleAddSelectedSizeToCart = async () => {
    if (!selectedProduct || !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      setMovingToCart(true);

      await addToCart(
        selectedProduct._id,
        1,
        selectedSize
      );

      const cartResponse = await getCart();

      dispatch(
        setCart(cartResponse.data.cart)
      );

      /*
       * Remove from wishlist only after
       * successfully adding to cart.
       */
      await removeWishlistItem(
        selectedProduct._id
      );

      const wishlistResponse = await getWishlist();

      dispatch(
        setWishlist(
          wishlistResponse.data.wishlist?.products || []
        )
      );

      // Close modal
      setSelectedProduct(null);
      setSelectedSize(null);

      toast.success("Moved to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to move product"
      );
    } finally {
      setMovingToCart(false);
    }
  };

  // ------------------------------------------
  // Close modal
  // ------------------------------------------
  const closeSizeModal = () => {
    if (movingToCart) return;

    setSelectedProduct(null);
    setSelectedSize(null);
  };

  return (
    <>
      <Navbar />

      <section className="container py-5">

        <h2 className="mb-4">
          My Wishlist
        </h2>

        {wishlist.length === 0 ? (
          <div className="text-center py-5">

            <h4>Your wishlist is empty</h4>

            <p className="text-muted">
              Save your favorite products here and
              shop them whenever you're ready.
            </p>

            <Link
              to="/"
              className="btn btn-dark mt-3 px-4"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (
          <div className="row">

            {wishlist.map((product) => {
              const discount = Number(
                product.discount || 0
              );

              const finalPrice =
                product.price -
                (product.price * discount) / 100;

              /*
               * Check if product has sizes
               */
              const hasSizes =
                product.sizes &&
                product.sizes.length > 0;

              /*
               * Check if at least one size
               * is available.
               */
              const hasAvailableSize = hasSizes
                ? product.sizes.some(
                    (item) =>
                      Number(item.stock || 0) > 0
                  )
                : Number(product.stock || 0) > 0;

              return (
                <div
                  key={product._id}
                  className="col-lg-3 col-md-4 col-sm-6 mb-4"
                >

                  <div
                    className="product-card h-100"
                    style={{
                      overflow: "hidden",
                      borderRadius: "16px",
                      background: "#fff",
                      boxShadow:
                        "0 5px 20px rgba(0,0,0,0.08)",
                    }}
                  >

                    {/* Product Image */}
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={
                          product.images?.length
                            ? product.images[0].url
                            : "https://via.placeholder.com/500"
                        }
                        alt={product.name}
                        style={{
                          width: "100%",
                          height: "330px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            background: "#dc3545",
                            color: "#fff",
                            padding:
                              "5px 9px",
                            borderRadius: "5px",
                            fontSize: "12px",
                            fontWeight: "600",
                          }}
                        >
                          {discount}% OFF
                        </span>
                      )}

                    </div>

                    {/* Product Content */}
                    <div
                      className="product-content"
                      style={{
                        padding: "18px",
                      }}
                    >

                      <small
                        className="text-muted"
                        style={{
                          textTransform:
                            "uppercase",
                          letterSpacing:
                            "0.5px",
                        }}
                      >
                        {product.category?.name}
                      </small>

                      <h5
                        className="mt-1 mb-2"
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        {product.name}
                      </h5>

                      {/* Price */}
                      <div className="mb-3">

                        <h6
                          className="mb-1"
                          style={{
                            fontSize: "18px",
                            fontWeight: "700",
                          }}
                        >
                          ₹{finalPrice.toFixed(0)}
                        </h6>

                        {discount > 0 && (
                          <small className="text-muted text-decoration-line-through">
                            ₹{product.price}
                          </small>
                        )}

                      </div>

                      {/* Move To Cart */}
                      <button
                        className="btn btn-dark w-100"
                        disabled={
                          !hasAvailableSize ||
                          movingToCart
                        }
                        onClick={() =>
                          handleMoveToCart(product)
                        }
                        style={{
                          borderRadius: "7px",
                          padding: "10px",
                          fontWeight: "500",
                        }}
                      >
                        {!hasAvailableSize
                          ? "Out of Stock"
                          : hasSizes
                          ? "Select Size"
                          : "Move to Cart"}
                      </button>

                      {/* Remove */}
                      <button
                        className="btn btn-outline-danger w-100 mt-2"
                        onClick={() =>
                          handleRemove(
                            product._id
                          )
                        }
                        style={{
                          borderRadius: "7px",
                          padding: "10px",
                        }}
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </section>

      <Footer />

      {/* ======================================
          SIZE SELECTION MODAL
      ====================================== */}

      {selectedProduct && (
        <div
          onClick={closeSizeModal}
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0, 0, 0, 0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: "450px",
              background: "#fff",
              borderRadius: "16px",
              padding: "25px",
              boxShadow:
                "0 15px 50px rgba(0,0,0,0.2)",
            }}
          >

            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                marginBottom: "20px",
              }}
            >

              <div>
                <h4
                  style={{
                    margin: 0,
                    fontWeight: "600",
                  }}
                >
                  Select Size
                </h4>

                <small
                  className="text-muted"
                >
                  Choose your preferred size
                </small>
              </div>

              <button
                type="button"
                onClick={closeSizeModal}
                disabled={movingToCart}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: "28px",
                  lineHeight: "1",
                  color: "#555",
                  cursor: "pointer",
                }}
              >
                &times;
              </button>

            </div>

            {/* Product Information */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px",
                background: "#f8f9fa",
                borderRadius: "10px",
                marginBottom: "22px",
              }}
            >

              <img
                src={
                  selectedProduct.images?.length
                    ? selectedProduct.images[0].url
                    : "https://via.placeholder.com/80"
                }
                alt={selectedProduct.name}
                style={{
                  width: "65px",
                  height: "75px",
                  objectFit: "cover",
                  borderRadius: "7px",
                }}
              />

              <div>

                <div
                  style={{
                    fontWeight: "600",
                  }}
                >
                  {selectedProduct.name}
                </div>

                <div
                  style={{
                    marginTop: "3px",
                    fontWeight: "600",
                  }}
                >
                  ₹
                  {(
                    Number(
                      selectedProduct.price || 0
                    ) -
                    (Number(
                      selectedProduct.price || 0
                    ) *
                      Number(
                        selectedProduct.discount ||
                          0
                      )) /
                      100
                  ).toFixed(0)}
                </div>

              </div>

            </div>

            {/* Size Selection */}
            <div>

              <label
                style={{
                  display: "block",
                  marginBottom: "12px",
                  fontWeight: "600",
                }}
              >
                Available Sizes
              </label>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >

                {selectedProduct.sizes.map(
                  (item, index) => {
                    const stock = Number(
                      item.stock || 0
                    );

                    const available =
                      stock > 0;

                    const selected =
                      selectedSize ===
                      item.size;

                    return (
                      <button
                        key={`${item.size}-${index}`}
                        type="button"
                        disabled={
                          !available ||
                          movingToCart
                        }
                        onClick={() =>
                          setSelectedSize(
                            item.size
                          )
                        }
                        style={{
                          position: "relative",
                          minWidth: "58px",
                          height: "48px",
                          padding: "0 14px",
                          borderRadius: "8px",
                          border: selected
                            ? "2px solid #212529"
                            : "1px solid #ced4da",
                          background: !available
                            ? "#f1f1f1"
                            : selected
                            ? "#212529"
                            : "#fff",
                          color: !available
                            ? "#999"
                            : selected
                            ? "#fff"
                            : "#212529",
                          fontWeight: "600",
                          cursor: available
                            ? "pointer"
                            : "not-allowed",
                          textDecoration:
                            !available
                              ? "line-through"
                              : "none",
                          opacity: !available
                            ? 0.7
                            : 1,
                        }}
                      >
                        {item.size}

                        {/* Cross for unavailable */}
                        {!available && (
                          <span
                            style={{
                              position:
                                "absolute",
                              top: "50%",
                              left: "50%",
                              width: "70%",
                              height: "1px",
                              background:
                                "#dc3545",
                              transform:
                                "translate(-50%, -50%) rotate(-45deg)",
                            }}
                          />
                        )}
                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* Selected Size */}
            {selectedSize && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "10px 12px",
                  background: "#f8f9fa",
                  borderRadius: "7px",
                  fontSize: "14px",
                }}
              >
                Selected Size:{" "}
                <strong>
                  {selectedSize}
                </strong>
              </div>
            )}

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "24px",
              }}
            >

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={closeSizeModal}
                disabled={movingToCart}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "7px",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-dark"
                onClick={
                  handleAddSelectedSizeToCart
                }
                disabled={
                  !selectedSize ||
                  movingToCart
                }
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: "7px",
                }}
              >
                {movingToCart
                  ? "Adding..."
                  : "Add to Cart"}
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}