import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// POST /api/auth/signup
router.post(
  '/signup',
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required.' });
      return;
    }
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hash },
      });
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      res.status(201).json({ token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'email and password are required.' });
      return;
    }
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
