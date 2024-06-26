import jwt from "jsonwebtoken";
import { IUser } from "../types";
import { Response } from "express";

export const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const createSendToken = (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: (process.env.NODE_ENV === "production" ? "None" : "Lax") as
      | "lax"
      | "strict"
      | "none",
  };

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    message:
      statusCode === 200
        ? "Welcome to MernEats"
        : "Your account have been created successfully",
    token,
    data: {
      user,
    },
  });
};
