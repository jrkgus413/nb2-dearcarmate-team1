import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import imagesRouter from './routes/images.router';
import { notFoundHandler } from './handlers/not-found.handler';
import { globalErrorHandler } from './handlers/global-error.handler';

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// PRE MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTERS
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.use('/images', imagesRouter);

// POST MIDDLEWARES
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
