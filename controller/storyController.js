import { CustomError } from "../middleware/errorHandler.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Story from "../models/Story.js";
import dotenv from "dotenv";
dotenv.config();

export const createStoryController = async (req, res, next) => {
  const { userId } = req.params;
  const { text } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    let image = "";
    if (req.file) {
      image = process.env.URL + `/uploads/${req.file.filename}`;
    }

    const newStory = new Story({
      user: userId,
      image,
      text,
    });
    await newStory.save();
    res.status(200).json(newStory);
  } catch (error) {
    next(error);
  }
};

export const getStoriesController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const followingUsers = user.following;
    const stories = await Story.find({
      user: { $in: followingUsers },
    }).populate("user", "fullname username profilePicture");

    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
};

export const getUserStoriesController = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    const stories = await Story.find({
      user: userId,
    }).populate("user", "fullname username profilePicture");

    res.status(200).json(stories);
  } catch (error) {
    next(error);
  }
};

export const deleteStoryController = async (req, res, next) => {
  const storyId = req.params.storyId;
  try {
    await Story.findByIdAndDelete(storyId);
    res.status(200).json({ message: "story has been deleted!" });
  } catch (error) {
    next(error);
  }
};

export const deleteAllStoryController = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    await Story.deleteMany({ user: userId });
    res.status(200).json({ message: "stories has been deleted!" });
  } catch (error) {
    next(error);
  }
};
