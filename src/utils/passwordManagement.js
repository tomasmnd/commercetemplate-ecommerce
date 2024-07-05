import bcrypt from "bcrypt";

export default class PasswordManagement {
  static hashPassword(password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    return hashedPassword;
  }
  static validatePassword(password, hashedPassword) {
    const validate = bcrypt.compareSync(password, hashedPassword);
    return validate;
  }
}
