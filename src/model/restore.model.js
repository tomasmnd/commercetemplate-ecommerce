import mongoose from "mongoose";
const restoreSchema = mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, required: true },
  hash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const usersModel = mongoose.model("restore", restoreSchema);
export default usersModel;
