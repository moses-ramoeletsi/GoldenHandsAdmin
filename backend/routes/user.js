// import express, {Router} from 'express';
// import { createUser, getUsers } from '../controllers/user.controller.js';

// const router = express.Router();

// router.post('/users', createUser);
// router.get('/users', getUsers);
// export default router;

import express from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;