import {
  Post,
  Route,
  Tags,
  Body,
  Security,
  Get,
  Path,
  Put,
  Delete,
  Query
} from "tsoa";

import {
  ForgetPasswordResponse,
  LoginRequest,
  LoginResponse,
  UserCreationBody,
  UserList,
  UserResponse,
  UserUpdateBody,
  VerifyEmailBody
} from "types/user";

import {
  BooleanResponse,
  CountResponse,
  SuccessResponse,
  exampleBoolean,
  exampleCount,
  exampleDate,
  exampleEmail,
  exampleUUID
} from "types/common";

@Route("user")
@Tags("User")
export default class UserController {

  //! auth

  @Post("/login")
  public async login(@Body() body : LoginRequest) : Promise<LoginResponse> {
    return {
      jwt : "string",
      user : {
        id : exampleUUID,
        name : "string",
        email : exampleEmail,
        role : "string",
        latestLogin : exampleDate,
        tokenExpiredAt : exampleDate,
        nxToken : "string",
        avatar : "string"
      }
    };
  }

  @Post("/logout")
  @Security("Authorization")
  public async logout() : Promise<SuccessResponse> {
    return { success : true };
  }

  //! common user apis

  @Get("/list")
  @Security("Authorization")
  public async listUser(): Promise<UserList> {
    return {
      data : [
        {
          id : exampleUUID,
          nxWitnessId : "string",
          avatar : "string",
          name : "string",
          email : exampleEmail,
          callingCode : "string",
          phoneNumber : "string",
          roleId : exampleUUID,
          status : "string",
          isVerified : exampleBoolean,
          blockingReason : "string",
          role : "string",
          latestLogin : exampleDate
        }
      ]
    };
  }

  @Get("/count")
  @Security("Authorization")
  public async countUser(): Promise<CountResponse> {
    return { count : exampleCount };
  }

  @Get("{id}")
  @Security("Authorization")
  public async getUserById(@Path() id: string): Promise<UserResponse> {
    return {
      id : exampleUUID,
      nxWitnessId : "string",
      avatar : "string",
      name : "string",
      email : exampleEmail,
      callingCode : "string",
      phoneNumber : "string",
      roleId : exampleUUID,
      status : "string",
      isVerified : exampleBoolean,
      blockingReason : "string",
      role : "string",
      latestLogin : exampleDate
    };
  }

  @Put()
  @Security("Authorization")
  public async SelfUpdateUser(@Body() requestUserBody: UserUpdateBody): Promise<UserResponse> {
    return {
      id : exampleUUID,
      nxWitnessId : "string",
      avatar : "string",
      name : "string",
      email : exampleEmail,
      callingCode : "string",
      phoneNumber : "string",
      roleId : exampleUUID,
      status : "string",
      isVerified : exampleBoolean,
      blockingReason : "string",
      role : "string",
      latestLogin : exampleDate
    };
  }

  @Post("/verify-email/{id}")
  @Security("Authorization")
  public async verifyEmailForUser(@Body() requestUserBody: VerifyEmailBody): Promise<UserResponse> {
    return {
      id : exampleUUID,
      nxWitnessId : "string",
      avatar : "string",
      name : "string",
      email : exampleEmail,
      callingCode : "string",
      phoneNumber : "string",
      roleId : exampleUUID,
      status : "string",
      isVerified : exampleBoolean,
      blockingReason : "string",
      role : "string",
      latestLogin : exampleDate
    };
  }
  //! password api

  @Post("/forget-password")
  @Security("Authorization")
  public async createForgetPassword(@Body() requestUserBody: UserCreationBody): Promise<BooleanResponse> {
    return { data : true };
  }

  @Get("/forget-password")
  @Security("Authorization")
  public async checkForgetPasswordKey(@Query() id: string): Promise<ForgetPasswordResponse> {
    return {
      id : exampleUUID,
      userId : exampleUUID,
      createdAt : exampleDate,
      user : {
        id : exampleUUID,
        nxWitnessId : "string",
        avatar : "string",
        name : "string",
        email : exampleEmail,
        callingCode : "string",
        phoneNumber : "string",
        roleId : exampleUUID,
        status : "string",
        isVerified : exampleBoolean,
        blockingReason : "string",
        role : "string",
        latestLogin : exampleDate
      }
    };
  }

  //! admin apis

  @Post()
  @Security("Authorization")
  public async createUser(@Body() requestUserBody: UserCreationBody): Promise<UserResponse> {
    return {
      id : exampleUUID,
      nxWitnessId : "string",
      avatar : "string",
      name : "string",
      email : exampleEmail,
      callingCode : "string",
      phoneNumber : "string",
      roleId : exampleUUID,
      status : "string",
      isVerified : exampleBoolean,
      blockingReason : "string",
      role : "string",
      latestLogin : exampleDate
    };
  }

  @Delete("{id}")
  @Security("Authorization")
  public async deleteUserById(@Path() id: string): Promise<UserResponse> {
    return {
      id : exampleUUID,
      nxWitnessId : "string",
      avatar : "string",
      name : "string",
      email : exampleEmail,
      callingCode : "string",
      phoneNumber : "string",
      roleId : exampleUUID,
      status : "string",
      isVerified : exampleBoolean,
      blockingReason : "string",
      role : "string",
      latestLogin : exampleDate
    };
  }

  @Put("{id}")
  @Security("Authorization")
  public async updateUserById(@Path() id: string, @Body() requestUserBody: UserUpdateBody): Promise<UserResponse> {
    return {
      id : exampleUUID,
      nxWitnessId : "string",
      avatar : "string",
      name : "string",
      email : exampleEmail,
      callingCode : "string",
      phoneNumber : "string",
      roleId : exampleUUID,
      status : "string",
      isVerified : exampleBoolean,
      blockingReason : "string",
      role : "string",
      latestLogin : exampleDate
    };
  }

  @Put("/block")
  @Security("Authorization")
  public async blockUser(@Query() id: string): Promise<UserResponse> {
    return {
      id : exampleUUID,
      nxWitnessId : "string",
      avatar : "string",
      name : "string",
      email : exampleEmail,
      callingCode : "string",
      phoneNumber : "string",
      roleId : exampleUUID,
      status : "string",
      isVerified : exampleBoolean,
      blockingReason : "string",
      role : "string",
      latestLogin : exampleDate
    };
  }

  @Put("/activate")
  @Security("Authorization")
  public async activateUser(@Query() id: string): Promise<UserResponse> {
    return {
      id : exampleUUID,
      nxWitnessId : "string",
      avatar : "string",
      name : "string",
      email : exampleEmail,
      callingCode : "string",
      phoneNumber : "string",
      roleId : exampleUUID,
      status : "string",
      isVerified : exampleBoolean,
      blockingReason : "string",
      role : "string",
      latestLogin : exampleDate
    };
  }

}
