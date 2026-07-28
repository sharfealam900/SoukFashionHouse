import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
}) {
  return (
    <div className="quantity-selector">

      <button
        className="qty-btn"
        onClick={onDecrease}
      >
        <FaMinus />
      </button>

      <span className="qty-value">
        {quantity}
      </span>

      <button
        className="qty-btn"
        onClick={onIncrease}
      >
        <FaPlus />
      </button>

    </div>
  );
}