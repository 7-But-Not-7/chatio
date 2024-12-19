import React from "react";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <header>
        <h1>App Layout</h1>
      </header>
      <main>
        <div className="w-full h-[800px] text-blue-950">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;