// ✅ 회원가입 요청
export type userRegisterRequest = {
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
  company: string;
  companyCode: string;
};

// ✅ 로그인 요청
export type loginRequest = {
  email: string;
  password: string;
};

// ✅ 로그인 응답
export type loginResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    employeeNumber: string;
    phoneNumber: string;
    imageUrl: string;
    isAdmin: boolean;
    company: {
      companyCode: string;
    };
  };
  accessToken: string;
  refreshToken: string;
};

// ✅ 내 정보 조회 응답
export type getMeResponse = {
  id: number;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  imageUrl: string;
  isAdmin: boolean;
  company: {
    companyCode: string;
  };
};

// ✅ 내 정보 수정 요청
export type updateMeRequest = {
  employeeNumber: string;
  phoneNumber: string;
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
  imageUrl: string;
};

// ✅ 내 정보 수정 응답
export type updateMeResponse = {
  id: number;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  imageUrl: string;
  isAdmin: boolean;
  company: {
    companyCode: string;
  };
};

// ✅ 회원 탈퇴 응답 / 유저 삭제 응답
export type deleteUserResponse = {
  message: string; // "유저 삭제 성공"
};
