import React from "react";
import { FaTrashAlt } from "react-icons/fa";

import QuantitySelector from "./QuantitySelector";

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const discount = Number(item.product.discount || 0);

  const price =
    item.product.price -
    (item.product.price * discount) / 100;

  const totalPrice = price * item.quantity;

  return (
    <div className="cart-item">

      <div className="cart-image">

        <img
          src={item.product.images?.[0]?.url}
          alt={item.product.name}
        />

      </div>

      <div className="cart-details">

        <h4>{item.product.name}</h4>

        <p className="cart-category">
          {item.product.category?.name}
        </p>

        <div className="d-flex align-items-center gap-2">

          <h5 className="mb-0">
            ₹{price.toFixed(0)}
          </h5>

          {discount > 0 && (
            <>
              <small
                className="text-muted text-decoration-line-through"
              >
                ₹{item.product.price}
              </small>

              <span className="badge bg-danger">
                {discount}% OFF
              </span>
            </>
          )}

        </div>

        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => onIncrease(item)}
          onDecrease={() => onDecrease(item)}
        />

      </div>

      <div className="cart-right">

        <h4>
          ₹{totalPrice.toFixed(0)}
        </h4>

        <button
          className="remove-btn"
          onClick={() => onRemove(item)}
        >
          <FaTrashAlt />
          Remove
        </button>

      </div>

    </div>
  );
}