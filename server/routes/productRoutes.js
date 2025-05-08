const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get('/', getAllProducts);

// Allow both admin and fertilizer to manage products
router.post('/', protect, authorizeRoles('admin', 'fertilizer'), upload.single('image'), addProduct);
router.put('/:id', protect, authorizeRoles('admin', 'fertilizer'), updateProduct);
router.delete('/:id', protect, authorizeRoles('admin', 'fertilizer'), deleteProduct);

module.exports = router;
