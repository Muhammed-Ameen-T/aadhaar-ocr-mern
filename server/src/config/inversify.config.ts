import 'reflect-metadata';
import { Container } from 'inversify';
import { IOcrService } from '../interfaces/services/IOcrService';
import { OcrController } from '../controllers/ocrController';
import { OcrService } from '../services/ocrService';
import { TYPES } from '../types/types';
import { IOcrController } from '../interfaces/controllers/IOcrController';


const container = new Container();

container.bind<IOcrService>(TYPES.OcrService).to(OcrService).inSingletonScope();
container.bind<IOcrController>(TYPES.OcrController).to(OcrController).inSingletonScope();

export default container;
