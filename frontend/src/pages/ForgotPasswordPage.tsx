import Countdown from "components/Countdown";
import Layout from "components/Layout";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetData } from "redux/api/types";
import {
  deleteResetPasswordAsync,
  resetPasswordAsync,
  sendPasswordResetEmailAsync,
} from "redux/features/async_functions/userAsyncSlice";
import { useAppDispatch } from "redux/store";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [cPwd, setCPwd] = useState("");
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [showResendLink, setShowResendLink] = useState(false);
  const [initialTimer, setInitialTimer] = useState(60); // Initial time in seconds
  const [countdownKey, setCountdownKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const handleCountdownComplete = () => {
    setShowResendLink(true);
  };

  const data: resetData = {
    email: email,
    new_password: pwd,
    code: code,
  };

  const showToastWithTimeout = (message: string, type: string) => {
    setShowToast(type);
    setToastMsg(message);
    setTimeout(() => {
      setShowToast("");
    }, 5000);
    setIsLoading(false);
  };

  const handleReset = async () => {
    setIsLoading(true);
    await dispatch(resetPasswordAsync(data));
    setTimeout(() => {}, 3000);
    showToastWithTimeout("password changed succesfuly", "success");
    setIsLoading(false);
    navigate("/login");
  };

  const handleResendClick = () => {
    dispatch(deleteResetPasswordAsync(email)).then(() => {
      dispatch(sendPasswordResetEmailAsync(email));
      setShowResendLink(false); // Hide the resend link
      setInitialTimer(60); // Reset the initial timer
      setCountdownKey((prevKey) => prevKey + 1); // Force Countdown remount
    });
  };

  const handleSendEmail = async () => {
    try { 
      console.log("Sending email...");
      await dispatch(sendPasswordResetEmailAsync(email));
      console.log("Email sent successfully.");
      setStep(1);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <Layout title="SITE | Reset Password" content="Forgot password page">
      <div className="flex flex-col items-center">
        <div className="mt-28 w-8/12">
          {showToast && (
            <div className="toast">
              <div className={`alert alert-${showToast}`}>
                <span className="font-bold">{toastMsg}</span>
              </div>
            </div>
          )}
          {step === 0 && (
            <div>
              <div className="block mb-2 text-xs font-bold tracking-wide uppercase">
                Please enter you email address
              </div>
              <input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="focus:outline-blue-800 focus:border-none bg-transparent placeholder:text-base-content outline-none w-full px-3 py-3 leading-tight border border-gray-500 rounded-lg"
              />
              <button
                onClick={handleSendEmail}
                className="btn btn-primary w-full mt-1">
                Send Verification Code
              </button>
            </div>
          )}
          {step === 1 && (
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
                className="outline-none border border-b-2 border-black darkMode textbox-colors bg-base-100"
              />
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
                    dispatch(deleteResetPasswordAsync(email));
                    setStep(0);
                  }}>
                  Click here to edit
                </span>
              </div>
              <div className="w-full mt-4">
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
              <div>
                <div className="my-2 text-xs font-bold tracking-wide uppercase">
                  confirm password <span className="text-red-900">*</span>
                </div>
                <input
                  placeholder="················"
                  onChange={(e) => setCPwd(e.target.value)}
                  className="block w-full px-3 py-3 leading-tigh bg-transparent placeholder:text-base-content border border-gray-500 rounded-lg"
                  type="password"
                />

                {pwd !== cPwd && (
                  <span className="text-red-800 italic">
                    *passwords don't match*
                  </span>
                )}
              </div>
              <button
                disabled={isLoading}
                onClick={handleReset}
                className="btn btn-primary mt-1">
                {isLoading ? "Sending" : "Reset Password"}
                {isLoading && (
                  <span className="loading loading-dots loading-xs"></span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
