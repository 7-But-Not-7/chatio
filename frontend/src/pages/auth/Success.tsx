import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import success from "./assets/success.svg";

export const Success: React.FC = () => {
  return (
    <div className="w-2/3 h-2/3 flex flex-col items-center">
      <img src={success} className="shadow-lg rounded-full w-60 h-60 border border-solid bg-[#ffffff4d] mb-8" alt="success image" />

      <span className="text-center w-fit h-6 ">
        <h1 className="text-white font-semibold text-2xl">Verified</h1>
        <h1 className="text-white font-semibold text-2xl">Welcome Aboard</h1>
      </span>
    </div>
  );
};
