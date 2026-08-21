export const BASE_URL = import.meta.env.VITE_BASE_URL || (location.hostname === "localhost"
    ? "http://localhost:10000"
    : "https://devtinderbe-3.onrender.com");

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;