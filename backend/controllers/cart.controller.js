import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, color = "" } = req.body;
    const userId = req.user._id;
    const requestedQuantity = Number(quantity);
    const selectedSize = size === "" || size === undefined || size === null ? null : Number(size);
    const selectedColor = String(color || "").trim();

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const colorVariants = Array.isArray(product.colorVariants) ? product.colorVariants : [];
    if (colorVariants.length > 0) {
      const colorExists = colorVariants.some(
        (variant) => variant.name.toLowerCase() === selectedColor.toLowerCase()
      );
      if (!colorExists) {
        return res.status(400).json({ success: false, message: "Please select a valid color" });
      }
    }

    let selectedSizeData = null;
    if (product.sizes?.length > 0) {
      if (selectedSize === null) {
        return res.status(400).json({ success: false, message: "Please select a size" });
      }
      selectedSizeData = product.sizes.find((item) => Number(item.size) === selectedSize);
      if (!selectedSizeData) {
        return res.status(400).json({ success: false, message: "Please select a valid size" });
      }
      if (selectedSizeData.stock <= 0) {
        return res.status(400).json({ success: false, message: `Size ${selectedSize} is out of stock` });
      }
      if (requestedQuantity > selectedSizeData.stock) {
        return res.status(400).json({ success: false, message: `Only ${selectedSizeData.stock} item(s) available in size ${selectedSize}` });
      }
    } else if (requestedQuantity > Number(product.stock || 0)) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} item(s) available` });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    const matchingItems = cart.items.filter(
      (item) =>
        item.product.toString() === productId &&
        (Number(item.size) || null) === selectedSize &&
        (item.color || "").toLowerCase() === selectedColor.toLowerCase()
    );

    if (matchingItems.length > 0) {
      const existingItem = matchingItems[0];
      const currentQuantity = matchingItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
      const newQuantity = currentQuantity + requestedQuantity;

      if (selectedSizeData && newQuantity > selectedSizeData.stock) {
        return res.status(400).json({ success: false, message: `Only ${selectedSizeData.stock} item(s) available in size ${selectedSize}` });
      }
      if (!selectedSizeData && newQuantity > Number(product.stock || 0)) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} item(s) available` });
      }

      existingItem.quantity = newQuantity;
      existingItem.size = selectedSize;
      existingItem.color = selectedColor;
      cart.items = cart.items.filter(
        (item) =>
          item === existingItem ||
          !(item.product.toString() === productId && (Number(item.size) || null) === selectedSize && (item.color || "").toLowerCase() === selectedColor.toLowerCase())
      );
    } else {
      cart.items.push({ product: productId, quantity: requestedQuantity, size: selectedSize, color: selectedColor });
    }

    await cart.save();
    return res.status(200).json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.status(200).json({ success: true, cart: { items: [] } });
    cart.items = cart.items.filter((item) => item.product !== null);
    await cart.save();
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, size, color } = req.body;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const normalizedSize = size === "" || size === undefined || size === null ? null : Number(size);
    const normalizedColor = String(color || "").trim();
    const item = cart.items.find(
      (cartItem) =>
        cartItem.product.toString() === productId &&
        (Number(cartItem.size) || null) === normalizedSize &&
        (cartItem.color || "").toLowerCase() === normalizedColor.toLowerCase()
    );

    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });
    item.quantity = Number(quantity);
    await cart.save();
    return res.status(200).json({ success: true, message: "Cart updated successfully", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, size, color } = req.body;
    const normalizedSize = size === "" || size === undefined || size === null ? null : Number(size);
    const normalizedColor = String(color || "").trim();
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(item.product.toString() === productId && (Number(item.size) || null) === normalizedSize && (item.color || "").toLowerCase() === normalizedColor.toLowerCase())
    );
    await cart.save();
    return res.status(200).json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
    cart.items = [];
    await cart.save();
    return res.status(200).json({ success: true, message: "Cart cleared successfully", cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
