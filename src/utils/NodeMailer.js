import nodemailer from "nodemailer";
export default nodemailer.createTransport({
  service: "gmail",
  port: 587,

  auth: {
    user: process.env.NODEMAILER_HOST,
    pass: process.env.APPLICATION_KEY,
  },
});
