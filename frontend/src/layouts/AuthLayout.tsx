import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div>
        <h1 className="bg-black text-white">Auth Layout</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;