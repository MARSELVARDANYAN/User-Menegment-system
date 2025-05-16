import { verifyAccessToken } from "../services/auth.services.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid token format" });
    }
    console.error("Authentication error:", err);
    res
      .status(500)
      .json({ message: "Internal server error during authentication" });
  }
};
