import User from "../models/Users.model.js";
import File from "../models/File.model.js";
import bcrypt, { hash } from "bcrypt";

export const getUsersByOption = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    let users = await User.find(filter).select("-password").populate("avatar");

    users = users.map((user) => {
      const userObj = user.toObject();

      if (userObj.avatar?.data && userObj.avatar?.mimetype) {
        const base64 = userObj.avatar.data.toString("base64");
        userObj.avatar.data = `data:${userObj.avatar.mimetype};base64,${base64}`;
      }

      return userObj;
    });
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id: userId } = req.params;

    const user = await User.findById(userId).populate("avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatar?._id) {
      await File.findByIdAndDelete(user.avatar._id);
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User and avatar deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(id).populate("avatar");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.removeAvatar === "true") {
      user.avatar = undefined;
    }
    if (req.file) {
      const customFileName = `${Date.now()}-${req.file.originalname}`;
      const file = await File.create({
        data: req.file.buffer,
        mimetype: req.file.mimetype,
        filename: customFileName,
        size: req.file.size,
      });
      rest.avatar = file._id;
    }

    const updateData = { ...rest };
    // Хешируем новый пароль, если есть
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (user.avatar?._id) {
      await File.findByIdAndDelete(user.avatar._id);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate("avatar");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (updatedUser.avatar?.data && updatedUser.avatar?.mimetype) {
      const base64 = updatedUser.avatar.data.toString("base64");
      updatedUser.avatar.data = `data:${updatedUser.avatar.mimetype};base64,${base64}`;
    }
    res.status(201).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();

    res
      .status(200)
      .json({ message: `User status updated to ${user.status}, user}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const userDoc = await User.findById(id)
      .select("-password")
      .populate("avatar");

    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userDoc.toObject();

    if (user.avatar?.data && user.avatar?.mimetype) {
      const base64 = user.avatar.data.toString("base64");
      user.avatar.data = `data:${user.avatar.mimetype};base64,${base64}`;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").populate("avatar");
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    console.log(users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
