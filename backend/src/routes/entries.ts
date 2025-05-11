import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/entries - Récupérer toutes les entrées
router.get(
  '/',
  async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const entries = await prisma.entry.findMany();
      res.status(200).json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// POST /api/entries - Créer une nouvelle entrée
router.post(
  '/',
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { userId, calories } = req.body;
    if (!userId || typeof calories !== 'number') {
      res
        .status(400)
        .json({ error: 'userId (string) et calories (number) sont requis.' });
      return;
    }

    try {
      const entry = await prisma.entry.create({
        data: { userId, calories },
      });
      res.status(201).json(entry);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// PUT /api/entries/:id - Mettre à jour une entrée
router.put(
  '/:id',
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { calories } = req.body;
    if (typeof calories !== 'number') {
      res.status(400).json({ error: 'calories (number) est requis.' });
      return;
    }

    try {
      const entry = await prisma.entry.update({
        where: { id },
        data: { calories },
      });
      res.status(200).json(entry);
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Entrée non trouvée.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

// DELETE /api/entries/:id - Supprimer une entrée
router.delete(
  '/:id',
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { id } = req.params;

    try {
      await prisma.entry.delete({ where: { id } });
      res.sendStatus(204);
    } catch (error: any) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: 'Entrée non trouvée.' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

export default router;
