import { Router } from "express";
import Logger from "../utils/Logger.js";
const router = Router();

router.get("/loggerTest/:errorType", async (req, res) => {
  try {
    const errorType = req.params.errorType;
    switch (errorType) {
      case "fatal":
        Logger.fatal("fatal");
        break;
      case "error":
        Logger.error("error");
        break;
      case "warning":
        Logger.warning("warning");
        break;
      case "info":
        Logger.info("info");
        break;
      case "http":
        Logger.http("http");
        break;
      case "debug":
        Logger.debug("debug");
        break;
    }
    res.send(`ERROR TYPE: ${errorType} RECIVED`);
  } catch (error) {
    Logger.error(error);
  }
});

export default router;
