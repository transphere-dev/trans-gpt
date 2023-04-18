export async function registerUser(username, email, password, confirmPassword) {
    if (password !== confirmPassword) {
      console.error('Error: Password and confirm password do not match');
      return false;
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        return false;
      }
  
      const newUser = await response.json();
      console.log('New user created:', newUser);
      return true;
    } catch (err) {
      console.error('Network error:', err);
      return false;
    }
  }

export  async function loginUser(email, password) {
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        return null;
      }
  
      const data = await response.json();
      return { token: data.token, user: data.user };
    } catch (err) {
      console.error('Network error:', err);
      return null;
    }
  }
  
  

  export async function getUser(token) {
    try {
      const response = await fetch('http://localhost:8080/api/users/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        return null;
      }
  
      const userData = await response.json();
      return userData;
    } catch (err) {
      console.error('Network error:', err);
      return null;
    }
  }
  
  export function getCurrentDateTime() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  
    return formattedDateTime;
  }