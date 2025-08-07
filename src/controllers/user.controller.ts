import { Request, Response } from 'express';
import { registerUser } from '../services/user.service';
import { BadRequestError, NotFoundError } from '../types/error.type';
import * as UserService from '../services/user.service'
import { getUser } from '../utils/user.util';


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
  const { id } = getUser(req);
  const userId = Number(id);

  await UserService.deleteMyAccount(userId);
  return res
    .status(200)
    .json({ message: '정상적으로 회원 탈퇴되었습니다.' });
}

// 내 정보 조회
export const getMyInfo = async (req: Request, res: Response) => {
  const { id } = getUser(req);
  const userId = BigInt(id);

  const userInfo = await UserService.getMyInfo(userId);
  if (!userInfo) {
    throw new NotFoundError('사용자 정보를 찾을 수 없습니다.');
  }

  res.status(200).json(userInfo);
};

