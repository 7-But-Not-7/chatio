import React, { useEffect } from "react";
import useInstallPrompt from "../hooks/useInstallPrompt";
import { getHello } from "../services/test-api-service";

const Base: React.FC = () => {
  const { handleInstallClick } = useInstallPrompt();

  useEffect(() => {
    const fetch = async () => {
      const response = await getHello();
      console.log(response);
    };
    fetch();
  }, []); // Add the dependency array to prevent repeated calls.

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-600/50 backdrop-blur-lg">
      <div className=" p-6 rounded-lg shadow-md backdrop-blur-lg">
        <h1 className="text-2xl font-bold text-white mb-4">Welcome to Chat.io!</h1>
        <button
          id="install-button"
          onClick={handleInstallClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Install App
        </button>
        <button
          id="install-button"
          onClick={() => window.location.href = "/auth/sign-up"} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-4"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Base;
