import React from 'react'
import { FaShoppingBag } from "react-icons/fa";

export default function ProductCard(product) {
  return (
    <>
    <div className="product-card">

      <div className="product-image">

        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}

        <img src={product.image} alt={product.name} />

      </div>

      <div className="product-content">

        <small>{product.category}</small>

        <h3>{product.name}</h3>

        <div className="product-footer">

          <div className="price">

            {product.oldPrice && (
              <span className="old-price">
                ₹{product.oldPrice}
              </span>
            )}

            <span className="new-price">
              ₹{product.price}
            </span>

          </div>

          <button className="cart-btn">
            <FaShoppingBag />
          </button>

        </div>

      </div>

    </div>
    </>
  )
}
