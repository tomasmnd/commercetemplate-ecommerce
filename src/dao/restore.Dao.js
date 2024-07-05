import restoreModel from "../model/restore.model.js";
import { v4 as uuidv4 } from "uuid";

export default class RestoreDao {
  static async createNewRestore(userId) {
    return restoreModel.findOneAndUpdate(
      { user: userId },
      { createdAt: Date.now(), hash: uuidv4() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  static async getRestoreByHash(hash) {
    return restoreModel.findOne({ hash }).lean();
  }
  static async deleteRestoreByHash(hash) {
    return restoreModel.deleteOne({ hash });
  }
}
