import { Request } from 'express';
import { getUserByEmail } from '../repositories/auth.repository';
import { NotFoundError } from '../types/error.type';
import { comparePassword } from '../utils/password.util';
import { Payload } from '../types/payload.type';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.util';

export const login = async (req: Request) => {
  const { body } = req;
  const { email, password } = body;

  const user = await getUserByEmail(email);
  if (user === null) {
    throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
  }

  const formattedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    employeeNumber: user.employeeNumber,
    phoneNumber: user.phoneNumber,
    imageUrl: user.image_url,
    isAdmin: user.isAdmin,
    company: {
      companyCode: user.affiliatedCompany.companyCode,
    },
  };

  const payload: Payload = {
    id: String(user.id),
    companyId: String(user.companyId),
    isAdmin: user.isAdmin,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    user: formattedUser,
    accessToken,
    refreshToken,
  };
};

export const refresh = async (req: Request) => {
  const { body } = req;
  const { refreshToken } = body;

  const payload = verifyRefreshToken(refreshToken);

  const accessTokenNew = generateAccessToken(payload);
  const refreshTokenNew = generateRefreshToken(payload);

  return {
    accessToken: accessTokenNew,
    refreshToken: refreshTokenNew,
  };
};
