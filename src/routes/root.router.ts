import express from 'express';
import { handleGetHealthCheck } from '../controllers/root.controller';

const root = express.Router();

root.get('/', handleGetHealthCheck);

export default root;
