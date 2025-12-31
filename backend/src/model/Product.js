import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // 自动去除首尾空格
      maxlength: [200, "Product's name should not exceed 200 words"], // 增加长度限制
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Product's price should not be negative"],
      set: (v) => parseFloat(v.toFixed(2)), // 存入时保留两位小数
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Product's stocking should not be negative"],
      validate: {
        // 自定义验证：库存必须是整数
        validator: Number.isInteger,
        message: "Product's stocking should be an integer",
      },
    },
    description: {
      type: String,
      default: "",
      maxlength: 2000, // 描述长度限制
    },
    category: [
      {
        type: String,
        trim: true,
        lowercase: true, // 统一转为小写，避免"Electronics"和"electronics"被视为不同类别
        default: "uncategorized",
      },
    ],
    images: [
      {
        type: String,
        validate: {
          // 简单的URL格式验证
          validator: function (v) {
            return /^(https?:\/\/).*\.(jpg|jpeg|png|webp|gif)$/i.test(v);
          },
          message: "请输入有效的图片URL (jpg, png, webp, gif)",
        },
      },
    ],
    // 🔥 建议新增：商品状态字段
    status: {
      type: String,
      enum: ["draft", "active", "out_of_stock", "discontinued"],
      default: "draft",
    },
    // 🔥 建议新增：SKU（库存单位）唯一标识
    sku: {
      type: String,
      unique: true,
      sparse: true, // 允许部分文档没有此字段
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // 虚拟字段在JSON输出中可见
    toObject: { virtuals: true },
  }
);

// 添加索引提升查询性能
productSchema.index({ name: "text", description: "text" }); // 文本搜索索引
productSchema.index({ category: 1 }); // 按分类查询
productSchema.index({ price: 1 }); // 价格排序
productSchema.index({ status: 1 }); // 状态筛选
productSchema.index({ createdAt: -1 }); // 按新品排序

// 虚拟字段：是否缺货（不存数据库，动态计算）
productSchema.virtual("isOutOfStock").get(function () {
  return this.stock <= 0;
});

// 虚拟字段：带货币符号的价格展示
productSchema.virtual("formattedPrice").get(function () {
  return `$${this.price.toFixed(2)}`;
});

const Product = mongoose.model("Product", productSchema);
export default Product;
