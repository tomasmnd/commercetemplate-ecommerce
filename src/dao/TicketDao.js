import TicketsModel from "../model/tickets.model.js";
export default class TicketsDao {

  static async createNewTicket(ticket) {
    try {
      return await TicketsModel.create(ticket);
    } catch (err) {
      console.error('Error creating new ticket:', err);
      throw err;
    }
  }

  static async getTicketByID(_id) {
    return MessageModel.findOne(_id).lean();
  }

}
