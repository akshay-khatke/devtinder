import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, removeUserData } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import bg_login from "../assets/images/bg_login_1.png"
function login() {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userData, isLoaded } = useSelector((state) => state.user)

  React.useEffect(() => {
    if (isLoaded && userData) {
      navigate("/feed", { replace: true })
    }
  }, [isLoaded, userData])

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/profile/view`, { withCredentials: true })
      if (response.status === 200) {
        dispatch(setUserData(response.data))
      }
    }
    catch (error) {
      dispatch(removeUserData())
    }
  }

  React.useEffect(() => {
    if (!isLoaded) {
      fetchUserData()
    }
  }, [])
  const onLogin = async () => {

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        emailId,
        password
      }, { withCredentials: true })

      if (response.status === 200) {
        console.log(response.data, "response data datyat")
        dispatch(setUserData(response.data))
        navigate("/feed", { replace: true })
      }

    }
    catch (error) {
      setErrorMsg(error?.response?.data || "Something went wrong")
      console.log(error);
    }

  }
  const onSignUp = async () => {

    try {
      const response = await axios.post(`${BASE_URL}/auth/signUp`, {
        emailId,
        password, firstName, lastName
      }, { withCredentials: true })

      if (response.status === 200) {
        dispatch(setUserData(response.data.data))
        navigate("/profile", { replace: true })
      }

    }
    catch (error) {
      setErrorMsg(error?.response?.data || "Something went wrong")
      console.log(error);
    }

  }
  return (
    <div className='flex min-h-screen w-full bg-base-200'>
      {/* Left Side: Image */}
      <div className='hidden lg:flex lg:w-1/2 h-screen  fixed left-0 top-0'>
        <img
          src={bg_login}
          alt="Login background"
          className='w-full h-full object-contain'
        />
      </div>

      {/* Right Side: Form */}
      <div className='flex flex-1 lg:ml-[50%] items-center justify-center p-4'>
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl border border-base-300">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl font-bold mb-4">
              {isLoginForm ? "Login to Dev" : "Create Account"}
            </h2>

            {!isLoginForm && (
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold ">First Name</span>
                  </label>
                  <input
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    type="text"
                    className="bg-white focus:bg-white input border border-gray-300 focus:border-[#ffcc63] focus:outline-none focus:ring-0 focus:shadow-none pl-[10px]"
                    placeholder="John"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Last Name</span>
                  </label>
                  <input
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    type="text"
                    className="bg-white focus:bg-white input border border-gray-300 focus:border-[#ffcc63] focus:outline-none focus:ring-0 focus:shadow-none pl-[10px]"
                    placeholder="Doe"
                  />
                </div>
              </div>
            )}

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">Email ID</span>
              </label>
              <input
                onChange={(e) => setEmailId(e.target.value)}
                value={emailId}
                type="text"
                className="input border border-gray-300 bg-white focus:border-[#ffcc63] focus:outline-none focus:ring-0 focus:shadow-none pl-[10px] "
                placeholder="Please enter email"
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className="bg-white focus:bg-white input border border-gray-300 focus:border-[#ffcc63] focus:outline-none focus:ring-0 focus:shadow-none pl-[10px]" placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <div className="alert alert-error mt-4 py-2 px-4 text-sm text-white rounded-lg">
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-control mt-4">
              <button
                onClick={isLoginForm ? onLogin : onSignUp}
                className="btn bg-[#ffcc63] btn-primary text-white shadow-lg hover:shadow-primary/20 transition-all p-2 uppercase tracking-wider"
              >
                {isLoginForm ? "Login" : "Sign Up"}
              </button>
            </div>

            <div className="divider text-xs text-base-content/50 my-6">OR</div>

            <p className="text-center text-sm">
              <span className="text-base-content/70">
                {isLoginForm ? "New to Dev?" : "Already have an account?"}
              </span>{" "}
              <button
                onClick={() => setIsLoginForm(!isLoginForm)}
                className="link link-primary font-bold no-underline hover:underline"
              >
                {isLoginForm ? "Join now" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default login