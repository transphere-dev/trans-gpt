// authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key'; // Replace this with your actual secret key

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatted' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.id = decoded.id; // Pass the user ID to the request object for later use

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};

module.exports = authMiddleware;
