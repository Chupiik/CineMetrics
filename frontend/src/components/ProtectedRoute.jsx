import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const { user, authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!authLoading) {
      auth().catch(() => setIsAuthorized(false));
    }
  }, [authLoading]);

  const refreshToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", { refresh });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;
      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      setIsAuthorized(false);
    }
  };

  if (authLoading || !isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!user || (adminOnly && (!user.groups || !user.groups.includes("Admin")))) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;
