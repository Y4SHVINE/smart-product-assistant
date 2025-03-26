import { Request, Response, NextFunction } from 'express';
import { User } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';

// Add user property to Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header is required' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ error: 'Bearer token is required' });
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Supabase auth error:', error);
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}; 