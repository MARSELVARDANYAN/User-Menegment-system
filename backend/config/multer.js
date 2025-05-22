import multer from "multer";

const fileStorage = multer.memoryStorage();


const upload = multer({ storage: fileStorage });

export default upload;
