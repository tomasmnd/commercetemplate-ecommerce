import MessageModel from "../model/chats.model.js";
export default class MessagesDao {
  static async createNewMessage(message) {
    return MessageModel.create(message);
  }

  static async getAllMessages() {
    return MessageModel.find().lean();
  }
}
