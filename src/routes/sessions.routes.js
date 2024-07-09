import { Router } from "express";
import {
  registerUser,
  confirmUserRegistration,
  initiatePasswordReset,
  validatePasswordResetLink,
  setNewPassword,
  logoutUser,
  loginUser,
  getCurrentUser,
  initiateGitHubAuth,
  handleGitHubAuthCallback,
  handleGitHubAuthSuccess,
  serializeUser,
  deserializeUser,
} from "../controller/sessions.controller.js";
import passport from "passport";

const router = Router();

router.post("/register", registerUser);
router.get("/confirm-register/:token", confirmUserRegistration);
router.post("/restore", initiatePasswordReset);
router.get("/reset/:hash", validatePasswordResetLink);
router.post("/new-password/:hash", setNewPassword);
router.get("/logout", logoutUser);
router.post("/login", passport.authenticate("login", { failureRedirect: "/" }), loginUser);
router.get("/current", getCurrentUser);
router.get("/github", initiateGitHubAuth);
router.get("/githubCallback", handleGitHubAuthCallback, handleGitHubAuthSuccess);

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

export default router;
