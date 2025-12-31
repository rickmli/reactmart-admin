// backend/src/seedProducts.js
import mongoose from "mongoose";
import Product from "./model/Product.js"; // 注意 ES6 import 和后缀
import "dotenv/config"; // ES6 方式加载环境变量

// 1. 生成10个随机商品
function generateRandomProducts() {
  const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"];
  const products = [];

  for (let i = 1; i <= 10; i++) {
    products.push({
      name: `Test Product ${i}`,
      price: parseFloat((Math.random() * 200 + 10).toFixed(2)), // 10.00 - 210.00
      stock: Math.floor(Math.random() * 50) + 10, // 10-59
      description: `This is auto-generated product #${i} for testing purposes.`,
      category: [categories[i % categories.length]], // 你的schema是[String]
      images: [
        `https://picsum.photos/seed/product${i}_1/300/200`,
        `https://picsum.photos/seed/product${i}_2/300/200`,
      ],
    });
  }
  return products;
}

// 2. 主函数
async function seedDatabase() {
  try {
    // 连接数据库（使用你的环境变量）
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB for seeding...");

    // 可选：清空现有数据（开发时常用）
    const shouldReset = process.argv.includes("--reset");
    if (shouldReset) {
      await Product.deleteMany({});
      console.log("🗑️  Existing products deleted.");
    }

    // 生成并插入数据
    const productsToInsert = generateRandomProducts();
    const result = await Product.insertMany(productsToInsert);

    console.log(`✅ Successfully inserted ${result.length} products:`);
    result.forEach((p) => {
      console.log(
        `   - ${p.name} ($${p.price}, Stock: ${p.stock}, Category: ${p.category[0]})`
      );
    });
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
}

// 3. 运行
seedDatabase();
