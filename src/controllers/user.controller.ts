import { RequestHandler } from 'express';
import * as userService from '../services/user.service';
import { NotFoundError } from '../types/error.type';
import { userRepository } from '../repositories/user.repository';

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