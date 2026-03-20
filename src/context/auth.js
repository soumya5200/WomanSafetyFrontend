//import axios from "axios";
//import { createContext, useContext, useEffect, useState } from "react";
//import toast from "react-hot-toast";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

  // ✅ SAFE localStorage access
  const [auth, setAuth] = useState({
    user: null,
    token: ""
  });

  // ✅ load auth AFTER mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("auth");
        if (data) {
          const parsed = JSON.parse(data);
          setAuth(parsed);
        }
      }
    } catch (err) {
      console.error("Auth load error:", err);
    }
  }, []);

  // ✅ attach token ONLY if exists
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth?.token]);

  // ✅ interceptor WITHOUT redirect / clear
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error?.response?.status === 401) {
          console.error("401 Unauthorized – token invalid or expired");
          // ❌ no redirect
          // ❌ no localStorage clear
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };