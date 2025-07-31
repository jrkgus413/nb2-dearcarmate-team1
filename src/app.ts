import ENV from './utils/env.util';
import express from 'express';
import cookieParser from 'cookie-parser';

import rootRouter from './routes/root.router';
import imagesRouter from './routes/images.router';
import carRouter from './routes/car.router';
import customerRouter from './routes/customer.router';
import companiesRouter from './routes/company.router';
import dashboardRouter from './routes/dashboard.router';

import { notFoundHandler } from './handlers/not-found.handler';
import { globalErrorHandler } from './handlers/global-error.handler';

const app = express();
const port: number = Number(ENV.PORT) || 3000;

// PRE MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTERS
app.get('/', rootRouter);
app.use('/images', imagesRouter);
app.use('/cars', carRouter);
app.use('/customers', customerRouter);
app.use('/companies', companiesRouter);
app.use('/dashboard', dashboardRouter);

// POST MIDDLEWARES
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
