import AuthContext from "../contexts/AuthContext.js";
import { useState, useEffect, useContext, useMemo } from "react";

function AuthContextWrapper({ children }) {
  const [user,setUser] = useState({userId:1});

  const values = {
    user
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export default AuthContextWrapper;
