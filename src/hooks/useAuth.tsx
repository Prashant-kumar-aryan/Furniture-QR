"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // NEW

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("myfurnituretoken");

      if (storedToken) {
        const decoded = jwtDecode<{ exp: number }>(storedToken);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          localStorage.removeItem("myfurnituretoken");
          setToken(null);
          setIsLoggedIn(false);
        } else {
          setToken(storedToken);
          setIsLoggedIn(true);
        }
      } else {
        setToken(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Error fetching token:", err);
      setToken(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false); // ✅ Mark auth check complete
    }
  }, []);

  const logout = () => {
    setLoading(true); // ✅ Set loading to true while logging out
    console.log("Logging out...");
    localStorage.removeItem("myfurnituretoken");
    setToken(null);
    setIsLoggedIn(false);
    setLoading(false); // ✅ Mark logout complete
    window.location.reload(); // Refresh the page to clear state
  };

  return {
    token,
    isLoggedIn,
    loading, // ✅ Return loading state
    logout, // ✅ Return logout function
  };
}
