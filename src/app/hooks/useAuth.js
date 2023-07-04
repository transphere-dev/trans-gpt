// useAuth.js
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../components/AuthContextWrapper';

function useAuth() {
  const { authToken } = useContext(AuthContext);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (authToken) {
      // Check token validity
      const isValidToken = true; // Replace with actual token validation logic
      setIsValid(isValidToken);
    } else {
      setIsValid(false);
    }
  }, [authToken]);

  return isValid;
}

export default useAuth;
