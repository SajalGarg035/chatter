import express from 'express';
import { login, logout, signup , profile } from '../controllers/auth.controller.js';
import authenticate from '../middlewares/auth.middle.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout); 
router.post('/forgot', (req, res) => {
    res.send('Forgot password functionality not implemented yet');
});
router.put('/update-profile',authenticate, profile);


export default router;