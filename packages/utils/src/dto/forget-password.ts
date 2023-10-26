import { UserResponse } from "../dto/user";

export interface ForgetPasswordResponse {
  id : string;
  userId : string;
  createdAt : string;
  user : UserResponse;
}

