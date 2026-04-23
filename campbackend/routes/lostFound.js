const express = require('express');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const lostFoundController = require('../controllers/lostFoundController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/create', authMiddleware, upload.single('image'), lostFoundController.createPost);
router.get('/', authMiddleware, lostFoundController.getPosts);
router.delete('/:id', authMiddleware, lostFoundController.deletePost);
router.put('/:id/forget', authMiddleware, lostFoundController.forgetPost);

module.exports = router;