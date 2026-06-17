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
    window.addEventListener("admin-auth-changed", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("admin-auth-changed", syncAuth);
    };
  }, []);

  const isHost = user?.role === "host";

  function logout() {
    clearAuth();
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("admin-auth-changed"));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: Boolean(token),
        isHost,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
