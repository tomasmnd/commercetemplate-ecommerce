import { Router } from "express";
import { MessagesServices } from "../repositories/Repositories.js";
import io from "../../app.js";
import { onlyUsersAccess } from "../middlewares/permissions.js";
import { InsufficientDataError } from "../utils/CustomErrors.js";
const router = Router();

router.post("/messages", onlyUsersAccess, async (req, res) => {
  try {
    const { body } = req;
    if (!body) throw new InsufficientDataError("message", ["message"]);
    await MessagesServices.createNewMessage(body);
    const allMesagges = await MessagesServices.getAllMessages();
    io.emit("messages", allMesagges);
  } catch (error) {
    if (error instanceof InsufficientDataError) {
      res.status(error.getErrorData).send(error.getErrorData());
    } else {
      res.status(500).send(error.message);
    }
  }
});

export default router;
