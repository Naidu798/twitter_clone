import { createContext, useEffect, useLayoutEffect, useState } from "react";
import toast from "react-hot-toast";
import backendDomain from "../common";

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [activeTab, setActiveTab] = useState("HOME");
  const [currentUser, setCurrentUser] = useState(null);
  const [tabSection, setTabSection] = useState("FOR_YOU");

  //posts
  const [notifications, setNotifications] = useState([]);

  const customToast = (type, msg) => {
    return toast[type](msg, {
      style: {
        borderRadius: "6px",
        background: "#333",
        color: "#fff",
      },
      position: type === "success" ? "top-center" : "top-right",
    });
  };

  const getCurrentUser = async () => {
    try {
      const res = await fetch(backendDomain.auth.me, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(backendDomain.notifications.getAll, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      } else {
        customToast("error", data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  useLayoutEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLightTheme,
        setIsLightTheme,
        setActiveTab,
        activeTab,
        customToast,
        currentUser,
        setCurrentUser,
        getCurrentUser,
        tabSection,
        setTabSection,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
