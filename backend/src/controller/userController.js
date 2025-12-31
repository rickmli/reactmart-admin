// import Product from "../model/Product.js";
import { clerkClient, getAuth } from "@clerk/express";
import User from "../model/User.js";

export async function getAllUsers(req, res) {
  console.log("[HIT] GET /users");
  try {
    const users = await User.find().sort({ createdAt: -1 }); //newest first
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

export async function getUser(req, res) {
  console.log("[HIT] GET /users/:id");
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUser controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

export async function getUserClerkInfo(req, res) {
  console.log("[HIT] GET /users/clerkInfo");
  try {
    const { userId } = getAuth(req);

    // Use Clerk's JavaScript Backend SDK to get the user's User object
    const user = await clerkClient.users.getUser(userId);
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
  } catch (error) {
    console.error("Error in getUserClerkInfo controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

export async function createUser(req, res) {
  console.log("[HIT] POST /users");
  try {
    const { userId } = getAuth(req);

    // Use Clerk's JavaScript Backend SDK to get the user's User object
    const user = await clerkClient.users.getUser(userId);
    const {
      id: clerkUserId, // "user_37bEAku2GedRqaqnFrtR1yoxfpO"
      username, // "rickmli"
      firstName: name, // "Rick"
      // lastName, // "Li"
      lastSignInAt, // 1767163228530
      imageUrl: avatar, // 头像URL
      emailAddresses, // 邮箱数组
      // primaryEmailAddressId, // 主邮箱ID
      // publicMetadata, // 你设置的业务数据
    } = user;
    const email = emailAddresses[0]?.emailAddress || "";

    if (!username) {
      return res
        .status(409)
        .json({ message: "Username is required for creating account" });
    }
    if (!clerkUserId) {
      return res
        .status(409)
        .json({ message: "ClerkUserId is required for creating account" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res
        .status(409)
        .json({ message: "Username is registrated with another account" });
    }

    // 检查邮箱
    const existingEmail = await User.findOne({
      email,
    });
    if (existingEmail) {
      return res
        .status(409)
        .json({ message: "Email is registrated with another account" });
    }

    const existingClerkUserId = await User.findOne({ clerkUserId });
    if (existingClerkUserId) {
      return res
        .status(409)
        .json({ message: "ClerkUserId is registrated with another account" });
    }

    // 创建一个基础对象
    const userData = {
      clerkUserId,
      username,
      name: name || "user",
      email: email,
      avatar:
        avatar || "https://mockmind-api.uifaces.co/content/abstract/41.jpg",
      lastSignInAt,
    };

    // 创建用户
    const newUser = new User(userData);
    await newUser.save();

    return res.status(201).json({ newUser });
  } catch (error) {
    console.error("Error in createUser controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

export async function updateUser(req, res) {
  console.log("[HIT] PUT /users/:id");
  try {
    const { name, avatar, role, email, isActive, lastSignInAt } = req.body;
    const { id } = req.params;

    const validRoles = new Set(["root", "admin", "seller", "user"]);
    if (role && !validRoles.has(role)) {
      return res
        .status(400)
        .json({ message: `Role should be either ${validRoles.join(", ")}` });
    }
    if (typeof isActive !== "boolean") {
      return res
        .status(409)
        .json({ message: "IsActive should be a boolean value" });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (lastSignInAt !== undefined) updateFields.lastSignInAt = lastSignInAt;
    if (isActive !== undefined) updateFields.isActive = isActive;
    if (role !== undefined) updateFields.role = role;

    const updatedProduct = await User.findByIdAndUpdate(
      id,
      { $set: updateFields }, // 关键：使用 $set
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated" });
  } catch (error) {
    console.error("Error in updateUser controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

// export async function deleteAllUsers(req, res) {
//   console.log("[HIT] DELETE /users");
//   try {
//     await User.deleteMany();

//     res.status(200).json({ message: "All Users deleted" });
//   } catch (error) {
//     console.error("Error in deleteAllUsers controller", error);
//     res.status(500).json({ message: "Internal server errror" });
//   }
// }
