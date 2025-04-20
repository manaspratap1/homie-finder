import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoKeySharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { registerUserThunk } from "../store/slice/user/user.thunk";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState(null);
  const [signupData, setSignupData] = useState({
    profilePic: null,
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSignupData((prev) => ({ ...prev, profile: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSignup = async() => {
    if (signupData.password !== signupData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    toast.success("Signup data printed to console!");

    const response = await dispatch(registerUserThunk(signupData));
    if (response?.payload?.token) {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Login failed. Invalid credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center p-6 min-h-screen">
      <div className="max-w-[40rem] w-full flex flex-col items-center gap-5 bg-base-200 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-semibold">Please Signup..!!</h2>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center gap-2">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <label className="input input-bordered flex items-center gap-2 w-full">
          <FaUser />
          <input
            type="text"
            name="name"
            className="grow"
            placeholder="Full Name"
            onChange={handleInputChange}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2 w-full">
          <input
            type="email"
            name="email"
            className="grow"
            placeholder="Email"
            onChange={handleInputChange}
          />
        </label>

        <label className="input input-bordered flex items-center gap-2 w-full">
          <input
            type="tel"
            name="phone"
            className="grow"
            placeholder="Phone Number"
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

        <label className="input input-bordered flex items-center gap-2 w-full">
          <IoKeySharp />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="grow"
            onChange={handleInputChange}
          />
        </label>

        <div className="input input-bordered flex items-center gap-5 w-full justify-center">
          <label htmlFor="male" className="flex gap-3 items-center">
            <input
              id="male"
              type="radio"
              name="gender"
              value="male"
              className="radio radio-primary"
              onChange={handleInputChange}
              checked={signupData.gender === "male"}
            />
            Male
          </label>
          <label htmlFor="female" className="flex gap-3 items-center">
            <input
              id="female"
              type="radio"
              name="gender"
              value="female"
              className="radio radio-primary"
              onChange={handleInputChange}
              checked={signupData.gender === "female"}
            />
            Female
          </label>
        </div>

        <button onClick={handleSignup} className="btn btn-primary w-full">
          Signup
        </button>

        <p>
          Already have an account? &nbsp;
          <Link to="/login" className="text-blue-400 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
