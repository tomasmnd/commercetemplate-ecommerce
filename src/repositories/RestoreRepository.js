import RestoreDao from "../dao/restore.Dao.js";

export default class RestoreRepository {
  static async createNewRestore(userId) {
    return RestoreDao.createNewRestore(userId);
  }
  static async getRestoreByHash(hash) {
    return RestoreDao.getRestoreByHash(hash);
  }
  static async deleteRestoreByHash(hash) {
    return RestoreDao.deleteRestoreByHash(hash);
  }
}
