import { RequestHandler } from 'express';
import * as userService from '../services/user.service';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const {
      name,
      email,
      employeeNumber,
      phoneNumber,
      password,
      passwordConfirmation,
      companyCode,
      company
    } = req.body;

    const newUser = await userService.register({
      name,
      email,
      employeeNumber,
      phoneNumber,
      password,
      passwordConfirmation,
      companyCode,
      company
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};


