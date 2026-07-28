import React from "react";
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

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId);

      const cart = await getCart();

      dispatch(setCart(cart.data.cart));

      await removeWishlistItem(productId);

      const wishlistData = await getWishlist();

      dispatch(
        setWishlist(
          wishlistData.data.wishlist?.products || []
        )
      );

      toast.success("Moved to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to move product"
      );
    }
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

            <Link
              to="/"
              className="btn btn-dark mt-3"
            >
              Continue Shopping
            </Link>

          </div>
        ) : (
          <div className="row">

            {wishlist.map((product) => {
              const discount = Number(product.discount || 0);

              const finalPrice =
                product.price -
                (product.price * discount) / 100;

              return (
                <div
                  key={product._id}
                  className="col-lg-3 col-md-4 col-sm-6 mb-4"
                >
                  <div className="product-card">

                    <img
                      src={
                        product.images?.length
                          ? product.images[0].url
                          : "https://via.placeholder.com/500"
                      }
                      alt={product.name}
                    />

                    <div className="product-content">

                      <small>
                        {product.category?.name}
                      </small>

                      <h5>{product.name}</h5>

                      <div className="mb-2">

                        <h6 className="mb-1">
                          ₹{finalPrice.toFixed(0)}
                        </h6>

                        {discount > 0 && (
                          <>
                            <small className="text-muted text-decoration-line-through me-2">
                              ₹{product.price}
                            </small>

                            <span className="badge bg-danger">
                              {discount}% OFF
                            </span>
                          </>
                        )}

                      </div>

                      <button
                        className="btn btn-dark w-100 mt-3"
                        onClick={() =>
                          handleMoveToCart(product._id)
                        }
                      >
                        Move to Cart
                      </button>

                      <button
                        className="btn btn-outline-danger w-100 mt-2"
                        onClick={() =>
                          handleRemove(product._id)
                        }
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
    </>
  );
}