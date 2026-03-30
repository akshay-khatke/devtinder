import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import { removeUserData, setUserData } from '../store/userSlice'
import axios from 'axios'
import chatIcon from '../assets/svg/chat.svg'
import notificationIcon from '../assets/svg/notification.svg'

const NavBar = () => {

  const userData = useSelector((state) => state.user.userData)
  const dispatch = useDispatch()
  console.log(userData, 'check the user data');
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const [isChat, setIsChat] = useState(false)
  const [isNotification, setIsNotification] = useState(false)
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/feed')) return 'Homepage';
    if (path.includes('/connections')) return 'Connections';
    if (path.includes('/requests')) return 'Requests';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/allchats') || path.includes('/chat')) return 'Chat';
    if (path.includes('/EditProfile')) return 'Edit Profile';
    return 'Dev';
  }

  const handleLogout = async () => {

    try {
      const data = await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true })
      dispatch(removeUserData())
      navigate("/", { replace: true })
      setIsOpen(false)
    }
    catch (error) {

      console.log(error);
    }
  }

  const onViewMesgClick = () => {
    setIsChat(false)
    setIsNotification(false)
    setIsOpen(false)
    navigate("/chat")
  }



  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <Link to="/feed" className="btn btn-ghost text-xl">{getPageTitle()}</Link>
      </div>
      {userData && <div className="flex gap-2 mx-10">


        <div
          onClick={() => setIsChat(e => !e)}
          className="bg-white flex w-10 h-10 rounded-full overflow-hidden justify-center items-center "
        >
          <img
            src={chatIcon}
            alt="chat"
            className="object-cover w-6 h-6"
          />

        </div>

        <div
          onClick={() => setIsNotification(e => !e)}
          className="bg-white  flex w-10 h-10 rounded-full overflow-hidden justify-center items-center mx-2"
        >
          <img
            src={notificationIcon}
            alt="notification"
            className="object-cover w-6 h-6"
          />



        </div>
        <div
          onClick={() => setIsOpen((e) => !e)}
          className="w-10 h-10 rounded-full overflow-hidden"
        >
          <img
            src={userData?.photoUrl}
            alt="profile"
            className="w-full h-full object-cover"
          />



        </div>


        {isNotification && (
          <div className=" absolute right-20 mt-12 w-[400px] shadow-lg  rounded-lg border z-50">
            <div className='flex bg-white rounded-t-lg justify-center items-center border-b-2 border-gray-300 py-3'>
              <p>Your notifications</p>
            </div>

            {/* map the messages here */}

          </div>
        )}

        {isChat && (
          <div className=" absolute right-20 mt-12 w-[400px] shadow-lg  rounded-lg border z-50">
            <div className='flex bg-white rounded-t-lg justify-center items-center border-b-2 border-gray-300 py-3'>
              <p>Your messages</p>
            </div>

            {/* map the messages here */}
            <div className='flex bg-white   min-h-[100px] rounded-t-lg justify-center items-center border-b-2 border-gray-300 py-3'>
              <p>You have no messages</p>
            </div>
            <div className='flex bg-white rounded-t-lg justify-center items-center border-b-2 border-gray-300 py-3'>
              <button onClick={onViewMesgClick} className='btn btn-primary bg-primary text-white p-4'>View all messages</button>
            </div>

          </div>
        )}



        {isOpen && (
          <div className="absolute right-4 mt-12 w-80 bg-white shadow-lg rounded-lg border z-50">
            <div className='flex flex-col justify-center items-center pt-6'>
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-20 h-20 rounded-full overflow-hidden"
              >
                <img
                  src={userData?.photoUrl}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className='font:Helvetica font-bold text-[18px] pt-4'> {` ${userData?.firstName} ${userData?.lastName}`}</p>

            </div>
            <div className='p-6 '>
              <ul >
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                  <Link to="/profile" className="">
                    <p className='font:Helvetica font-semiBold text-[18px]'>Profile</p>

                  </Link>
                </li>

                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                  <Link to="/connections">
                    <p className='font:Helvetica font-semiBold text-[18px]'>Connections</p>

                  </Link>

                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                  <Link to="/requests">
                    <p className='font:Helvetica font-semiBold text-[18px]' >Requests</p>

                  </Link>
                </li>

                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                  <Link to="/premium">
                    <p className='font:Helvetica font-semiBold text-[18px] text-orange-600 font-bold'>Premium 💎</p>

                  </Link>
                </li>

                <div className='border-1 border-b border-gray-300'></div>
                <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Logout
                </li>
                {/* <li><a onClick={handleLogout}>Logout</a></li> */}

              </ul>
            </div>
          </div>
        )}
      </div>
      }
    </div>
  )
}

export default NavBar