import express from 'express';
import { login } from './users/login';
import logout from './users/logout';
import dash from './users/dash';
import checkCookie from '../middlewares/checkCookie';

const router = express.Router();

router.get('/', (req, res) => res.send('Welcome to EduGate!'));
router.post('/login', login.post);
router.get('/login', login.get);
router.get('/logout', logout);
router.get('/dash', checkCookie, dash);

export default router;
