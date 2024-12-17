import React from "react";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="">
          {children}

      {/* <header>
        <h1>App Layout</h1>
      </header> */}
      {/* <main> */}
        {/* <div className=""> */}
        {/* </div> */}
      {/* </main> */}
    </div>
  );
};

export default AppLayout;