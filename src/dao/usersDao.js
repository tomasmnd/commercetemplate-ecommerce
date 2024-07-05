import usersModel from "../model/users.model.js";
import PasswordManagement from "../utils/passwordManagement.js";

/**
 * UsersDao class for managing user-related operations
 */
export default class UsersDao {
  /**
   * Register a new user
   * @param {string} first_name - User's first name
   * @param {string} last_name - User's last name
   * @param {string} email - User's email
   * @param {number} age - User's age
   * @param {string} password - User's password
   * @param {string} confirmationToken - User's confirmation token
   * @returns {Promise<Object>} - The created user object
   */
  static async register(first_name, last_name, email, age, password, confirmationToken) {
    const existingUser = await usersModel.findOne({ email });
    console.log('USERS DAO - Existing user:', existingUser);
    if (existingUser) {
      console.log('USERS DAO - Email already exists, not creating user');
      return null;
    }

    console.log('USERS DAO - Creating new user...');
    password = PasswordManagement.hashPassword(password);
    const newUser = await usersModel.create({ first_name, last_name, email, age, password, confirmationToken });
    console.log('New user created:', newUser);
    return newUser;
  }

  /**
   * Get a user by email
   * @param {string} email - User's email
   * @returns {Promise<Object>} - The user object
   */
  static async getUserByEmail(email) {
    return usersModel.findOne({ email }).lean();
  }

  /**
   * Get a user by ID
   * @param {string} _id - User's ID
   * @returns {Promise<Object>} - The user object with limited fields
   */
  static async getUserByID(userId) {
    return usersModel.findById(userId).populate('cart').lean();
  }
  /**
   * Get a user's role by ID
   * @param {string} _id - User's ID
   * @returns {Promise<Object>} - The user object with the role field
   */
  static async getRoleByID(_id) {
    return usersModel.findOne({ _id }, { role: 1 }).lean();
  }

  /**
   * Get user data
   * @param {string} _id - User's ID
   * @returns {Promise<Object>} - The user object
   */
  static async getUserData(_id) {
    return usersModel.findById(_id).lean()
  }

  /**
   * Get all users
   * @returns {Promise<Array>} - Array of user objects
   */
  static async getAllUsers() {
    return usersModel.find({}).lean()
  }

  /**
   * Restore a user's password with email
   * @param {string} email - User's email
   * @param {string} password - New password
   * @returns {Promise<Object>} - The updated user object
   */
  static async restorePasswordWithEmail(email, password) {
    const user = await usersModel.findOne({ email }).lean();
    user.password = PasswordManagement.hashPassword(password);
    return usersModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
  }

  /**
   * Restore a user's password with ID
   * @param {string} _id - User's ID
   * @param {string} password - New password
   * @returns {Promise<Object>} - The updated user object
   */
  static async restorePasswordWithID(_id, password) {
    const user = await usersModel.findOne({ _id }).lean();
    user.password = PasswordManagement.hashPassword(password);
    return usersModel.findByIdAndUpdate(user._id, user, {
      new: true,
    });
  }

  /**
   * Validate a new password for a user
   * @param {string} _id - User's ID
   * @param {string} password - New password
   * @returns {boolean} - True if the new password is different from the current password
   */
  static async validateNewPassword(_id, password) {
    const user = await usersModel.findOne({ _id }).lean();

    const result = !PasswordManagement.validatePassword(
      password,
      user.password
    );

    return result;
  }

  /**
   * Get a user's ID by email
   * @param {string} email - User's email
   * @returns {Promise<Object>} - The user object with the ID field
   */
  static async getusersIdByEmail(email) {
    return usersModel.findOne({ email }, { _id: 1 }).lean();
  }

  /**
   * Update a user's role
   * @param {string} userId - User's ID
   * @param {string} role - New role
   * @returns {Promise<Object>} - The updated user object
   */
  static async updateUserRole(userId, role) {
    return usersModel.findByIdAndUpdate(userId, { role }, { new: true });
  }

  /**
   * Get a user's cart ID
   * @param {string} userId - User's ID
   * @returns {Promise<Object>} - The user object with the cart ID field
   */
  static async getUserCartId(userId) {
    return usersModel.findOne({ _id: userId }, { cart: 1 }).lean();
  }


  /**
   * Update a user's cart
   * @param {string} userId - User's ID
   * @param {Object} cart - New cart object
   * @returns {Promise<Object>} - The updated user object
   */
  static async updateUserCart(userId, cartId) {
    return usersModel.findByIdAndUpdate(userId, { cart: cartId }, { new: true }).lean();
  }

  /**
   * Checks if user's email exist.
   * @param {string} email - User's email
   * @returns 
   */
  static async emailExists(email) {
    try {
      const user = await usersModel.findOne({ email }).lean();
      if (user) {
        console.log("USERS DAO - Usuario encontrado.");
        return !!user;
      }
    } catch(error) {
      throw new Error(error);
    }
    return false;
  }
  
  static async saveToken(userId, token) {
    try {
      const user = await usersModel.findByIdAndUpdate(userId, { token: token }, { new: true });
      return user;
    } catch(error) {
      throw new Error("Error saving token");
    }
  }

  /**
 * Get a user by token
 * @param {string} token - User's token
 * @returns {Promise<Object>} - The user object
 */
  static async getUserByToken(token) {
    console.log("USERS DAO - getUserByToken");
    return usersModel.findOne({ token }).lean();
  }

  /**
 * Update a user's confirmed status
 * @param {string} _id - User's ID
 * @param {boolean} confirmed - New confirmed status
 * @returns {Promise<Object>} - The updated user object
 */
  static async updateConfirmedStatus(_id, confirmed) {
  return usersModel.findByIdAndUpdate(_id, { confirmed }, { new: true });
  }

  static async updateConfirmedStatus(_id, confirmed) {
    return usersModel.findOneAndUpdate({ _id }, { confirmed }, { new: true });
  }

  static async confirmUserRegistration(_id) {
    return usersModel.findOneAndUpdate(
      { _id },
      { $unset: { confirmationToken: 1 } },
      { new: true }
    );
  }  
  
  static async findUserByToken(token) {
    return usersModel.findOne({ confirmationToken: token }).lean();
  }
  
  /**
   * Get a user's email
   * @param {string} _id - User's ID
   * @returns {Promise<string>} - The user's email
   */
  static async getUserMail(_id) {
    const user = await usersModel.findById(_id, 'email')
    return user.email
  }

  /**
   * Delete a user by ID
   * @param {string} _id - User's ID
   * @returns {Promise<Object>} - The deleted user object
   */
  static async findByIdAndDelete(_id) {
    return usersModel.findByIdAndDelete(_id)
  }

  /**
   * Change a user's role
   * @param {string} _id - User's ID
   * @param {string} role - New role
   * @returns {Promise<Object>} - The updated user object
   */
  static async changeUserRole(_id, role) {
    return usersModel.findByIdAndUpdate(_id, { role }, { new: true })
  }

}