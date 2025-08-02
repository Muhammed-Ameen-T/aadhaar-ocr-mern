import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ocrRoutes from './routes/ocr.routes';
dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://aadhaar.muhammedameen.site',
  credentials: true
}));
app.use(express.json());

app.get('/ping', (_, res) => res.send('Server is up!'));
app.use('/api/aadhaar', ocrRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));