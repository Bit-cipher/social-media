import express from "express";
import {
  createMessageController,
  deleteMessageController,
  getMessagesController,
} from "../controller/messageController.js";
const router = express.Router();

// create a message
router.post("/create", createMessageController);

// get messages
router.get("/:conversationId", getMessagesController);

// delete messages
router.delete("/delete/:messageId", deleteMessageController);

export default router;
