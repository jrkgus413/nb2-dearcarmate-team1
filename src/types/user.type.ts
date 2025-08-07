// 유저 수정 요청
export type UserUpdateRequest = {
	employeeNumber: string,
	phoneNumber: string,
	currentPassword: string,
	password: string,
	passwordConfirmation: string,
	imageUrl: string
}

// 유저 응답
export type UserResponse = {
  id: bigint;
  name: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  image_url: string;
  isAdmin: boolean;
  company: {
    companyCode: string;
  };
};