import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository';
import { getCompanyByCode } from '../repositories/company.repository';
import { NotFoundError } from '../types/error.type';

export const register = async ({
  name,
  email,
  employeeNumber,
  phoneNumber,
  password,
  passwordConfirmation,
  company,
  companyCode }: {
    name: string;
    email: string;
    employeeNumber: string;
    phoneNumber: string;
    password: string;
    passwordConfirmation: string;
    company: string;
    companyCode: string;
  }) => {
  if (password !== passwordConfirmation) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) throw new Error('이미 존재하는 이메일입니다.');

  const companyByCode = await getCompanyByCode(companyCode);
  if (!companyByCode) throw new Error('회사 코드가 유효하지 않습니다.');

  const hashedPassword = await bcrypt.hash(password, 10);

  return await userRepository.create({
    name,
    email,
    employeeNumber,
    phoneNumber,
    password: hashedPassword,
    passwordConfirmation,
    company,
    companyCode,
  });
};

//회원 탈퇴 서비스 
export const deleteMyAccount = async (userId: number) => {
  const existingUser = await userRepository.getUserById(userId);
  if (!existingUser) throw new NotFoundError('유저가 존재하지 않습니다.');

  await userRepository.softDeleteUser(userId);
};
