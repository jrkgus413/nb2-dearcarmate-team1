import ENV from './utils/env.util';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import rootRouter from './routes/root.router';
import imagesRouter from './routes/images.router';
import carRouter from './routes/car.router';
import customerRouter from './routes/customer.router';
import companiesRouter from './routes/company.router';
import dashboardRouter from './routes/dashboard.router';
import contractDocumentRouter from './routes/contract-document.router';
import userRouter from './routes/user.router';
import authRouter from './routes/auth.router';
import contractsRouter from './routes/contracts.router';

import { notFoundHandler } from './handlers/not-found.handler';
import { globalErrorHandler } from './handlers/global-error.handler';
import { bigintSerialization } from './middlewares/bigint-serialization.middleware';
import { listenHandler } from './handlers/listen.handler';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express();
const port: number = Number(ENV.PORT) || 3000;
const swaggerSpec: any = YAML.load(path.join(__dirname, './swagger/swagger.yaml'));

// PRE MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bigintSerialization);

// ROUTERS
app.use('/', rootRouter);
app.use('/images', imagesRouter);
app.use('/cars', carRouter);
app.use('/customers', customerRouter);
app.use('/companies', companiesRouter);
app.use('/dashboard', dashboardRouter);
app.use('/contractDocuments', contractDocumentRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/contracts', contractsRouter);

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// POST MIDDLEWARES
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(port, listenHandler);
