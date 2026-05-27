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

  const layer1 = React.useMemo(() => generateBoxShadow(700), []);
  const layer2 = React.useMemo(() => generateBoxShadow(200), []);
  const layer3 = React.useMemo(() => generateBoxShadow(100), []);

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
    <div className='relative flex min-h-screen w-full bg-[#0b0f19] overflow-hidden'>
      {/* Starry Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_#1b2735_0%,_#090a0f_100%)] z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-transparent after:content-[''] after:absolute after:top-[2000px] after:w-[inherit] after:h-[inherit] after:bg-transparent after:shadow-[inherit] animate-animStar" style={{ width: '1px', height: '1px', boxShadow: layer1 }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-transparent after:content-[''] after:absolute after:top-[2000px] after:w-[inherit] after:h-[inherit] after:bg-transparent after:shadow-[inherit] animate-animStar100" style={{ width: '2px', height: '2px', boxShadow: layer2 }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-transparent after:content-[''] after:absolute after:top-[2000px] after:w-[inherit] after:h-[inherit] after:bg-transparent after:shadow-[inherit] animate-animStar150" style={{ width: '3px', height: '3px', boxShadow: layer3 }}></div>

        {/* 6 Shooting Stars */}
        <div className="absolute w-[150px] h-[2px] bg-[linear-gradient(90deg,rgba(255,255,255,1),rgba(255,255,255,0))] rounded-full drop-shadow-[0_0_6px_rgba(255,255,255,1)] animate-shootingStar opacity-0 z-[1] before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:right-0 before:w-[30px] before:h-[2px] before:bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,1),rgba(255,255,255,0))] before:rounded-full" style={{ top: '10%', left: '80%', animationDelay: '0s', animationDuration: '8s' }}></div>
        <div className="absolute w-[150px] h-[2px] bg-[linear-gradient(90deg,rgba(255,255,255,1),rgba(255,255,255,0))] rounded-full drop-shadow-[0_0_6px_rgba(255,255,255,1)] animate-shootingStar opacity-0 z-[1] before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:right-0 before:w-[30px] before:h-[2px] before:bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,1),rgba(255,255,255,0))] before:rounded-full" style={{ top: '-10%', left: '60%', animationDelay: '2s', animationDuration: '10s' }}></div>
        <div className="absolute w-[150px] h-[2px] bg-[linear-gradient(90deg,rgba(255,255,255,1),rgba(255,255,255,0))] rounded-full drop-shadow-[0_0_6px_rgba(255,255,255,1)] animate-shootingStar opacity-0 z-[1] before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:right-0 before:w-[30px] before:h-[2px] before:bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,1),rgba(255,255,255,0))] before:rounded-full" style={{ top: '30%', left: '90%', animationDelay: '4s', animationDuration: '9s' }}></div>
        <div className="absolute w-[150px] h-[2px] bg-[linear-gradient(90deg,rgba(255,255,255,1),rgba(255,255,255,0))] rounded-full drop-shadow-[0_0_6px_rgba(255,255,255,1)] animate-shootingStar opacity-0 z-[1] before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:right-0 before:w-[30px] before:h-[2px] before:bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,1),rgba(255,255,255,0))] before:rounded-full" style={{ top: '-20%', left: '40%', animationDelay: '1.5s', animationDuration: '11s' }}></div>
        <div className="absolute w-[150px] h-[2px] bg-[linear-gradient(90deg,rgba(255,255,255,1),rgba(255,255,255,0))] rounded-full drop-shadow-[0_0_6px_rgba(255,255,255,1)] animate-shootingStar opacity-0 z-[1] before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:right-0 before:w-[30px] before:h-[2px] before:bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,1),rgba(255,255,255,0))] before:rounded-full" style={{ top: '20%', left: '110%', animationDelay: '5s', animationDuration: '7s' }}></div>
        <div className="absolute w-[150px] h-[2px] bg-[linear-gradient(90deg,rgba(255,255,255,1),rgba(255,255,255,0))] rounded-full drop-shadow-[0_0_6px_rgba(255,255,255,1)] animate-shootingStar opacity-0 z-[1] before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:right-0 before:w-[30px] before:h-[2px] before:bg-[linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,1),rgba(255,255,255,0))] before:rounded-full" style={{ top: '-30%', left: '70%', animationDelay: '3.5s', animationDuration: '12s' }}></div>
      </div>

      <div className="relative flex w-full h-screen z-10 text-white">
        {/* Left Side: Welcome Text */}
        <div className='hidden lg:flex flex-col justify-center lg:w-1/2 p-16 pl-24'>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Welcome to <span className="text-[#ffcc63]">DevTinder.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-md">
            Advanced platform designed specifically for developers to connect, collaborate, and build the future together.
          </p>


        </div>

        {/* Right Side: Form */}
        <div className='flex flex-1 items-center justify-center p-4'>
          <div className="w-full max-w-md bg-[#13192b]/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2 text-white">
              {isLoginForm ? "Platform Access" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-400 mb-8">
              {isLoginForm ? "Authenticate to securely access your developer workspace." : "Join the ultimate developer network today."}
            </p>

            {!isLoginForm && (
              <div className="space-y-4 mb-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-gray-300 text-xs font-semibold uppercase tracking-wider">First Name</span>
                  </label>
                  <input
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                    type="text"
                    className="w-full bg-transparent border-b border-gray-700 py-2 text-white focus:border-[#ffcc63] focus:outline-none transition-colors"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-gray-300 text-xs font-semibold uppercase tracking-wider">Last Name</span>
                  </label>
                  <input
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    type="text"
                    className="w-full bg-transparent border-b border-gray-700 py-2 text-white focus:border-[#ffcc63] focus:outline-none transition-colors"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            )}

            <div className="form-control mb-4">
              <label className="label py-1">
                <span className="label-text text-gray-300 text-xs font-semibold uppercase tracking-wider">Work Email</span>
              </label>
              <input
                onChange={(e) => setEmailId(e.target.value)}
                value={emailId}
                type="text"
                className="w-full bg-transparent border-b border-gray-700 py-2 text-white focus:border-[#ffcc63] focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-control mb-8">
              <label className="label py-1 flex justify-between">
                <span className="label-text text-gray-300 text-xs font-semibold uppercase tracking-wider">Password</span>
                {isLoginForm && <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Reset</a>}
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className="w-full bg-transparent border-b border-gray-700 py-2 text-white focus:border-[#ffcc63] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <div className="text-red-400 text-sm mb-4 bg-red-900/20 p-2 rounded border border-red-900/50">
                {errorMsg}
              </div>
            )}

            <button
              onClick={isLoginForm ? onLogin : onSignUp}
              className="w-full bg-white text-black font-semibold py-3 rounded hover:bg-gray-200 transition-colors flex justify-center items-center gap-2"
            >
              {isLoginForm ? "Sign In" : "Sign Up"}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </button>

            <div className="mt-8 text-center text-xs text-gray-500">
              {isLoginForm ? "New to Dev?" : "Already have an account?"}{" "}
              <button
                onClick={() => setIsLoginForm(!isLoginForm)}
                className="text-white hover:text-[#ffcc63] font-semibold underline-offset-2 hover:underline ml-1"
              >
                {isLoginForm ? "Join now" : "Login here"}
              </button>
            </div>

            <div className="mt-8 text-xs text-gray-500 border-t border-gray-800 pt-4">
              For platform support, please contact your IT administrator or reach out to <a href="#" className="text-gray-400 underline">support@devtinder.com</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper to generate star positions
const generateBoxShadow = (n) => {
  let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
  for (let i = 2; i <= n; i++) {
    value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
  }
  return value;
}

export default login