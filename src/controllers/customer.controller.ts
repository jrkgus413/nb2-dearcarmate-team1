import { Request, Response, NextFunction } from 'express'; // RequestHandler
import * as customerService from '../services/customer.service';
// import { BadRequestError, NotFoundError } from '../types/error.type';

const getCustomersList = async (
    req: Request<{}, {}, {}, Record<string, string>>, 
    res: Response, 
    next: NextFunction
) => {
    try{
        const customersListObj = await customerService.getCustomersList(req.query);

        res.status(200).json(customersListObj);
    } catch(err){
        next(err);
    }
};

// const getCustomerById: RequestHandler = async (req, res, next) => {
//     try{
//     } catch(err){
//         next(err);
//     }
// };

// const createCustomer: RequestHandler = async (req, res, next) => {
//     try{

//         const data = req.body;
//         const createdCustomerObj = await customerService.createCustomer(data);

//         res.status(201).json(createdCustomerObj);
//     } catch(err){
//         next(err);
//     }
// };

// const removeCustomer: RequestHandler = async (req, res, next) => {
//     try{
//     } catch(err){
//         next(err);
//     }
// };

export {
    getCustomersList,
    // getCustomerById,
    // createCustomer,
    // removeCustomer
}