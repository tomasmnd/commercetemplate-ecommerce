import MessagesDao from "../dao/messagesDao.js";
export default class MessagesRepository {
  static async createNewMessage(message) {
    return await MessagesDao.createNewMessage(message);
  }

  static async getAllMessages() {
    return await MessagesDao.getAllMessages();
  }
}
