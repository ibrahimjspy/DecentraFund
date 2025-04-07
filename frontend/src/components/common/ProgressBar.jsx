import React from "react";

const ProgressBar = ({ current, total }) => {
  const percentage = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
