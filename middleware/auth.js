import jwt from 'jsonwebtoken'
import { authService } from '../services/authService.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email , role: user.role},
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '3d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Token invalide');
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Erreur lors du décodage du token');
  }
};

// export const verifyRole = (req, role) => {
//   if (req.user?.role !== role) {
//     throw new Error('Accès refusé: rôle insuffisant');
//   }
// };

export const requireAnyRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !roles.includes(req.user.role)) {
        throw new Error(`Accès refusé.`);
      }
      next();
    } catch (error) {
      res.status(403).json({ error: error.message });
    }
  };
};

export const checkUserActive =async (req, res, next) =>{
  try {
    const userId = req.user.userId; // depuis JWT
    const user = await authService.getProfile(userId);
    const isActive = user.is_active;
    if (!isActive) {
      return res.status(403).json({
        message: "Your account is disabled. Contact admin."
      });
    }

    next();

  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(401).json({ message: "Invalid user" });
    }
    res.status(500).json({ message: "Server error" });
  }
};