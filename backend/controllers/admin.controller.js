import { generateRegistrationToken } from "../services/auth.services.js";
import sendActivationEmail from "../config/nodemailer.js";
import User from "../models/Users.model.js";
import File from "../models/File.model.js";
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

export const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id).populate('avatar');

    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }

    let adminObj = admin.toObject();

    if (adminObj.avatar && adminObj.avatar.data) {
      const base64 = adminObj.avatar.data.toString('base64');
      adminObj.avatar.data = `data:${adminObj.avatar.mimetype};base64,${base64}`;
    }

    res.status(200).json(adminObj);
  } catch (error) {
    console.error('Error fetching admin by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const editAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID", id);
    let avatarId;
    if (req.file) {
      const customFileName = `${Date.now()}-${req.file.originalname}`;

      const fileExists = await User.findOne({ _id: id }).populate("avatar");
      console.log(fileExists);
      if (fileExists && fileExists.avatar) {
        await File.findByIdAndDelete(fileExists.avatar._id);
      }

      const file = await File.create({
        filename: customFileName,
        mimetype: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      });

      const savedFile = await file.save();
      avatarId = savedFile._id;
    }

    const updateData = { ...req.body };
    if (avatarId) updateData.avatar = avatarId;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("avatar"); 

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let userObj = updatedUser.toObject();
    if (userObj.avatar && userObj.avatar.data) {
      userObj.avatar.data = userObj.avatar.data.toString("base64");
    }

    res.status(200).json(userObj);
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteAdminAvatar = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate("avatar");
    if (!user || !user.avatar) {
      return res.status(404).json({ message: "User or avatar not found" });
    }

    await File.findByIdAndDelete(user.avatar._id);
    user.avatar = null;
    await user.save();

    res.status(200).json({ message: "Avatar deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin avatar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};