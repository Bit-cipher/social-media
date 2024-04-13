// import express from "express";
// const router = express.Router();
import dotenv from "dotenv";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomError } from "../middleware/errorHandler.js";
dotenv.config();

// REGISTER
export const authenticateJWT = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    throw new CustomError("Unauthorized: Missing JWT");
  }

  jwt.verify(token, process.env.SECRET_STR, {}, async (err, data) => {
    console.log(data);
    req.user = data;
    next();
    if (err) {
      throw new CustomError(err, 404);
    }
  });
};

export const signUp = async (req, res, next) => {
  try {
    const { password, username, email } = req.body;
    // console.log(req.body);
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new CustomError("Username or email exists!");
    }

    // const salt = await bcrypt.salt(10);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(200).json({
      status: "success",
      data: {
        savedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    let user;
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    } else {
      user = await User.findOne({ username: req.body.username });
    }

    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      throw new CustomError("Invalid credentials", 401);
    }

    const { password, ...data } = user._doc;
    const token = jwt.sign({ id: user._id }, process.env.SECRET_STR, {
      expiresIn: process.env.LOGIN_EXPIRES,
    });
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(data);
  } catch (error) {
    next(error);
  }
};

// LOGOUT
export const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token", { sameSite: "none", secure: true })
      .status(200)
      .json("User logged out successfully");
  } catch (error) {
    next(error);
  }
};

// FETCH CURRENT USER
export const currentUser = async (req, res, next) => {
  try {
    const userId = req.user.id; // Access user ID from req.user
    const user = await User.findOne({ _id: userId }); // Query the database to find the user
    if (!user) {
      throw new CustomError("User not found");
    }
    res.status(200).json({ message: "current user", user }); // Return the user details
  } catch (error) {
    next(error);
  }
};
