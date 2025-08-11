// routes/user.ts
import { Router } from 'express';
import controller from '../controllers/controller'; // <- named import

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ error: false, message: 'User Routes Health Check Successfull' });
});

router.post('/login', controller.login); // <- pass the handler directly

export default router;
