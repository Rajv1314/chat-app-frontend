import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuthStore } from "./store/userAuthStore";
import { Loader } from "lucide-react";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profilepage from "./pages/Profilepage";
import { Toaster } from "react-hot-toast";
import { useThemeStrore } from "./store/useThemeStrore";
export default function App() {
  const { authUser, checkAuth, isCheckingAuth,onlineUsers } = useAuthStore();
  const {theme} =useThemeStrore();
  useEffect(() => {
    checkAuth();
  }, []);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex  justify-center  items-center h-screen">
        <Loader className="size-10 animate-spin"></Loader>
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to={"/"} />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/profile"
          element={authUser ? <Profilepage /> : <Navigate to={"/login"} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}
