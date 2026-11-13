import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/authController.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = Router();
router.post("/signup", signUp);
router.post("/login", signIn);
router.post("/logout", requireAuth, signOut);
export default router;
