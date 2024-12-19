import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";

const AuthLayout: React.FC = () => {
  return (
    <div>
      <main className=" bg-gradient-to-b from-[#2F6EB5] to-[#C32BC6]">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export default AuthLayout;