import TicketsDao from "../dao/TicketDao.js";
export default class TicketsRepository {
  static async createNewTicket(ticket) {
    return await TicketsDao.createNewTicket(ticket);
  }

  static async getTicketByID(_id) {
    return await TicketsDao.getTicketByID(_id);
  }
}
