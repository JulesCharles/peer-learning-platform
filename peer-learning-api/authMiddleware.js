const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: 'No token provided' });
  }

  console.log("Token received: ", token);

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) {
      console.log("Invalid token");
      return res.status(403).json({ message: 'Token is not valid' });
    }
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
