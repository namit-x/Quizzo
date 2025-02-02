import React, { useEffect, useState } from "react";

const Timer = ({ initialTime, restart }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (restart) {
      setTimeLeft(initialTime)
    }
  }, [restart, initialTime]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeLeft(initialTime);
    }
  }, [timeLeft, initialTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center w-full h-20">
      <div className="text-3xl font-bold text-white bg-blue-500 px-6 py-3 rounded-lg shadow-lg">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default Timer;
