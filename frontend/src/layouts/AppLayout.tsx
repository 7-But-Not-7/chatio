import React from "react";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-[100dvh] bg-gradient-to-b from-[#C32BC6] to-[#2F6EB5]">
      <header>
        <h1>App Layout</h1>
      </header>
      <main>
        <div className="">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;