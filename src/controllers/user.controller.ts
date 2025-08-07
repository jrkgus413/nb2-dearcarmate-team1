import { Request, Response } from 'express';
import { registerUser } from '../services/user.service';
import { BadRequestError } from '../types/error.type';
import * as userService from '../services/user.service'


export const register = async (req: Request, res: Response) => {
  const {
    name,
    email,
    phoneNumber,
    password,
    passwordConfirmation,
    companyName,
    companyCode,
    employeeNumber
  } = req.body;

  if (!name || !email || !phoneNumber || !password || !passwordConfirmation || !companyName || !companyCode || !employeeNumber) {
    throw new BadRequestError('필수 입력값이 누락되었습니다.');
  }

  if (password !== passwordConfirmation) {
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


//회원 탈퇴 (soft delete)
export const deleteMyAccount = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  await userService.deleteMyAccount(userId);
  return res
    .status(200)
    .json({ message: '정상적으로 회원 탈퇴되었습니다.' });
}