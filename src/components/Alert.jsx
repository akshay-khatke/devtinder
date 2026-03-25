import React from "react";

function AlertModal({ isOpen, onClose, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">

                <div className="flex items-center gap-3 text-success">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="font-bold text-lg">Success</h3>
                </div>

                <p className="py-4">{message}</p>

                <div className="flex justify-end">
                    <button className="btn btn-success bg-green-500 p-4" onClick={onClose}>
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AlertModal;