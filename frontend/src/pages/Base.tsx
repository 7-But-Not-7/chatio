import React, { useEffect } from "react";
import useInstallPrompt from "../hooks/useInstallPrompt";
import { getHello } from "../services/test-api-service";

const Base: React.FC = () => {
    const { handleInstallClick } = useInstallPrompt();

    useEffect(() => {
      const fetch = async()=>{
        const response = await getHello();
        console.log(response);
      }
      fetch();
    });
  return (
    <div>
      <h1>Welcome to ChatApp!</h1>
      <button id="install-button" onClick={handleInstallClick}>
        Install App
      </button>
    </div>
  );
};

export default Base;
