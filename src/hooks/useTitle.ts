import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeTitles: Record<string, string> = {
  "/": "Home - My App",
  "/about": "About - My App",
  "/contact": "Contact - My App",
  "/dashboard": "Dashboard - My App",
};

const useTitle = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = routeTitles[location.pathname] || "My App";
  }, [location]);
};

export default useTitle;
