import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import entriesRouter from './routes/entries';
import authRouter from './routes/auth';

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();

// Configuration des middlewares
app.use(cors());
app.use(express.json());

// Montage des routes
app.use('/api/entries', entriesRouter);
app.use('/api/auth', authRouter);

// Export de l'instance app
export default app; 