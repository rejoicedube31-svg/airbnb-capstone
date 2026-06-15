import { createContext, useContext, useEffect, useState } from "react";
import { clearAuth, getStoredUser, getToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    function syncAuth() {
      setUser(getStoredUser());
      setToken(getToken());
    }

    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-changed", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  function setAuth(tokenValue, userValue) {
    if (tokenValue && userValue) {
      localStorage.setItem("airbnb_capstone_token", tokenValue);
      localStorage.setItem("airbnb_capstone_user", JSON.stringify(userValue));
    }
    setToken(tokenValue);
    setUser(userValue);
    window.dispatchEvent(new Event("auth-changed"));
  }

  function logout() {
    clearAuth();
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: Boolean(token), setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
