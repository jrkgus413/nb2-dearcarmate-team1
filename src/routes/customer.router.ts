import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';

const customerRouter = Router();

customerRouter.get(
    '/',
    customerController.getCustomersList
);

customerRouter.post(
    '/',
    customerController.createCustomer
);

export default customerRouter;