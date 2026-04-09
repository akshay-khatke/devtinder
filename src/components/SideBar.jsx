import Footer from "./Footer"
import NavBar from "./NavBar"
import { Outlet, useNavigate } from "react-router-dom"

const SideBar = () => {
    const navigate = useNavigate()
    return (
        <div className='flex h-screen w-screen overflow-hidden'>
            <div className="drawer lg:drawer-open flex-1">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

                {/* Main Content Area */}
                <div className="drawer-content flex flex-col h-full overflow-hidden">
                    {/* Fixed Navbar at top */}
                    <div className="flex-none">
                        <NavBar />
                    </div>

                    {/* Scrollable/Content Area */}
                    <div className="flex-1 overflow-auto relative bg-base-100">
                        <Outlet />
                    </div>

                    {/* Fixed Footer at bottom */}
                    <div className="flex-none">
                        <Footer />
                    </div>
                </div>

                {/* Sidebar Menu (Stable) */}
                <div className="drawer-side h-full overflow-y-auto">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex min-h-full flex-col justify-between bg-base-200 w-64 border-r border-base-300">
                        <div>
                            {/* App Logo/Header in sidebar */}
                            <div className="p-4 border-b border-base-300 font-bold text-xl text-[#faa307]">
                                Dev
                            </div>

                            <ul className="menu p-4 w-full space-y-1">
                                <li>
                                    <button onClick={() => navigate("/feed")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors">
                                        <HomeIcon />
                                        <span>Homepage</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/connections")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors">
                                        <ConnectionsIcon />
                                        <span>Connections</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/requests")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors">
                                        <RequestsIcon />
                                        <span>Requests</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/profile")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors">
                                        <ProfileIcon />
                                        <span>Profile</span>
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate("/resume-checker")} className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors">
                                        <ResumeIcon />
                                        <span>Resume Reviewer</span>
                                    </button>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <button onClick={() => navigate("/allchats")} className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary font-bold">
                                        <ChatIcon color="#faa307" className="size-5" />
                                        <span className="text-[#faa307]">Chat</span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* <div className="p-4">
                            <Footer />
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Sidebar Icons
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-5"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
);
const ConnectionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);
const RequestsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
);
const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const ResumeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const ChatIcon = ({ className = "", color = "currentColor" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="2"
        fill="none"
        stroke={color}           // ← Dynamic color इथे येतो
        className={`size-5 ${className}`}
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export default SideBar;