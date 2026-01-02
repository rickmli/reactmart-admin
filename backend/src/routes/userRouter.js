import express from "express";
import {
  createMyAccount,
  getAllUsers,
  getMyClerkInfo,
  getUser,
  updateMySetting,
} from "../controller/userController.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.get("/clerkInfo", requireAuth(), getMyClerkInfo);
router.post("/", requireAuth(), createMyAccount);
router.put("/:id", requireAuth(), updateMySetting);
// todo router.put("/:id", requireAuth(), deleteMyUser); also have to delete user clerk's account

export default router;
