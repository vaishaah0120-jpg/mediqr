import express from 'express';
import { loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { seedDatabase } from '../utils/seeder.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.all('/seed', async (req, res) => {
  try {
    const result = await seedDatabase({ clearExisting: req.query.reset === 'true' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

