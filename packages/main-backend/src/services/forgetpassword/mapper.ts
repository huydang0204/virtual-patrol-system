import { ForgetPassword } from "entities";
import { ForgetPasswordResponse } from "@vps/utils/lib/dto/forget-password";
import { getUserDto } from "services/user/mapper";

export const getForgetPasswordDto = (forgetPassword: ForgetPassword): ForgetPasswordResponse => {
  if (!forgetPassword) return null;

  const {
    id,
    userId,
    createdAt,
    user
  } = forgetPassword;

  return {
    id,
    userId,
    createdAt : createdAt.toISOString(),
    user : getUserDto(user)
  };
};
