import { CustomError } from "../middleware/errorHandler.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPostController = async (req, res, next) => {
  const { userId, caption } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const newPost = new Post({
      user: userId,
      caption,
    });

    await newPost.save();
    user.posts.push(newPost._id);
    await user.save();
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    next(error);
  }
};

const generateFileUrl = (filename) => {
  return process.env.URL + `/uploads/${filename}`;
};

export const createPostWithImagesController = async (req, res, next) => {
  const { userId } = req.params;
  const { caption } = req.body;
  const files = req.files;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const imageUrls = files.map((file) => generateFileUrl(file.filename));
    const newPost = new Post({
      user: userId,
      caption,
      image: imageUrls,
    });

    await newPost.save();
    user.posts.push(newPost._id);
    await user.save();
    res
      .status(201)
      .json({ message: "Post created successfully!", post: newPost });
  } catch (error) {
    next(error);
  }
};

export const updatePostController = async (req, res, next) => {
  const { postId } = req.params;
  const { caption } = req.body;
  try {
    const postToUpdate = await Post.findById(postId);
    if (!postToUpdate) {
      throw new CustomError("Post not found!", 404);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { caption },
      { new: true }
    );

    await postToUpdate.save();

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    next(error);
  }
};

export const getPostController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const blockedUserIds = user.blocklist.map((id) => id.toString());
    const allPosts = await Post.find({
      user: { $nin: blockedUserIds },
    }).populate("user", "username fullname profilePicture");
    res.status(200).json({ post: allPosts });
  } catch (error) {
    next(error);
  }
};

export const getUserPostsController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const userPosts = await Post.find({ user: userId });
    res.status(200).json({ posts: userPosts });
  } catch (error) {
    next(error);
  }
};

export const deletePostController = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const postToDelete = await Post.findById(postId);
    if (!postToDelete) {
      throw new CustomError("Post not found!", 404);
    }
    const user = await User.findById(postToDelete.user);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }
    user.posts = user.posts.filter(
      (postId) => postId.toString() !== postToDelete._id.toString()
    );
    await user.save();
    await postToDelete.deleteOne();
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const likePostController = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new CustomError("Post not found!", 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }
    if (post.likes.includes(userId)) {
      throw new CustomError("You have already liked this post!", 404);
    }
    post.likes.push(userId);
    await post.save();
    res.status(200).json({ message: "Post liked successfully!", post });
  } catch (error) {
    next(error);
  }
};

export const dislikePostController = async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new CustomError("Post not found!", 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User not found!", 404);
    }
    if (!post.likes.includes(userId)) {
      throw new CustomError("You have not liked this post!", 404);
    }
    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();
    res.status(200).json({ message: "Post disliked successfully!", post });
  } catch (error) {
    next(error);
  }
};
