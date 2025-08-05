import { hash } from 'bcrypt';
import * as userRepository from '../repositories/user.repository';
import { BadRequestError, ConflictError } from '../types/error.type';

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

  const existingCompany = await userRepository.findCompanyByNameAndCode(company, companyCode);
  if (!existingCompany) {
    throw new BadRequestError('기업명과 인증코드가 일치하지 않습니다.');
  }

  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError('이미 존재하는 이메일입니다');
  }

  const duplicateEmp = await userRepository.findUserByEmployeeNumber(employeeNumber);
  if (duplicateEmp) {
    throw new ConflictError('이미 존재하는 사원번호입니다');
  }

  const hashedPassword = await hash(password, 10);

  const createdUser = await userRepository.createUser({
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