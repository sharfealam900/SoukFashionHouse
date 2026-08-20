import Razorpay from "razorpay";
import "dotenv/config";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

let razorpay = null;

if (keyId && keySecret) {
  razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  console.log("✅ Razorpay initialized");
} else {
  console.log(
    "⚠️ Razorpay keys not configured yet. Payment gateway is disabled."
  );
}

export default razorpay;