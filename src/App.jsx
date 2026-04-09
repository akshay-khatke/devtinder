import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavBar from "./components/NavBar"
import Body from "./screens/Body"
import Profile from "./screens/Profile"
import Login from "./login/login"
import { Provider } from "react-redux"
import appStore from "./store/store"
import Feed from "./screens/Feed"
import EditProfile from "./screens/EditProfile"
import Connections from "./screens/Connections"
import Requests from "./screens/Requests"
import Chat from "./screens/Chat"
import ProtectedRoute from "./routes/ProtectedRoute"
import AllChats from "./screens/AllChats"
import ResumeChecker from "./screens/ResumeChecker"
import ChatBot from "./screens/ChatBot"
function App() {

  //element desides the  waht render on this route it qure jsx elemnt
  return (
    <div>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<Body />} >
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/EditProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
              <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
              <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
              <Route path="/chat/:targetUserId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/allchats" element={<ProtectedRoute><AllChats /></ProtectedRoute>} />
              <Route path="/resume-checker" element={<ProtectedRoute><ResumeChecker /></ProtectedRoute>} />
              <Route path="/chatbot" element={<ProtectedRoute><ChatBot /></ProtectedRoute>} />
            </Route>

          </Routes>
          {/* <NavBar /> */}
        </BrowserRouter>
      </Provider>
    </div>
  )
}

export default App
