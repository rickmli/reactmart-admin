import express from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  getUserClerkInfo,
  updateUser,
} from "../controller/userController.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.get("/clerkInfo", requireAuth(), getUserClerkInfo);
router.get("/:id", getUser);
router.get("/", getAllUsers);
router.post("/", requireAuth(), createUser);
router.put("/:id", requireAuth(), updateUser);
// router.delete("/:id", deleteProduct);
// router.delete("/", deleteAllUsers);

// seeding Products
// router.post("/seedProducts", seedProducts);

export default router;
