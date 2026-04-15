import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// ✅ TUMHARA DESKTOP FOLDER PATH
const UPLOAD_FOLDER = 'C:\\Users\\mrakh\\OneDrive\\Desktop\\Database';

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ 
    url: `/uploads/${req.file.filename}`,
    path: req.file.path,
    message: 'File uploaded successfully'
  });
});

export default router;