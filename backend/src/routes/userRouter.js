import express from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  getUserClerkInfo,
} from "../controller/userController.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();

router.get("/clerkInfo", requireAuth(), getUserClerkInfo);
router.get("/:id", getUser);
router.get("/", getAllUsers);
router.post("/", createUser);
// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);
// router.delete("/", deleteAllUsers);

// seeding Products
// router.post("/seedProducts", seedProducts);

export default router;
