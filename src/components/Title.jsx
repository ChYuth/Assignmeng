import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex items-center gap-3">
      <p className="text-2xl sm:text-3xl font-semibold text-gray-400">
        {text1}
        <span className="text-gray-900"> {text2}</span>
      </p>
      <span className="w-10 sm:w-14 h-[2px] bg-black"></span>
    </div>
  );
};

export default Title;