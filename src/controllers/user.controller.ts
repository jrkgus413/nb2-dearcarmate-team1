import { Request, Response } from 'express';
import { registerUser } from '../services/user.service';
import { BadRequestError } from '../types/error.type';
import { NotFoundError } from '../types/error.type';
import { userRepository } from '../repositories/user.repository';

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
export const deleteMyAccount = async (userId: number): Promise<void> => {
  // 1) (선택) 사용자 존재 여부 확인
  const existingUser = await userRepository.getUserById(userId);
  if (!existingUser) {
    throw new NotFoundError('유저가 존재하지 않습니다.');
  }

  // 2) soft delete 처리
  await userRepository.softDeleteUser(userId);
};