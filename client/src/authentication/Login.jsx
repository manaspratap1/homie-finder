import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginUserThunk } from "../store/slice/user/user.thunk";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async() => {
    const response = await dispatch(loginUserThunk(loginData));
    if (response?.payload?.token) {

      localStorage.setItem("token", response.payload.token);
      localStorage.setItem("user", JSON.stringify(response.payload.user)); 
  
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Login failed. Invalid credentials.");
    }
  };
  

  return (
    <div className="flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-[40rem] w-full flex flex-col gap-5 bg-base-200 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold">Please Login..!!</h2>

        <label className="input input-bordered flex items-center gap-2 w-full">
          <FaUser />
          <input
            type="email"
            name="email"
            className="grow"
            placeholder="Email"
            onChange={handleInputChange}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2 w-full">
          <IoKeySharp />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="grow"
            onChange={handleInputChange}
          />
        </label>

        <button onClick={handleLogin} className="btn btn-primary">
          Login
        </button>

        <p>
          Don't have an account? &nbsp;
          <Link to="/signup" className="text-blue-400 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
