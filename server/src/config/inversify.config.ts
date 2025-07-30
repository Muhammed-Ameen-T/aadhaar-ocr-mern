import 'reflect-metadata';
import { Container } from 'inversify';
import { IOcrService } from '../interfaces/IOcrService';
import { OcrController } from '../controllers/ocrController';
import { OcrService } from '../services/ocrService';
import { TYPES } from '../types/types';


const container = new Container();

container.bind<IOcrService>(TYPES.OcrService).to(OcrService).inSingletonScope();
container.bind<OcrController>(OcrController).toSelf();

export default container;
