import { CustomError } from "../middleware/errorHandler.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const createNewConversationController = async (req, res, next) => {
  try {
    let newConversation;
    if (req.body.firstUser !== req.body.secondUser) {
      newConversation = new Conversation({
        participants: [req.body.firstUser, req.body.secondUser],
      });

      const savedConversation = await newConversation.save();
      res.status(201).json(savedConversation);
    } else {
      throw new CustomError("Sender and receiver can not be  same", 400);
    }
  } catch (error) {
    console.error("Error creating conversation:", error);
    next(error);
  }
};

export const getConversationOfUserController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const conversations = await Conversation.find({
      participants: { $in: [req.params.userId] },
    });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

export const getTwoUsersConversationController = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};

export const deleteConversationController = async (req, res, next) => {
  const conversationId = req.params.conversationId;
  try {
    await Conversation.deleteOne({ _id: conversationId });
    await Message.deleteMany({ conversationId: conversationId });

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    next(error);
  }
};
