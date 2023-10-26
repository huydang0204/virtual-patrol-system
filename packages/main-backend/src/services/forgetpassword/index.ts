import { ServiceResponse } from "@vps/utils/lib/data";
import { ForgetPasswordRepository } from "repositories/user-repository";
import { ForgetPasswordResponse } from "@vps/utils/lib/dto/forget-password";
import { getForgetPasswordDto } from "./mapper";
import { UserError } from "@vps/utils/lib/dto/user";

const getForgetPassword = async (id : string) : Promise<ServiceResponse<ForgetPasswordResponse, UserError>> => {
  const result = await ForgetPasswordRepository.findOne({ where : { id } });
  if (!result) {
    return { error : UserError.ForgetPasswordNotFound };
  }
  return { data : getForgetPasswordDto(result) };
};

export { getForgetPassword };
