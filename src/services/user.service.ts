import { hash } from "bcrypt";
import * as UserRepository from '../repositories/user.repository';
import { BadRequestError, ConflictError, NotFoundError } from '../types/error.type';

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

const { userRepository } = UserRepository;

export const deleteMyAccount = async (userId: number) => {
  const existingUser = await userRepository.getUserById(userId);
  if (!existingUser) throw new NotFoundError('유저가 존재하지 않습니다.');

  await userRepository.softDeleteUser(userId);
};

// 내 정보 조회
export const getMyInfo = async (userId: bigint) => {
  const user = await UserRepository.getMyInfo(userId);

  return user;
}
