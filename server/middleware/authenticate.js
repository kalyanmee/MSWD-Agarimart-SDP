const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract the token

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Ensure you're using process.env.JWT_SECRET here
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Use the secret key from env
    req.user = decoded;  // Attach the decoded information to the request object
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Error verifying token:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
