import express, {Router} from 'express';
import { createUser, getUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
export default router;