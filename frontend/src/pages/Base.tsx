import React from "react";
import useInstallPrompt from "../hooks/useInstallPrompt";

const Base: React.FC = () => {
    const { handleInstallClick } = useInstallPrompt();
  return (
    <div>
      <h1>Welcome to Chatio!</h1>
      <button id="install-button" onClick={handleInstallClick}>
        Install App
      </button>
    </div>
  );
};

export default Base;
