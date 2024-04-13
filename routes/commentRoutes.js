import express from "express";
import {
  createCommentController,
  createCommentReplyController,
  deleteCommentController,
  deleteReplyCommentController,
  dislikeCommentController,
  dislikeReplyCommentController,
  getCommentsByPostController,
  likeCommentController,
  likeReplyCommentController,
  updateCommentController,
  updatecommentReplyController,
} from "../controller/commentController.js";
const router = express.Router();

// create comment route
router.post("/create", createCommentController);

// create comment reply
router.post("/create/reply/:commentId", createCommentReplyController);

// update Comment
router.put("/update/:commentId", updateCommentController);

// update coment reply
router.put("/update/:commentId/replies/:replyId", updatecommentReplyController);

//get all posts comment
router.get("/post/:postId", getCommentsByPostController);

// delete a comment
router.delete("/delete/:commentId", deleteCommentController);

//  delete a reply comment
router.delete(
  "/delete/:commentId/replies/:replyId",
  deleteReplyCommentController
);

// like a comment
router.post("/like/:commentId", likeCommentController);

// dislike a comment
router.post("/dislike/:commentId", dislikeCommentController);

// like a reply comment
router.post("/:commentId/replies/like/:replyId", likeReplyCommentController);

// dislike a reply comment
router.post(
  "/:commentId/replies/dislike/:replyId",
  dislikeReplyCommentController
);

export default router;
