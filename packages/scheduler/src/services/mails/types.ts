import { Attachment } from "nodemailer/lib/mailer";

import { UserAuth } from "@vps/utils/lib/data";
import {
  Role, User
} from "entities";

export interface UserResponse {
  id: string;
  nxWitnessId: string;
  avatar: string;
  name: string;
  email: string;
  callingCode: string;
  phoneNumber: string;
  roleId: string;
  latestLogin: Date;
  latestChangePassword: Date;
  status: string;
  isVerified: boolean;
  blockingReason: string;
  blockedAt: Date;
  reactivatedAt: Date;
  role: Role;
}

export interface Email {
  sendTo : string;
  subject : string;
  template : string;
  attachments? : Attachment[];
}

export interface Emails {
  sendTos : string[];
  subject : string;
  template : string;
  attachments? : Attachment[];
}

export interface ForgetPassword {
  user : User;
  link : string;
}

export interface BecomeUser {
  guest : UserResponse;
  inviter : UserAuth;
  link : string;
}
