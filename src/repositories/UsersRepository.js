import UsersDao from "../dao/usersDao.js";
import UserDTO from "../dto/users.dto.js";

export default class UsersRepository {
  static async register(first_name, last_name, email, age, password, confirmationToken) {
    const existingUser = await UsersDao.getUserByEmail(email);
    if(existingUser) {
      return null
    }
    return await UsersDao.register(first_name, last_name, email, age, password, confirmationToken);
  }
  static async getUserByEmail(email) {
    const user = await UsersDao.getUserByEmail(email);
    return UserDTO.getUser(user);
  }
  static async getUserByID(_id) {
    const user = await UsersDao.getUserByID(_id);
    if (user) {
      return UserDTO.getUser(user);
    } else {
      return null;
    }
  }
  static async restorePasswordWithEmail(email, password) {
    return await UsersDao.restorePasswordWithEmail(email, password);
  }
  static async getRoleByID(_id) {
    return UsersDao.getRoleByID(_id);
  }
  static async getusersIdByEmail(email) {
    return UsersDao.getusersIdByEmail(email);
  }
  static async validateNewPassword(_id, password) {
    return await UsersDao.validateNewPassword(_id, password);
  }
  static async restorePasswordWithID(_id, password) {
    return await UsersDao.restorePasswordWithID(_id, password);
  }

  static async updateUserRole(userId, role) {
    return await UsersDao.updateUserRole(userId, role);
  }
}
