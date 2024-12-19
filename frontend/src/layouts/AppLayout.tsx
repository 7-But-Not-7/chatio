import React from "react";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <header>
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