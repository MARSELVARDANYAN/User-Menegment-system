import { generateRegistrationToken } from "../services/auth.services.js";
import sendActivationEmail from "../config/nodemailer.js";
import User from "../models/Users.model.js";

export const createUser = async (req, res) => {
  const { email, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ email, status: "inactive" });

    const token = generateRegistrationToken(user._id);

    const registrationLink = `/register?token=${token}`;

    await sendActivationEmail(email, registrationLink);

    res.status(201).json({ message: "Registration link sent to email", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
