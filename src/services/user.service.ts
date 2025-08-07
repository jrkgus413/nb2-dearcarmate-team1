import { hash } from "bcrypt";
import * as UserRepository from '../repositories/user.repository';
import { BadRequestError, ConflictError, NotFoundError } from '../types/error.type';
import { comparePassword } from "../utils/password.util";
import { UserUpdateRequest } from "../types/user.type";

interface RegisterUserParams {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  company: string;
  companyCode: string;
  employeeNumber: string;
}

export const registerUser = async (data: RegisterUserParams) => {
  const {
    name,
    email,
    phoneNumber,
    password,
    company,
    companyCode,
    employeeNumber
  } = data;

  const existingCompany = await UserRepository.findCompanyByNameAndCode(company, companyCode);

  if (!existingCompany) {
    throw new BadRequestError('기업명과 인증코드가 일치하지 않습니다.');
  }

  const existingUser = await UserRepository.findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError('이미 존재하는 이메일입니다');
  }

  const duplicateEmp = await UserRepository.findUserByEmployeeNumber(employeeNumber);
  if (duplicateEmp) {
    throw new ConflictError('이미 존재하는 사원번호입니다');
  }

  const hashedPassword = await hash(password, 10);

  const createdUser = await UserRepository.createUser({
    name,
    email,
    phoneNumber,
    password: hashedPassword,
    company,
    companyCode,
    employeeNumber,
    companyId: existingCompany.id
  });

  return {
    id: Number(createdUser.id),
    name: createdUser.name,
    email: createdUser.email,
    employeeNumber: createdUser.employeeNumber,
    phoneNumber: createdUser.phoneNumber,
    imageUrl: createdUser.image_url,
    isAdmin: createdUser.isAdmin,
    company: {
      companyCode: createdUser.companyCode
    }
  };
};

//회원 탈퇴 
const { userRepository } = UserRepository;

export const deleteMyAccount = async (userId: number) => {
  const existingUser = await userRepository.getUserById(userId);
  if (!existingUser) throw new NotFoundError('유저가 존재하지 않습니다.');

  await userRepository.softDeleteUser(userId);
};

// 내 정보 조회
export const getMyInfo = async (userId: bigint) => {
  const user = await UserRepository.getMyInfo(userId);
  if (!user) {
    throw new NotFoundError('사용자 정보를 찾을 수 없습니다.');
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    employeeNumber: user.employeeNumber,
    phoneNumber: user.phoneNumber,
    imageUrl: user.image_url,
    isAdmin: user.isAdmin,
    company: {
      companyCode: user.affiliatedCompany.companyCode
    },
  };
}

// 내 정보 수정
export const updateMyInfo = async (userId: bigint, data: UserUpdateRequest) => {
  const user = await UserRepository.getMyInfo(userId);
  if (!user) {
    throw new NotFoundError('사용자 정보를 찾을 수 없습니다.');
  }

  // 현재 비밀번호 확인
  const isMatch = await comparePassword(data.currentPassword, user.password);
  if (!isMatch) {
    throw new BadRequestError('현재 비밀번호가 일치하지 않습니다.');
  }

  // 비밀번호 변경
  if (data.password && data.password !== data.passwordConfirmation) {
    throw new BadRequestError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
  }

  // 사원번호 중복 확인
  if (data.employeeNumber) {
    const existingUser = await UserRepository.findUserByEmployeeNumber(data.employeeNumber);
    if (existingUser && existingUser.companyCode !== user.companyCode && existingUser.id !== userId) {
      throw new ConflictError('이미 존재하는 사원번호입니다.');
    }
  }

  const updatedUser = await UserRepository.updateMyInfo(userId, data);

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    employeeNumber: updatedUser.employeeNumber,
    phoneNumber: updatedUser.phoneNumber,
    imageUrl: updatedUser.image_url,
    isAdmin: updatedUser.isAdmin,
    company: {
      companyCode: updatedUser.affiliatedCompany.companyCode
    },
  };
}
