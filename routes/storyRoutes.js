import express from "express";
import {
  createStoryController,
  deleteAllStoryController,
  deleteStoryController,
  getStoriesController,
  getUserStoriesController,
} from "../controller/storyController.js";
const router = express.Router();
import upload from "../middleware/upload.js";

// create story
router.post("/create/:userId", upload.single("image"), createStoryController);

// get all stories
router.get("/all/:userId", getStoriesController);

// get user stories
router.get("/user/:userId", getUserStoriesController);

// delete a story
router.delete("/delete/:storyId", deleteStoryController);

// delete all stories
router.delete("/delete/stories/:userId", deleteAllStoryController);
export default router;
