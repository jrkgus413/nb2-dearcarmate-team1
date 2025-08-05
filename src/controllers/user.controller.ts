import { Request, Response } from 'express';
import { registerUser } from '../services/user.service';
import { BadRequestError } from '../types/error.type';

export const register = async (req: Request, res: Response) => {
  const {
    name,
    email,
    phoneNumber,
    password,
    passwordConfirm,
    companyName,
    companyCode,
    employeeNumber
  } = req.body;

  if (!name || !email || !phoneNumber || !password || !passwordConfirm || !companyName || !companyCode || !employeeNumber) {
    throw new BadRequestError('필수 입력값이 누락되었습니다.');
  }

  if (password !== passwordConfirm) {
    throw new BadRequestError('비밀번호와 비밀번호 확인이 일치하지 않습니다');
  }

  const user = await registerUser({
    name,
    email,
    phoneNumber,
    password,
    company: companyName,
    companyCode,
    employeeNumber
  });

  res.status(201).json(user);
};