import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import ocrRoutes from './routes/ocr.routes'
import { errorHandler } from './middlewares/errorHandler.middleware';
import { SuccessMsg } from './utils/constants/commonSuccessMsg.constants';
import { env } from './config/env.config';


const app = express();
app.use(cors({
  origin: env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/aadhaar', ocrRoutes);

app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => console.log(`${SuccessMsg.SERVER_RUNNING} ${PORT}`));