import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../store/userSlice'
import AlertModal from '../components/Alert'
import invite from '../assets/images/invite.png'
import userImg from '../assets/images/user.png'
import wallet from '../assets/images/wallet.png'
import eye from '../assets/images/eye_pass.png'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";

function EditProfile({ user }) {
    const [firstName, setFirstName] = useState(user?.firstName)
    const [lastName, setLastName] = useState(user?.lastName)
    const [gender, setGender] = useState(user?.gender)
    const [age, setAge] = useState(user?.age)
    const [photoUrl, setPhotoUrl] = useState(user?.photoUrl)
    const [about, setAbout] = useState(user?.about)
    const [activeSection, setActiveSection] = useState('profile')
    const [password, setPassword] = useState({
        oldPassword: "",
        newPassword: ""
    })
    const [open, setOpen] = useState(false);
    const onClose = () => setOpen(false);
    const dispatch = useDispatch()

    const saveProfile = async () => {
        try {
            const response = await axios.patch(`${BASE_URL}/profile/edit`, { firstName, lastName, gender, age, photoUrl, about }, { withCredentials: true })
            if (response.status === 200) {
                dispatch(setUserData(response.data.data))
                setOpen(true);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const updatePassword = async () => {
        const { oldPassword, newPassword } = password
        try {
            const response = await axios.patch(`${BASE_URL}/auth/changePassword`, { oldPassword, newPassword }, { withCredentials: true })
            if (response.status === 200) {
                dispatch(setUserData(response.data.data))
                // setOpen(true);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const value = 0.66;

    const sections = [
        { id: 'profile', title: 'Account Information', sub: 'Change your account information', icon: userImg },
        { id: 'password', title: 'Password', sub: 'Change your password', icon: eye },
        { id: 'payment', title: 'Payment Methods', sub: 'Add your card / Wallet', icon: wallet },
        { id: 'invite', title: 'Invitations', sub: 'Get $3 for each invitation', icon: invite },
    ];

    return (
        <div className='flex flex-row min-h-[80vh] bg-white rounded-3xl overflow-hidden shadow-sm m-6 border border-gray-100'>
            {/* Sidebar */}
            <div className='w-[380px] flex flex-col items-left border-r border-gray-100 p-8 pt-10'>
                {/* Progress Card */}
                <div className='flex flex-col w-full rounded-3xl bg-[#faa307] p-6 mb-10 shadow-lg shadow-[#faa307]/20 transition-transform hover:scale-[1.02]'>
                    <div className='flex flex-row items-center gap-5 mb-5'>
                        <div className='w-16 h-16 flex-shrink-0'>
                            <CircularProgressbar
                                styles={buildStyles({
                                    pathColor: "white",
                                    trailColor: "rgba(255,255,255,0.2)",
                                    textColor: "white",
                                    textSize: '24px'
                                })}
                                value={value}
                                maxValue={1}
                                text={`${Math.round(value * 100)}%`}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <p className='text-lg font-bold text-white'>Complete profile</p>
                            <p className='text-xs text-white/80 leading-relaxed font-medium'>Complete your profile to unlock more matches</p>
                        </div>
                    </div>
                    <button className='w-full bg-white text-sm font-bold text-[#faa307] py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm'>
                        Finish Now
                    </button>
                </div>

                {/* Nav Items */}
                <div className='space-y-2' id="profileDetailsSection">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`group flex gap-4 items-center p-4 rounded-2xl cursor-pointer transition-all ${activeSection === section.id
                                ? 'bg-gray-50 border border-gray-100 shadow-sm'
                                : 'hover:bg-gray-50/50'
                                }`}
                        >
                            <div className={`p-2 rounded-xl transition-colors ${activeSection === section.id ? 'bg-white shadow-sm' : 'bg-gray-50/50'}`}>
                                <img src={section.icon} className='w-7 h-7 object-contain' alt={section.title} />
                            </div>
                            <div className='flex-1 overflow-hidden'>
                                <h2 className={`text-[15px] font-bold truncate ${activeSection === section.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                    {section.title}
                                </h2>
                                <p className='text-[11px] text-gray-400 font-medium truncate'>{section.sub}</p>
                            </div>
                            <div className={`w-1.5 h-1.5 rounded-full transition-all ${activeSection === section.id ? 'bg-[#faa307] scale-100' : 'bg-transparent scale-0'}`} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side Content Areas */}
            <div className='flex-1 p-12 bg-[#FCFCFD]'>
                {activeSection === 'profile' && (
                    <div className='max-w-3xl transform transition-all duration-300' id="updateSection">
                        <div className='mb-10'>
                            <h1 className='text-2xl font-black text-gray-900 mb-2'>Personal Information</h1>
                            <p className='text-gray-500 font-medium'>Update your profile details to keep your account current.</p>
                        </div>

                        {/* Profile Header Block */}
                        <div className='bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 mb-10'>
                            <div className='w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-gray-100 shadow-inner group relative cursor-pointer'>
                                <img src={photoUrl} className='w-full h-full object-cover' alt="profile" />
                                <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                    <EditIcon color="white" />
                                </div>
                            </div>
                            <div>
                                <h2 className='text-xl font-bold text-gray-900'>{firstName} {lastName}</h2>
                                <p className='text-gray-500 font-medium'>{age} Years, {gender}</p>
                                <p className='text-sm text-gray-400 mt-1 max-w-sm truncate italic'>"{about || 'No bio yet...'}"</p>
                            </div>
                            <button className='ml-auto px-5 py-2.5 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-100'>
                                Replace Photo
                            </button>
                        </div>

                        <div className='grid grid-cols-2 gap-6'>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">First Name</label>
                                <input
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstName}
                                    type="text"
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#faa307]/20 focus:border-[#faa307] outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Last Name</label>
                                <input
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastName}
                                    type="text"
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#faa307]/20 focus:border-[#faa307] outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Gender</label>
                                <input
                                    onChange={(e) => setGender(e.target.value)}
                                    value={gender}
                                    type="text"
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#faa307]/20 focus:border-[#faa307] outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Age</label>
                                <input
                                    onChange={(e) => setAge(e.target.value)}
                                    value={age}
                                    type="number"
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#faa307]/20 focus:border-[#faa307] outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Photo URL</label>
                                <input
                                    onChange={(e) => setPhotoUrl(e.target.value)}
                                    value={photoUrl}
                                    type="text"
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#faa307]/20 focus:border-[#faa307] outline-none transition-all shadow-sm"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">About</label>
                                <textarea
                                    onChange={(e) => setAbout(e.target.value)}
                                    value={about}
                                    rows="4"
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#faa307]/20 focus:border-[#faa307] outline-none transition-all shadow-sm resize-none"
                                />
                            </div>
                        </div>

                        <button
                            onClick={saveProfile}
                            className="mt-10 w-full bg-[#faa307] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#faa307]/30 hover:bg-[#e89505] transform transition-all active:scale-[0.98]"
                        >
                            Update Profile
                        </button>

                        <AlertModal isOpen={open} onClose={onClose} message={"Profile updated successfully"} />
                    </div>
                )}

                {activeSection === 'password' && (
                    <div className='max-w-xl animate-fade-in'>
                        <h1 className='text-2xl font-black text-gray-900 mb-2'>Security</h1>
                        <p className='text-gray-500 font-medium mb-10'>Manage your password and security settings.</p>

                        <div className='space-y-6'>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Current Password</label>
                                <input type="password" placeholder="••••••••" onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#faa307]/20 outline-none" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">New Password</label>
                                <input type="password" placeholder="••••••••" onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-[15px] focus:ring-2 focus:ring-[#faa307]/20 outline-none" />
                            </div>
                        </div>
                        <button onClick={updatePassword} className="mt-8 px-10 bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-black transition-all">
                            Update Password
                        </button>
                    </div>
                )}

                {activeSection === 'payment' && (
                    <div className='max-w-xl animate-fade-in text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200'>
                        <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <img src={wallet} className='w-10 h-10 grayscale opacity-40' alt="wallet" />
                        </div>
                        <h2 className='text-xl font-bold text-gray-400'>No Payment Methods Found</h2>
                        <p className='text-gray-400 mt-2 max-w-xs mx-auto'>Add a payment method to unlock premium features and invitations.</p>
                        <button className='mt-8 text-[#faa307] font-bold border-2 border-[#faa307] px-8 py-3 rounded-xl hover:bg-[#faa307] hover:text-white transition-all'>
                            Add New Card
                        </button>
                    </div>
                )}

                {activeSection === 'invite' && (
                    <div className='max-w-xl animate-fade-in bg-white p-10 rounded-3xl border border-gray-100 shadow-sm'>
                        <div className='bg-yellow-50 p-8 rounded-2xl text-center mb-10'>
                            <img src={invite} className='w-16 h-16 mx-auto mb-4' alt="invite" />
                            <h2 className='text-2xl font-black text-[#8a5d00]'>Invite & Earn $3</h2>
                            <p className='text-[#8a5d00]/70 font-medium'>Each time a friend joins using your link, you get $3 credited to your account.</p>
                        </div>
                        <div className='flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100'>
                            <span className='font-mono text-sm font-bold text-gray-500 truncate'>devtinder.com/ref/akshay_8273</span>
                            <button className='ml-auto bg-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-shadow'>Copy Link</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const EditIcon = ({ color = 'currentColor' }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

export default EditProfile;