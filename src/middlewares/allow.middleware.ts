import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../types/error.type';
import { setUser } from '../utils/user.util';
import { USER_ROLE } from '../enums/user.enum';
import { getAccessToken, verifyAccessToken } from '../utils/token.util';

export const allow = (roles: USER_ROLE[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    // NONE
    if (roles.includes(USER_ROLE.NONE)) {
      return next();
    }

    const accessToken = getAccessToken(req);

    // PUBLIC
    // 토큰이 없어도 되는 API 에 사용합니다.
    // 예: 회원가입
    if (accessToken === undefined) {
      if (roles.includes(USER_ROLE.PUBLIC)) {
        return next();
      }
      throw new UnauthorizedError();
    }

    const payload = verifyAccessToken(accessToken);

    setUser(req, payload);
    
    const isAdmin = payload.isAdmin;

    // USER
    // 사용자만 사용하는 API 를 처리합니다.
    // 관리자는 모든 기능을 사용할 수 있겠다 싶어서 || 로 처리했습니다.
    if (roles.includes(USER_ROLE.USER) || isAdmin) {
      return next();
    }

    // ADMIN
    // 관리자만 사용할 수 있는 API 를 처리합니다.
    if (roles.includes(USER_ROLE.ADMIN) && isAdmin) {
      return next();
    }

    throw new ForbiddenError();
  };
};
