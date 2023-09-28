import Layout from "components/Layout";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import { useSelector } from "react-redux";
import { lock_svg } from "config";
import { loginAsync } from "redux/features/async_functions/userAsyncSlice";
import { a_token } from "redux/features/slices/userSlice";

const Loginpage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [Cred, setCred] = useState("");
  const [Pwd, setPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(""); // Added error state

  const handleSubmit = () => {
    setIsLoading(true); // Start loading animation
    const credentials = { username: Cred, password: Pwd, rememberMe };

    setError(""); // Clear any previous errors

    dispatch(loginAsync(credentials))
      .then((action) => {
        if (loginAsync.rejected.match(action)) {
          setError("Login failed. Please check your credentials.");
          setIsLoading(false)
        } else {
          // Delay the navigation by 3 seconds
          setTimeout(() => {
          setIsLoading(false);
            navigate("/");
          }, 3000);
        }
      })
      .catch(() => {
        setError("An error occurred while logging in.");
      });
  };
  const saved_token = useSelector(a_token) || ""
  const expired_access_token = useJwt(saved_token).isExpired; // Check token expiration
  
  if (!expired_access_token) {
    navigate("/");
  }

  return (
    <Layout title="SITE | Login" content="Login page">
      <div className="flex justify-center flex-col">
        <div className="mt-28 text-center text-primary">
          {lock_svg}
          <h2 className="text-4xl tracking-tight text-base-content">Sign in into your account</h2>
          <span className="text-sm text-base-content">
            or{" "}
            <Link to={"/register"} className="custom-link">
              register a new account
            </Link>
          </span>
        </div>

        <div className="flex justify-center mx-4 my-2 text-base-content">
          <div className="flex flex-wrap mb-6 -mx-3">
            <div className="w-full px-3 mb-6">
              <div className="block mb-2 text-xs font-bold tracking-wide uppercase">
                email address
              </div>
              <input
                onChange={(e) => setCred(e.target.value)}
                placeholder="example@gmail.com"
                className="focus:outline-blue-800 focus:border-none bg-transparent placeholder:text-base-content outline-none w-full px-3 py-3 leading-tight border border-gray-500 rounded-lg"
              />
            </div>
            <div className="w-full px-3 mb-6">
              <div className="block mb-2 text-xs font-bold tracking-wide uppercase">
                password
              </div>
              <input
                onChange={(e) => setPwd(e.target.value)}
                placeholder="················"
                className="block w-full px-3 py-3 leading-tigh bg-transparent placeholder:text-base-content border border-gray-500 rounded-lg"
                type="password"
              />
            </div>
            <div className="flex items-center justify-between w-full px-3 mb-3 ">
              <div className="flex items-center w-1/2">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-1 bg-white shadow"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)} // Toggle rememberMe state
                />
                <label htmlFor="remember" className="pt-1 mb-1 text-sm">
                  Remember Me
                </label>
              </div>
              <div className="w-1/2 text-right">
                <Link to={"/reset-password"} className="text-sm tracking-tight custom-link">
                  Forget your password?
                </Link>
              </div>
            </div>
            <div className="w-full px-3 mb-6 md:w-full">
              <button
                onClick={handleSubmit}
                className={`login-btn ${
                  isLoading ? "opacity-50 cursor-wait" : ""
                }`}
                disabled={isLoading}>
                  {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
            {error && ( // Render error message if error state is not empty
              <div className="w-full text-center text-red-500">{error}</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Loginpage;
