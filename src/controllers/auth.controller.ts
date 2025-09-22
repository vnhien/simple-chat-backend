import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user/user.model";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, clientId } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Generate unique userId
    const userId = uuidv4();

    // Create new user
    const newUser: IUser = new User({
      username,
      password,
      userId,
      createdAt: Date.now(),
    });

    await newUser.save();
    const payload = {
      userId: newUser.userId,
      username: newUser.username,
      clientId,
    };
    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          userId: newUser.userId,
          username: newUser.username,
          createdAt: newUser.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password, clientId } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find user by username
    const user: IUser | null = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const payload = { userId: user.userId, username: user.username, clientId };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          userId: user.userId,
          username: user.username,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserIno = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
