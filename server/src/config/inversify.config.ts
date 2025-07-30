import 'reflect-metadata';
import { Container } from 'inversify';
import { IOcrService } from '../interfaces/IOcrService.js';
import { OcrController } from '../controllers/ocrController.js';
import { OcrService } from '../services/ocrService.js';
import { TYPES } from '../types/types.js';


const container = new Container();

container.bind<IOcrService>(TYPES.OcrService).to(OcrService).inSingletonScope();
container.bind<OcrController>(OcrController).toSelf();

export default container;
