import React from "react";

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  availableStock = 0,
  stockMessage = "",
}) {
  const product = item?.product;

  if (!product) {
    return null;
  }

  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const productImage =
    product?.images?.[0]?.url ||
    product?.image ||
    "";

  // =====================================================
  // PRICE
  // =====================================================

  const originalPrice =
    Number(product?.price || 0);

  const discount =
    Number(product?.discount || 0);

  const finalPrice =
    originalPrice -
    (originalPrice * discount) / 100;

  const itemTotal =
    finalPrice * item.quantity;

  // =====================================================
  // QUANTITY LIMIT
  // =====================================================

  const isMinimumQuantity =
    item.quantity <= 1;

  const isMaximumQuantity =
    availableStock > 0 &&
    item.quantity >= availableStock;

  const isOutOfStock =
    availableStock <= 0;

  // =====================================================
  // IMAGE
  // =====================================================

  return (
    <div className="cart-item">

      {/* =================================================
          PRODUCT IMAGE
      ================================================= */}

      <div className="cart-item-image-wrapper">

        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="cart-item-image"
          />
        ) : (
          <div className="cart-item-image-placeholder">
            No Image
          </div>
        )}

      </div>

      {/* =================================================
          PRODUCT INFORMATION
      ================================================= */}

      <div className="cart-item-content">

        {/* PRODUCT NAME */}

        <h3 className="cart-item-title">
          {product.name}
        </h3>

        {/* SIZE */}

        {item.size !== undefined &&
          item.size !== null &&
          item.size !== "" && (
            <div className="cart-item-size">
              <span>Size:</span>{" "}
              <strong>
                {item.size}
              </strong>
            </div>
          )}

        {/* COLOR */}

        {item.color && (
          <div className="cart-item-color">
            <span>Color:</span>{" "}
            <strong>
              {item.color}
            </strong>
          </div>
        )}

        {/* =================================================
            PRICE
        ================================================= */}

        <div className="cart-item-price-row">

          <span className="cart-item-current-price">
            ₹{finalPrice.toFixed(0)}
          </span>

          {discount > 0 && (
            <>
              <span className="cart-item-original-price">
                ₹{originalPrice.toFixed(0)}
              </span>

              <span className="cart-item-discount">
                {discount}% OFF
              </span>
            </>
          )}

        </div>

        {/* =================================================
            QUANTITY CONTROLS
        ================================================= */}

        <div className="cart-quantity-section">

          <div className="cart-quantity-controls">

            {/* DECREASE */}

            <button
              type="button"
              className="cart-quantity-btn"
              onClick={() =>
                onDecrease(item)
              }
              disabled={
                isMinimumQuantity
              }
              aria-label="Decrease quantity"
            >
              −
            </button>

            {/* QUANTITY */}

            <span className="cart-quantity-value">
              {item.quantity}
            </span>

            {/* INCREASE */}

            <button
              type="button"
              className="cart-quantity-btn"
              onClick={() =>
                onIncrease(item)
              }
              disabled={
                isMaximumQuantity ||
                isOutOfStock
              }
              aria-label="Increase quantity"
            >
              +
            </button>

          </div>

          {/* =================================================
              STOCK MESSAGE

              IMPORTANT:
              This is now INSIDE the product card.

              No toast.
              No navbar overlap.
          ================================================= */}

          {stockMessage && (
            <div className="cart-stock-warning">

              <span className="cart-stock-warning-icon">
                !
              </span>

              <span>
                {stockMessage}
              </span>

            </div>
          )}

        </div>

        {/* =================================================
            TOTAL
        ================================================= */}

        <div className="cart-item-total">
          ₹{itemTotal.toFixed(0)}
        </div>

        {/* =================================================
            REMOVE
        ================================================= */}

        <button
          type="button"
          className="cart-remove-btn"
          onClick={() =>
            onRemove(item)
          }
        >
          <span className="cart-remove-icon">
            🗑
          </span>

          Remove
        </button>

      </div>

    </div>
  );
}