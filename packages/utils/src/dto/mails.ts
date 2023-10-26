import { Attachment } from "nodemailer/lib/mailer";

import { User } from "../entities";

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
  createdUserName : string,
  createdUserEmail : string,
  createdUserPassword : string
  creatorName : string
}
