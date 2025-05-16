import bcrypt from "bcrypt";
import User from "../models/Users.model.js";
import { sendActivationEmail } from "../config/nodemailer.js";
import {
  generateAccessToken,
  generateForgotPasswordToken,
  verifyRegistrationToken,
  verifyForgotPasswordToken,
} from "../services/auth.services.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateAccessToken(user._id);
    const { password: _, ...userData } = user._doc;
    res.json({
      message: "Login successful",
      user: { ...userData, token },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.json({ message: "Logout successful" });
};

export const registerUser = async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;
  console.log(token, password);
  if (!token || !password) {
    return res.status(400).json({ message: "Missing token or password" });
  }

  try {
    const decoded = verifyRegistrationToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "active") {
      return res.status(400).json({ message: "User already activated" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.status = "active";

    await user.save();

    res.json({ message: "Registration completed successfully", user });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateForgotPasswordToken(user._id);
    const forgotPasswordLink = `/forgot-password-reset?token=${token}`;

    await sendActivationEmail(email, forgotPasswordLink);

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const forgotPasswordReset = async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;

  try {
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const decoded = verifyForgotPasswordToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successful", user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};
