// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { getUser, loginUser, registerUser } from "../lib/requests";
import { usePathname, useRouter } from "next/navigation";
import Loading from "./Loading";
import EmailVerify from "./EmailVerify";

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
          if(userData.emailverified){
            router.push("/chat");
          }
        } else {
          const pathname = path.split('/')[1]
          if (pathname != "login" || path != "signup" || path != "verify") {
            setAuthLoading(false);
            router.push("/login");
          }
        }
      } else {
        setAuthLoading(false);
        // router.push("/login");
      }
    };
    initUser();
  }, []);

  useEffect(() => {
    if (!user && path.split('/')[1] != 'verify' && path.split('/')[1] != 'ResetPassword' && path.split('/')[1] != 'signup' && path.split('/')[1] != 'forgotPassword') {
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

        router.push(`/verify-email?email=${email}`);
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

  const resendVerificationEmail = async (email) => {
    try {
      setError(null)
      const response = await fetch('http://192.168.4.62:8080/api/users/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        // Show a success message
      } else {
        // Show an error message
        setError("Error resending verification email")
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      setError(error.message)
      // Show an error message
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, error, signup, loading ,setError,resendVerificationEmail }}>
      {user && user.emailverified  === false && !authLoading && path.split('/')[1] !='verify' ? <EmailVerify email={user.email} onResendVerification={resendVerificationEmail} /> : !authLoading ? children : <Loading />}

    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
