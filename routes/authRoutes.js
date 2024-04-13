import express from "express";
import {
  currentUser,
  authenticateJWT,
  login,
  logout,
  signUp,
} from "../controller/authController.js";

const router = express.Router();

router.post("/register", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refetch", authenticateJWT, currentUser);

export default router;
