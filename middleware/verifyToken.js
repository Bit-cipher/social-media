import jwt from "jsonwebtoken";
import { CustomError } from "./errorHandler.js";

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    throw new CustomError("You are not authenticated", 401);
  }

  jwt.verify(token, process.env.SECRET_STR, async (err, data) => {
    if (err) {
      throw new CustomError("Token is not valid", 403);
    }
    req.userId = data._id;
    next();
  });
};

export default verifyToken;
