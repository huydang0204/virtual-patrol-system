import nodemailer from "nodemailer";
import {
  Email,
  Emails,
  ForgetPassword,
  BecomeUser
} from "@vps/utils/lib/dto/mails";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import { configuration } from "config";
import { logger } from "services/logger";

export const send = (emailOption : Email) : void => {
  if (!configuration.emailEnable) return;

  const {
    sendTo,
    subject,
    template,
    attachments
  } = emailOption;
  try {
    const transporter = nodemailer.createTransport({
      host : configuration.emailHost,
      port : configuration.emailPort,
      auth : {
        user : configuration.emailAddress,
        pass : configuration.emailPassword
      }
    });
    const mailOptions : MailOptions = {
      from : configuration.emailAddress,
      to : sendTo,
      subject : subject,
      html : template
    };
    if (attachments) {
      mailOptions.attachments = attachments;
    }
    transporter.sendMail(mailOptions, (error : Error) => {
      if (error) {
        logger.error("[services/mails] transporter.sendMail() failed: " + error.message);
      }
    });
  } catch (e) {
    logger.error("[services/mails] Sending email failed: " + e?.toString());
  }
};

export const sendMail = (emails : Emails) : void => {
  if (!configuration.emailEnable) return;

  const {
    sendTos,
    subject,
    template,
    attachments
  } = emails;
  sendTos.forEach((sendTo : string) => {
    const email : Email = {
      attachments,
      sendTo,
      subject,
      template
    };
    send(email);
  });
};

export const forgetPasswordTemplate = (param : ForgetPassword) : string => `<p>Hi ${ param.user.name },</p>
<p>We have received your password reset request.</p>
<p>Here’s the link to create a new password via this <a href="${ param.link }">link</a>.</p>
<p>If you did not request for a new password, you can safely ignore this email.</p><br/>
<p>Thank you,</p>
<p>VPS Platform</p>`;

export const becomeUserTemplate = (param : BecomeUser) : string => `<p>Hi ${ param.createdUserName },</p>
  <p>User ${ param.creatorName } has invited you to join VPS. The credential is attached below:</p>
  <p><strong>Email:</strong>${ " " + param.createdUserEmail }</p>
  <p><strong>Password:</strong>${ " " + param.createdUserPassword }</p>
  <p>You can login to VPS Platform via this <a href="${ configuration.feUrl + "/vps/user/login" }">link</a>.</p><br/>
  <p>Thank you,</p>
  <p>VPS Platform</p>`;
