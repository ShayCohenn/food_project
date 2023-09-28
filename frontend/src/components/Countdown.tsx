import React, { useEffect, useState, useCallback } from "react";

const Countdown = ({ initialTime = 300, onCountdownComplete = () => {} }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    // Start the countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer); // Stop the timer when it reaches 0
          onCountdownComplete(); // Trigger the callback when countdown completes
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Update every 1 second

    return () => {
      clearInterval(timer); // Clean up the timer when the component unmounts
    };
  }, [onCountdownComplete]);

  useEffect(() => {
    // Reset the timer when the initialTime prop changes
    resetTimer();
  }, [initialTime, resetTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Format the time to display as MM:SS
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return <div>{formattedTime}</div>;
};

export default Countdown;
