import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
    setIsDataSubmitted(false);
  };

  /* ================= SUBMIT ================= */
  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Step 1 → show bio field
    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    // Signup
    if (currentState === "Sign up") {
      login("signup", { fullName, email, password, bio });
    }
    // Login
    else {
      login("login", { email, password });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* ================= LEFT ================= */}
      <img src={assets.logo_big} alt="logo" className="w-[min(30vw,250px)]" />

      {/* ================= RIGHT ================= */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && (
            <img
              src={assets.arrow_icon}
              alt="back"
              className="w-5 cursor-pointer"
              onClick={() => setIsDataSubmitted(false)}
            />
          )}
        </h2>

        {/* ================= FULL NAME ================= */}
        {currentState === "Sign up" && !isDataSubmitted && (
          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
          />
        )}

        {/* ================= EMAIL + PASSWORD ================= */}
        {!isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {/* ================= BIO ================= */}
        {currentState === "Sign up" && isDataSubmitted && (
          <textarea
            rows={4}
            placeholder="Provide a short bio..."
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        {/* ================= BUTTON ================= */}
        <button
          type="submit"
          className="py-3 bg-linear-to-r from-purple-500 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currentState === "Sign up" ? "Create account" : "Login now"}
        </button>

        {/* ================= SWITCH ================= */}
        {currentState === "Sign up" ? (
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => {
                setCurrentState("Login");
                resetForm();
              }}
              className="text-violet-400 cursor-pointer font-medium"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-400">
            Create an account?{" "}
            <span
              onClick={() => {
                setCurrentState("Sign up");
                resetForm();
              }}
              className="text-violet-400 cursor-pointer font-medium"
            >
              Click here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
