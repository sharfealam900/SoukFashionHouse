import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    files: 30,
    fileSize: 15 * 1024 * 1024,
  },
});

export default upload;
