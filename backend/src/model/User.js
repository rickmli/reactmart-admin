import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "User's name should not exceed 200 words"],
      default: "user",
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    role: [
      {
        type: String,
        enum: ["product-admin", "order-admin", "system-admin", "guest"],
        default: "guest",
      },
    ],
    avatar: {
      type: String,
      default: "https://mockmind-api.uifaces.co/content/abstract/41.jpg",
      validate: {
        // 简单的URL格式验证
        validator: function (v) {
          return /^(https?:\/\/).*\.(jpg|jpeg|png|webp|gif)$/i.test(v);
        },
        message: "Images should only contain (jpg, jpeg, png, webp, gif)",
      },
    },
    isActive: {
      type: Boolean,
      default: true, // 默认激活状态为 true
    },
    lastSignInAt: {
      type: Date,
      default: null, // 首次登录前为空
    },
    clerkUserId: {
      type: String,
      unique: true,
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

// 可选：添加索引以提升查询性能
userSchema.index({ role: 1 }); // 按角色查询时更快

const User = mongoose.model("User", userSchema); // 修正：应为 userSchema
export default User;
