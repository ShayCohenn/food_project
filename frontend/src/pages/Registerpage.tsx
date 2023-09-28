import Layout from "components/Layout";
import React, { useState } from "react";
import { useJwt } from "react-jwt";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "redux/store";
import { lock_svg } from "config/index";
import {
  deleteVerifyEmailAsync,
  registerUserAsync,
  verifyEmailAsync,
} from "redux/features/async_functions/userAsyncSlice";
import Countdown from "components/Countdown";
import { RegisterCreds, VerifyEmail } from "redux/api/types";
import { a_token } from "redux/features/slices/userSlice";

const Registerpage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [First_name, setFirst_name] = useState("");
  const [Last_name, setLast_name] = useState("");
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Pwd, setPwd] = useState("");
  const [Cpwd, setCpwd] = useState("");
  const [Code, setCode] = useState("");
  const [Checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step1, setStep1] = useState(true);
  const [Is_valid, setIs_valid] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);

  const emailData: VerifyEmail = {
    email: Email,
    username: Username,
  };

  const [initialTimer, setInitialTimer] = useState(60); // Initial time in seconds
  const [countdownKey, setCountdownKey] = useState(0); // Key to force remount of Countdown

  const handleCountdownComplete = () => {
    setShowResendLink(true);
  };

  const handleResendClick = () => {
    dispatch(deleteVerifyEmailAsync(Email)).then(() => {
      dispatch(verifyEmailAsync(emailData));
      setShowResendLink(false); // Hide the resend link
      setInitialTimer(60); // Reset the initial timer
      setCountdownKey((prevKey) => prevKey + 1); // Force Countdown remount
    });
  };
  
  const validate_data = () => {
    if (
      First_name === "" ||
      Last_name === "" ||
      Username === "" ||
      Email === "" ||
      Pwd === "" ||
      Cpwd === "" ||
      !Email.includes("@") ||
      Pwd !== Cpwd ||
      !Checked ||
      Pwd.length < 8
    )
      setIs_valid(false);
    else setIs_valid(true);
  };

  const handleSubmit = () => {
    validate_data();
    if (!Is_valid) {
      setError("Please check your information");
      return;
    }
    setIsLoading(true); // Start loading animation
    setError(""); // Clear any previous errors

    dispatch(verifyEmailAsync(emailData))
      .then((action) => {
        if (verifyEmailAsync.rejected.match(action)) {
          // Check the error message to determine the type of error
          const errorMessage = action.error.message;

          if (errorMessage === "Username already registered") {
            setError(
              "Username is already taken. Please choose a different username."
            );
            setIsLoading(false);
          } else if (errorMessage === "Email already registered") {
            setError(
              "Email is already registered. Please use a different email address."
            );
            setIsLoading(false);
          } else {
            setError("Something went wrong. Please check your information.");
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
          setStep1(false);
        }
      })
      .catch(() => {
        setError("An error occurred while verifying the email.");
      });
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setError("");
    const userData: RegisterCreds = {
      username: Username,
      first_name: First_name,
      last_name: Last_name,
      email: Email,
      password: Pwd,
      verification_code: Code,
    };
    dispatch(registerUserAsync(userData))
      .then((action) => {
        if (registerUserAsync.rejected.match(action)) {
          setError(
            "An error occurred while creating your account, please try again"
          );
          setIsLoading(false);
        } else {
          // Creating account success
          // Delay the navigation by 3 seconds
          setTimeout(() => {
            setIsLoading(false);
            navigate("/");
          }, 3000);
        }
      })
      .catch(() => {
        setError("Unknown error, please try again");
        navigate("/");
      });
  };
  const access_token = useSelector(a_token) || "";
  const expired_access_token = useJwt(access_token).isExpired; // Check token expiration

  if (!expired_access_token) {
    navigate("/");
  }

  return (
    <Layout title="SITE | Register" content="Register page">
      <div className="flex justify-center">
        <div className="w-11/12">
          <div className="mt-28 text-center text-primary">
            {lock_svg}
            <h2 className="text-4xl tracking-tight text-base-content">
              {step1 ? "Register a New Account" : "Confirm your email"}
            </h2>
          </div>
          <div className="flex flex-col items-center">
            {!step1 && (
              <>
                <p>a verification code was sent to this email</p>"{Email}"
              </>
            )}
          </div>
          <div className="flex justify-center mx-4 mt-10 text-base-content">
            {step1 ? (
              <div className="flex flex-wrap mb-6 mx-3">
                <div className="flex w-full justify-between px-3 mb-3">
                  <div className="w-5/12">
                    <div className="block mb-2 text-xs font-bold tracking-wide uppercase">
                      first name <span className="text-red-900">*</span>
                    </div>
                    <input
                      placeholder="Yaniv"
                      onChange={(e) => setFirst_name(e.target.value)}
                      className="form-register-textbox"
                      value={First_name}
                    />
                  </div>
                  <div className="w-5/12">
                    <div className="block mb-2 text-xs font-bold tracking-wide uppercase">
                      last name <span className="text-red-900">*</span>
                    </div>
                    <input
                      placeholder="Legin"
                      onChange={(e) => setLast_name(e.target.value)}
                      className="form-register-textbox"
                      value={Last_name}
                    />
                  </div>
                </div>
                <div className="w-full px-3 mb-3">
                  <div className="block mb-2 text-xs font-bold tracking-wide uppercase">
                    username <span className="text-red-900">*</span>
                  </div>
                  <input
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-register-textbox"
                    value={Username}
                  />
                </div>
                <div className="w-full px-3 mb-3">
                  <div className="block mb-2 text-xs font-bold tracking-wide uppercase">
                    email address <span className="text-red-900">*</span>
                  </div>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="form-register-textbox"
                    value={Email}
                  />
                </div>
                <div className="w-full px-3 mb-3">
                  <div className="block mb-2 text-xs font-bold tracking-wide uppercase">
                    password <span className="text-red-900">*</span>
                  </div>
                  <input
                    placeholder="················"
                    onChange={(e) => setPwd(e.target.value)}
                    className="form-password"
                    type="password"
                  />
                </div>
                <div className="w-full px-3 mb-3">
                  <div className="my-2 text-xs font-bold tracking-wide uppercase">
                    confirm password <span className="text-red-900">*</span>
                  </div>
                  <input
                    placeholder="················"
                    onChange={(e) => setCpwd(e.target.value)}
                    className="form-password"
                    type="password"
                  />

                  {Pwd !== Cpwd && (
                    <span className="text-red-800 italic">
                      *passwords don't match*
                    </span>
                  )}
                </div>
                <div className="w-full px-3 mb-3">
                  <input
                    id="terms"
                    type="checkbox"
                    className="mr-1 bg-white shadow"
                    onChange={() => setChecked(true)}
                  />
                  <label htmlFor="terms" className="pt-1 mb-1 text-sm">
                    I accept the{" "}
                    <a
                      href="URL_TO_TERMS"
                      target="_blank"
                      className="custom-link">
                      terms
                    </a>{" "}
                    &amp;
                    <a
                      href="URL_TO_SERVICES"
                      target="_blank"
                      className="custom-link">
                      services
                    </a>
                  </label>
                  <span className="text-red-900">*</span>
                </div>

                <div className="w-full px-3 mb-6 md:w-full">
                  <button
                    onClick={handleSubmit}
                    className={`login-btn ${
                      isLoading ? "opacity-50 cursor-wait" : ""
                    }`}
                    disabled={isLoading}>
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>
                {error && ( // Render error message if error state is not empty
                  <div className="w-full text-center text-red-500">{error}</div>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                 <Countdown
                  key={countdownKey} // Add a key to force remount
                  initialTime={initialTimer}
                  onCountdownComplete={handleCountdownComplete}
                />
                <input
                  type="number"
                  placeholder="verification code"
                  onChange={(e) => setCode(e.target.value)}
                  className="outline-none border border-b-2 border-black darkMode textbox-colors"
                />
                <button
                  onClick={handleConfirm}
                  className={`login-btn mt-1 ${
                    isLoading ? "opacity-50 cursor-wait" : ""
                  }`}
                  disabled={isLoading}>
                  {isLoading ? "Please wait..." : "Confirm"}
                </button>
                {showResendLink && (
                  <div>
                    <span>dont see the email?</span>
                    <span
                      className="custom-link cursor-pointer ml-2"
                      onClick={handleResendClick}>
                      Click here to resend
                    </span>
                  </div>
                )}
                <div>
                  Wrong email?
                  <span
                    className="custom-link cursor-pointer ml-1"
                    onClick={() => {
                      dispatch(deleteVerifyEmailAsync(Email));
                      setStep1(true);
                    }}>
                    Click here to edit
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Registerpage;
