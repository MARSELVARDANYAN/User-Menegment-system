import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function generateRegistrationToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

export function verifyRegistrationToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function generateAccessToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "24h" });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function generatePasswordResetToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

export function verifyPasswordResetToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function generateEmailVerificationToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

export function verifyEmailVerificationToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function generateVerificationToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

export function verifyVerificationToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function generateForgotPasswordToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

export function verifyForgotPasswordToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
