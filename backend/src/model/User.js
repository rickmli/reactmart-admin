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
    },
    email: {
      type: String, // 修正：类型应为 String
      unique: true, // 邮箱通常也需要唯一
      lowercase: true, // 自动转为小写存储
      match: [/^\S+@\S+\.\S+$/, "请输入有效的邮箱地址"], // 邮箱格式验证
    },
    role: {
      type: String,
      enum: ["admin", "seller", "user", "root"], // 限制为这三个值
      default: "user", // 默认值为 "user"
    },
    avatar: {
      type: String,
      default: "https://mockmind-api.uifaces.co/content/abstract/41.jpg", // 可设置默认头像链接
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
