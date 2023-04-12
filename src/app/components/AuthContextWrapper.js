// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { getUser, loginUser, registerUser } from "../lib/requests";
import { usePathname, useRouter } from "next/navigation";
import Loading from "./Loading";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const initUser = async () => {
      const token = Cookies.get("authToken");

      if (token) {
        const userData = await getUser(token);
        if (userData) {
          setUser(userData);
          setAuthLoading(false);
          router.push("/chat");
        } else {
          if (path != "/login" || path != "/signup") {
            setAuthLoading(false);
            router.push("/login");
          }
        }
      } else {
        setAuthLoading(false);
        router.push("/login");
      }
    };
    initUser();
  }, []);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }

    return () => {
      null;
    };
  }, [user]);



  const login = async (email, password) => {
    setLoading(true)
    const data = await loginUser(email, password);
    if (data) {
      // Set the authToken cookie and update the user state
      Cookies.set("authToken", data.token);
      setUser(data.user);
      setLoading(false)
      setError(null);
      router.push("/chat");
    } else {
      console.log("User login failed");
      setLoading(false)
      setError("User login failed.");
    }
  };

  const signup = async (username, email, password, confPass) => {
    setLoading(true)
      const data = await registerUser(username,email, password, confPass);
      if (data) {
        // Set the authToken cookie and update the user state
        setError(null);
        setLoading(false)
        router.push("/verify");
      } else {
        setLoading(false)

        console.log("User login failed");
        setError("Registration failed. Check your password match");
      }
    };

  const logout = () => {
    // Remove the authToken cookie and clear the user state
    Cookies.remove("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, signup, loading ,setError }}>
      {!authLoading ? children : <Loading />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
