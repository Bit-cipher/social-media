import express from "express";
const router = express.Router();
import upload from "../middleware/upload.js";
import {
  createPostController,
  createPostWithImagesController,
  deletePostController,
  dislikePostController,
  getPostController,
  getUserPostsController,
  likePostController,
  updatePostController,
} from "../controller/postController.js";

router.post("/create", createPostController);
router.post(
  "/create/:userId",
  upload.array("images", 5),
  createPostWithImagesController
);

router.put("/update/:postId", updatePostController);

// get all posts
router.get("/all/:userId", getPostController);

// get user posts
router.get("/user/:userId", getUserPostsController);

// delete post
router.delete("/delete/:postId", deletePostController);

// like post
router.post("/like/:postId", likePostController);

// dislike post
router.post("/dislike/:postId", dislikePostController);
export default router;
