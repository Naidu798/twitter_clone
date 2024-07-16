import React from "react";
import Sidebar from "../components/Sidebar";
import Main from "./Main";
import RightPanel from "../components/RightPanel";

const Home = () => {
  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="w-[1100px] h-full flex">
        <Sidebar />
        <Main />
        <RightPanel />
      </div>
    </div>
  );
};

export default Home;
