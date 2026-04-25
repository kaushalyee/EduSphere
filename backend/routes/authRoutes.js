const router = require("express").Router();
const authController = require("../controllers/authController");
const { uploadVerification } = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');

router.post(
  '/register',
  uploadVerification.fields([
    { name: 'studentIdPhoto', maxCount: 1 },
    { name: 'supportingDocument', maxCount: 1 },
  ]),
  authController.register
);
router.post("/login", authController.login);

router.get('/me', protect, authController.getMe);

router.put(
  '/resubmit',
  protect,
  uploadVerification.fields([
    { name: 'studentIdPhoto', maxCount: 1 },
    { name: 'supportingDocument', maxCount: 1 },
  ]),
  authController.resubmitDocuments
);

// Temporary test route — remove after confirming email works
router.get('/test-email', async (req, res) => {
  try {
    const { sendApprovalEmail } = require('../services/emailService');
    await sendApprovalEmail('edusphere3923@gmail.com', 'Test Student');
    res.json({ message: 'Email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Email failed', error: err.message });
  }
});

module.exports = router;