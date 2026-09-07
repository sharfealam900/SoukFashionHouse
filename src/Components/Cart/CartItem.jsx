import React from "react";

export default function CartItem({ item, onIncrease, onDecrease, onRemove, availableStock = 0, stockMessage = "" }) {
  const product = item?.product;
  if (!product) return null;

  const selectedVariant = product?.colorVariants?.find((variant) => variant.name?.toLowerCase() === String(item.color || "").toLowerCase());
  const productImage = selectedVariant?.images?.[0]?.url || product?.images?.[0]?.url || product?.image || "";
  const originalPrice = Number(product?.price || 0);
  const discount = Number(product?.discount || 0);
  const finalPrice = originalPrice - (originalPrice * discount) / 100;
  const itemTotal = finalPrice * Number(item.quantity || 0);
  const isMinimumQuantity = item.quantity <= 1;
  const isMaximumQuantity = availableStock > 0 && item.quantity >= availableStock;
  const isOutOfStock = availableStock <= 0;

  return (
    <div className="cart-item">
      <div className="cart-item-image-wrapper">
        {productImage ? <img src={productImage} alt={product.name} className="cart-item-image" /> : <div className="cart-item-image-placeholder">No Image</div>}
      </div>
      <div className="cart-item-content">
        <h3 className="cart-item-title">{product.name}</h3>
        {item.size !== undefined && item.size !== null && item.size !== "" && <div className="cart-item-size"><span>Size:</span> <strong>{item.size}</strong></div>}
        {item.color && <div className="cart-item-color"><span>Color:</span> <strong>{item.color}</strong></div>}
        <div className="cart-item-price-row">
          <span className="cart-item-current-price">₹{finalPrice.toFixed(0)}</span>
          {discount > 0 && <><span className="cart-item-original-price">₹{originalPrice.toFixed(0)}</span><span className="cart-item-discount">{discount}% OFF</span></>}
        </div>
        <div className="cart-quantity-section">
          <div className="cart-quantity-controls">
            <button type="button" className="cart-quantity-btn" onClick={() => onDecrease(item)} disabled={isMinimumQuantity}>−</button>
            <span className="cart-quantity-value">{item.quantity}</span>
            <button type="button" className="cart-quantity-btn" onClick={() => onIncrease(item)} disabled={isMaximumQuantity || isOutOfStock}>+</button>
          </div>
          {stockMessage && <div className="cart-stock-warning"><span className="cart-stock-warning-icon">!</span><span>{stockMessage}</span></div>}
        </div>
      </div>
      <div className="cart-item-total">₹{itemTotal.toFixed(0)}</div>
      <button type="button" className="cart-remove-btn" onClick={() => onRemove(item)}><span className="cart-remove-icon">🗑</span>Remove</button>
    </div>
  );
}
