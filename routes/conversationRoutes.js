import express from "express";
import {
  createNewConversationController,
  deleteConversationController,
  getConversationOfUserController,
  getTwoUsersConversationController,
} from "../controller/conversationController.js";
const router = express.Router();

// create new conversation
router.post("/create", createNewConversationController);

// get conversation of user
router.get("/:userId", getConversationOfUserController);

// find two user conersation
router.get("/:firstUserId/:secondUserId", getTwoUsersConversationController);

// delete a conversation
router.delete("/delete/:conversationId", deleteConversationController);
export default router;
