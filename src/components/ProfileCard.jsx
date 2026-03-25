import React from "react";

const ProfileCard = () => {
    const skills = [
        "🎨 UI/UX Design",
        "✏️ Illustration",
        "🖌 Digital Art",
        "📷 Photography",
        "🎯 Figma",
        "🧠 Problem Solving",
        "🤝 Collaboration",
    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200 p-6">

            <div className="relative bg-white w-[400px] rounded-[30px] shadow-2xl p-8">

                {/* Soft Gradient Corner */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-3xl opacity-60"></div>

                {/* Floating Shapes */}
                <div className="absolute top-6 right-6 w-3 h-3 bg-green-300 rounded-full"></div>
                <div className="absolute right-10 top-20 text-green-400">▶</div>
                <div className="absolute left-10 top-36 text-green-300 text-xl">◀</div>
                <div className="absolute right-14 top-32 text-green-300">•••</div>

                {/* Profile Image */}
                <div className="flex justify-center">
                    <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                    />
                </div>

                {/* Name */}
                <h2 className="text-3xl font-bold text-center mt-4">Jane Doe</h2>
                <p className="text-gray-500 text-center">28, Female</p>

                {/* About */}
                <div className="mt-6">
                    <h3 className="font-semibold text-lg">About Me</h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                        Passionate graphic designer with a love for creative coding and
                        illustration. Enjoys hiking, photography, and exploring new coffee
                        shops.
                    </p>
                </div>

                {/* Skills */}
                <div className="mt-5">
                    <h3 className="font-semibold text-lg">Skills</h3>

                    <div className="flex flex-wrap gap-2 mt-3">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-7">

                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold shadow-md">
                        ✔ INTERESTED
                    </button>

                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold shadow-md">
                        ✖ DISINTERESTED
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ProfileCard;