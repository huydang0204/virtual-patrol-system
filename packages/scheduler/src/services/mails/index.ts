import nodemailer from "nodemailer";
import { Email } from "./types";
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

export * from "./types";