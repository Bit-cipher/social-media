import { CustomError } from "../middleware/errorHandler.js";
import Message from "../models/Message.js";

export const createMessageController = async (req, res, next) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessagesController = async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const deleteMessageController = async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.messageId);
    res.status(200).json({ message: "Message deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
