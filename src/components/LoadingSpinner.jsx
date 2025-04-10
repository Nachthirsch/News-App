import React from "react";

const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    default: "h-8 w-8 border-2",
    large: "h-12 w-12 border-3",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.default;

  return (
    <div className="flex justify-center items-center">
      <div className={`${spinnerSize} border-t-transparent border-blue-500 dark:border-blue-400 rounded-full animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
