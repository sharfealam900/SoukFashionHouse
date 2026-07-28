import React from "react";
import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="empty-cart">

      <h2>Your Shopping Bag is Empty</h2>

      <p>
        Looks like you haven't added anything yet.
      </p>

      <Link to="/" className="shop-btn">
        Continue Shopping
      </Link>

    </div>
  );
}