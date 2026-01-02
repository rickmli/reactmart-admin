// import Product from "../model/Product.js";
import { clerkClient, getAuth } from "@clerk/express";
import User from "../model/User.js";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../middleware/errorHandler.js";

export async function getAllUsers(req, res) {
  console.log("[HIT] GET /users");

  const users = await User.find().sort({ createdAt: -1 }); //newest first
  return res.status(200).json(users);
}

export async function getUser(req, res) {
  console.log("[HIT] GET /users/:id");

  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return res.status(200).json(user);
}

export async function getMyClerkInfo(req, res) {
  console.log("[HIT] GET /users/clerkInfo");
  const { userId } = getAuth(req);
  if (!userId) {
    throw new UnauthorizedError("Not authroized");
  }

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId);
  if (!user) {
    throw new NotFoundError("Clerk User is not found");
  }
  const {
    id, // "user_37bEAku2GedRqaqnFrtR1yoxfpO"
    username, // "rickmli"
    firstName, // "Rick"
    lastName, // "Li"
    lastSignInAt, // 1767163228530
    imageUrl, // 头像URL
    emailAddresses, // 邮箱数组
    primaryEmailAddressId, // 主邮箱ID
    publicMetadata, // 你设置的业务数据
  } = user;

  return res.status(200).json({
    id, // "user_37bEAku2GedRqaqnFrtR1yoxfpO"
    username, // "rickmli"
    firstName, // "Rick"
    lastName, // "Li"
    lastSignInAt, // 1767163228530
    imageUrl, // 头像URL
    email: emailAddresses[0].emailAddress, // 邮箱数组
    primaryEmailAddressId, // 主邮箱ID
    publicMetadata, // 你设置的业务数据
  });
}

export async function createMyAccount(req, res) {
  console.log("[HIT] POST /users");

  const { userId } = getAuth(req);
  if (!userId) {
    throw new UnauthorizedError("Not authroized");
  }
  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId);
  if (!user) {
    throw new NotFoundError("Clerk User is not found");
  }
  const {
    id: clerkUserId, // "user_37bEAku2GedRqaqnFrtR1yoxfpO"
    username, // "rickmli"
    firstName: name, // "Rick"
    // lastName, // "Li"
    lastSignInAt, // 1767163228530
    imageUrl: avatar, // 头像URL
    emailAddresses, // 邮箱数组
    email = emailAddresses[0]?.emailAddress || "",
    // primaryEmailAddressId, // 主邮箱ID
    // publicMetadata, // 你设置的业务数据
  } = user;

  if (!username) {
    throw new ValidationError("User should have a valid username");
  }
  if (!clerkUserId) {
    throw new ValidationError("User should have a valid clerkUserId");
  }

  // 创建一个基础对象
  const userData = {
    clerkUserId,
    username,
    name,
    email,
    avatar,
    lastSignInAt,
  };

  // 创建用户
  const newUser = new User(userData);
  await newUser.save();

  return res.status(201).json({ newUser });
}

export async function updateMySetting(req, res) {
  console.log("[HIT] PUT /users/:id");
  const { username, name, avatar, email, lastSignInAt, role } = req.body;
  const { id } = req.params;

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (username !== undefined) updateFields.name = name;
  if (email !== undefined) updateFields.email = email;
  if (avatar !== undefined) updateFields.avatar = avatar;
  if (lastSignInAt !== undefined) updateFields.lastSignInAt = lastSignInAt;
  updateFields.role = role;

  const updatedProduct = await User.findByIdAndUpdate(
    id,
    { $set: updateFields }, // 关键：使用 $set
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "User updated" });
}
