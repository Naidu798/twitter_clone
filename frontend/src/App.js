import { Outlet } from "react-router-dom";
import "./App.css";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

function App() {
  const { isLightTheme } = useContext(AppContext);
  return (
    <div className={`w-screen h-screen`}>
      <Toaster />
      <main
        className={`h-full w-full ${
          isLightTheme ? "bg-slate-100" : "bg-black"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default App;
