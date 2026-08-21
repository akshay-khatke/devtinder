export const BASE_URL = process.env.VITE_BASE_URL || (location.hostname === "localhost"
    ? "http://localhost:10000"
    : "https://devtinderbe-3.onrender.com");

export const RAZORPAY_KEY_ID = process.env.VITE_RAZORPAY_KEY_ID;