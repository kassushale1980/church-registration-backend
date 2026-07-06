import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kassushale@gmail.com",
      pass: "kgfw dhde zwgx fdga",
    },
  });

  await transporter.sendMail({
    from: "Sunday School <kesisdani07@gmail.com>",
    to,
    subject,
    text,
  });
};