import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData, removeUserData } from '../store/userSlice'
import SideBar from '../components/SideBar'
//this is the first page 
function Body() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userData, isLoaded } = useSelector((state) => state.user)
  //
  useEffect(() => {
    if (!isLoaded) {
      fetchUserData()
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/profile/view`, { withCredentials: true })
      if (response.status === 200) {
        dispatch(setUserData(response.data))
      }
    }
    catch (error) {
      console.error(error);
      if (error?.response?.status === 401) {
        navigate("/", { replace: true })
        // navigate("/login")
      }
      // Set isLoaded to true and userData to null on error
      dispatch(removeUserData())
    }
  }

  return (
    <div>
      {/* <SideBar /> */}
      <SideBar />
      {/* <Footer /> */}
    </div>
  )
}

export default Body

// any children component will render below navbar