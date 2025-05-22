import File from "../models/File.model.js";

export const uploadPhoto = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, mimetype, size, buffer } = file;
    const customName = req.body.name || Date.now() + "-" + originalname;

    if (!customName || !mimetype || !size || !buffer) {
      return res.status(400).json({ message: "Invalid file data" });
    }

    const photo = new File({
      filename: customName,
      memtype: mimetype,
      size: size,
      data: file.buffer,
    });

    await photo.save();

    const newPhoto = {
      filename: photo.filename,
      memtype: photo.memtype,
      size: photo.size,
      data: photo.data.toString("base64"),
    };

    res.status(200).json({ message: "File uploaded successfully", newPhoto });
  } catch (err) {
    console.error("Error during file upload:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getPhotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await File.findById(id);
    if (!photo) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(201).json({
      filename: photo.filename,
      memtype: photo.memtype,
      size: photo.size,
      data: photo.data.toString("base64"),
    });
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deletePhotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await File.findById(id);
    if (!photo) {
      return res.status(404).json({ message: "File not found" });
    }

    await File.findByIdAndDelete(id);

    res.status(201).json({ message: "File deleted successfully", photo });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updatePhotoById = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await File.findById(id);
    if (!photo) {
      return res.status(404).json({ message: "File not found" });
    }
    const customName =
      req.body.name || Date.now() + "-" + req.file.originalname;

    (photo.filename = customName),
      (photo.memtype = req.file.mimetype),
      (photo.size = req.file.size),
      (photo.data = req.file.buffer),
      await photo.save();

    const newPhoto = {
      filename: photo.filename,
      memtype: photo.memtype,
      size: photo.size,
      data: photo.data.toString("base64"),
    };

    res.status(201).json({ message: "File updated successfully", newPhoto });
  } catch (err) {
    console.error("Error updating file:", err);
    res.status(500).json({ message: err.message });
  }
};
