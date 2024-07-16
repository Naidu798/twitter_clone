import React from "react";

const Loading = ({ size = 10, b = 4 }) => {
  return (
    <div>
      <div
        className={`h-${size} w-${size} border-${b} border-gray-700 border-b-gray-400 animate-spin rounded-full mx-3 my-1`}
      ></div>
    </div>
  );
};

export default Loading;
