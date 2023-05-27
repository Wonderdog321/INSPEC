import express from "express";
const router = express.Router();
import { createUser, userSignIn } from "../controllers/users.js";
import {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} from "../middlewares/validation/user.js";

router.post("/create-user", validateUserSignUp, userValidation, createUser);
router.post("/sign-in", validateUserSignIn, userValidation, userSignIn);
export default router;
