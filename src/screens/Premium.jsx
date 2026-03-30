import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL, RAZORPAY_KEY_ID } from '../utils/constants';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Premium = () => {
    const userData = useSelector((state) => state.user.userData);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(null); // 'silver' or 'gold' or null

    const handlePayment = async (planType, amount) => {
        setLoading(planType);
        try {
            // 1. Create Order on Backend
            const { data } = await axios.post(
                `${BASE_URL}/payment/create`,
                { amount, currency: "INR" },
                { withCredentials: true }
            );

            if (!data.success) throw new Error(data.error || "Failed to create order");

            const { orderId, amount: amountInPaise, currency } = data;

            // 2. Razorpay Options
            const options = {
                key: RAZORPAY_KEY_ID,
                amount: amountInPaise,
                currency: currency,
                name: "DevTinder Premium",
                description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Membership`,
                order_id: orderId,
                handler: async function (response) {
                    try {
                        const verifyData = await axios.post(
                            `${BASE_URL}/payment/verify`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                planType // Passing this just in case backend expects it
                            },
                            { withCredentials: true }
                        );

                        if (verifyData.data.success) {
                            alert("Payment Successful! Welcome to Premium! 🚀");
                            navigate("/feed"); // Redirect to home or refresh profile
                        } else {
                            alert("Payment Verification Failed: " + verifyData.data.message);
                        }
                    } catch (err) {
                        console.error("Verification Error:", err);
                        alert("Error during verification. Please contact support.");
                    }
                },
                prefill: {
                    name: `${userData?.firstName} ${userData?.lastName}`,
                    email: userData?.emailId || "",
                },
                theme: {
                    color: planType === 'gold' ? "#fab1a0" : "#5B6BF9",
                },
                modal: {
                    ondismiss: function () {
                        setLoading(null);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert(error.response?.data?.error || "Error initiating payment. Please try again.");
            setLoading(null);
        }
    };

    return (
        <div className="min-h-full bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full space-y-8 text-center">
                <div>
                    <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">
                        Elevate Your DevTinder Experience
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                        Choose a plan that fits your professional journey.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {/* Silver Plan */}
                    <div className="relative group bg-white p-8 rounded-[32px] shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                            MOST POPULAR
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Silver Plan</h3>
                            <div className="mt-4 flex justify-center items-baseline">
                                <span className="text-4xl font-extrabold tracking-tight text-gray-900">₹700</span>
                                <span className="ml-1 text-xl font-medium text-gray-500">/3 months</span>
                            </div>
                            <ul className="mt-8 space-y-4 text-left">
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircleIcon color="text-green-500" />
                                    <span>Browse unlimited developers in your city</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircleIcon color="text-green-500" />
                                    <span>Send up to 50 requests daily</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircleIcon color="text-green-500" />
                                    <span>View who visited your profile</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-400">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
                                    <span>Direct chat with any developer</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            disabled={loading !== null}
                            onClick={() => handlePayment('silver', 700)}
                            className={`mt-10 w-full py-4 px-6 rounded-2xl text-[17px] font-bold transition-all ${
                                loading === 'silver' 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#5B6BF9] text-white hover:bg-[#4a58d6] shadow-[0_4px_14px_0_rgba(91,107,249,0.39)] hover:scale-[1.02]'
                            }`}
                        >
                            {loading === 'silver' ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>

                    {/* Gold Plan */}
                    <div className="relative group bg-white p-8 rounded-[32px] shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#fab1a0]/30 flex flex-col ring-2 ring-[#fab1a0]/20">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#fab1a0] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                            PREMIUM
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Gold Plan</h3>
                            <div className="mt-4 flex justify-center items-baseline">
                                <span className="text-4xl font-extrabold tracking-tight text-gray-900">₹1000</span>
                                <span className="ml-1 text-xl font-medium text-gray-500">/6 months</span>
                            </div>
                            <ul className="mt-8 space-y-4 text-left">
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircleIcon color="text-[#fab1a0]" />
                                    <span>All Silver Plan features</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircleIcon color="text-[#fab1a0]" />
                                    <span>Direct chat with any developer</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircleIcon color="text-[#fab1a0]" />
                                    <span>Priority profile listing</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircleIcon color="text-[#fab1a0]" />
                                    <span>Exclusive Dev Badge 💎</span>
                                </li>
                            </ul>
                        </div>
                        <button
                            disabled={loading !== null}
                            onClick={() => handlePayment('gold', 1000)}
                            className={`mt-10 w-full py-4 px-6 rounded-2xl text-[17px] font-bold transition-all ${
                                loading === 'gold' 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-[#fab1a0] text-white hover:bg-[#e17055] shadow-[0_4px_14px_0_rgba(250,177,160,0.39)] hover:scale-[1.02]'
                            }`}
                        >
                            {loading === 'gold' ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-sm text-gray-400">
                    By purchasing, you agree to our Terms of Service. Secure payments by Razorpay.
                </p>
            </div>
        </div>
    );
};

const CheckCircleIcon = ({ color }) => (
    <svg className={`h-6 w-6 ${color}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
    </svg>
);

export default Premium;
