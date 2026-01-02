import { getAuth } from "@clerk/express";
import User from "../model/User.js";
import { NotFoundError, UnauthorizedError } from "./errorHandler.js";

export const requireRole = (...allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new UnauthorizedError("Please log in first");
    }

    const user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // 检查用户角色是否在允许的角色列表中
    if (!allowedRoles.includes(user.role)) {
      throw new UnauthorizedError(
        `User does not possess admin-role for: ${allowedRoles.join(", ")}`
      );
    }

    // 将用户信息附加到请求对象，方便后续使用
    req.user = user;

    next();
  });
};
