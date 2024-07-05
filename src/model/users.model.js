import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    enum: ["ADMIN", "USER", "premium"], // Corregir el enum.
    default: "USER",
  },
  documents: [
    {
      name: { type: String, required: true },
      reference: { type: String, required: true },
    },
  ],
  profileImage: { type: String },
  last_connection: { type: Date, default: Date.now },
  confirmationToken: { type: String },
  confirmed: { type: Boolean, default: false }
});

const usersModel = mongoose.model("users", usersSchema);
export default usersModel;
