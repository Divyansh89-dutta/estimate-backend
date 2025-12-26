import { mailTransporter } from "../config/mai.js";

export const sendMail = async (to, subject, text) => {
  await mailTransporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
};
