import jwt from 'jsonwebtoken';

/**
 * Validates and retrieves the JWT Secret from environment variables.
 * Fails securely in production if JWT_SECRET is missing.
 */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: JWT_SECRET environment variable is missing in production!');
      throw new Error('FATAL: JWT_SECRET environment variable is missing in production.');
    }
    console.warn('⚠️ WARNING: JWT_SECRET is not set in environment. Using development secret.');
    return 'rescueiq_dev_secret_key_change_in_production_2026';
  }
  return secret;
};

/**
 * Authentication Middleware:
 * Verifies Bearer JWT signature and expiration.
 * Injects decoded user payload into req.user.
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied. No valid authentication token provided.' 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. Token missing.' 
      });
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Authentication token has expired. Please log in again.',
        expired: true 
      });
    }
    return res.status(401).json({ 
      error: 'Invalid or malformed authentication token.' 
    });
  }
};

/**
 * Role-Based Authorization Middleware:
 * Enforces permissions based on user roles (admin, responder, dispatcher, civilian).
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required for this operation.' });
    }

    const userRole = req.user.role || 'responder';
    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        error: `Access forbidden: user role '${userRole}' lacks required permissions.` 
      });
    }

    next();
  };
};

// Aliases for compatibility
export const protect = authMiddleware;
export default authMiddleware;
