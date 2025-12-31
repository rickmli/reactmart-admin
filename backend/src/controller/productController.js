import Product from "../model/Product.js";

export async function getAllProducts(req, res) {
  console.log("[HIT] GET /products");
  try {
    const products = await Product.find().sort({ createdAt: -1 }); //newest first
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllProducts controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

export async function getProduct(req, res) {
  console.log("[HIT] GET /products/:id");
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProduct controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

export async function createProduct(req, res) {
  console.log("[HIT] POST /products");
  try {
    const { name, price, stock, description, category, images } = req.body;
    const newProduct = new Product({
      name,
      price,
      stock,
      description,
      category,
      images,
    });

    await newProduct.save();

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error in createProduct controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

export async function updateProduct(req, res) {
  console.log("[HIT] PUT /products/:id");
  try {
    const { name, price, stock, description, category, images } = req.body;
    const { id } = req.params;
    // 只包含有值的字段
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (price !== undefined) updateFields.price = price;
    if (stock !== undefined) updateFields.stock = stock;
    if (description !== undefined) updateFields.description = description;
    if (category !== undefined) updateFields.category = category;
    if (images !== undefined) updateFields.images = images;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields }, // 关键：使用 $set
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    console.error("Error in updateProduct controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

export async function deleteProduct(req, res) {
  console.log("[HIT] DELETE /products/:id");
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error in deleteProduct controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

export async function deleteAllProducts(req, res) {
  console.log("[HIT] DELETE /products");
  try {
    await Product.deleteMany();

    return res.status(200).json({ message: "All Products deleted" });
  } catch (error) {
    console.error("Error in deleteAllProducts controller", error);
    return res.status(500).json({ message: "Internal server errror" });
  }
}

// 支持自定义数量
export async function seedProducts(req, res) {
  console.log("[HIT] POST /products/seedProducts");
  try {
    const count = parseInt(req.query.count) || 10;
    const shouldReset = req.query.reset === "true";

    if (shouldReset) {
      const deleteResult = await Product.deleteMany();
      console.log(
        `🗑️  Deleted ${deleteResult.deletedCount} existing products.`
      );
    }

    // 生成动态数量的商品
    const testProducts = Array.from({ length: count }, (_, index) => ({
      name: `Test Product ${index + 1}`,
      price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      stock: Math.floor(Math.random() * 100) + 10,
      description: `Auto-generated product #${index + 1} for testing`,
      category: [
        ["Electronics", "Clothing", "Books", "Home", "Sports"][index % 5],
      ],
      images: [`https://picsum.photos/300/200?random=${index + 1}`],
    }));

    // 4. 批量插入数据库
    const createdProducts = await Product.insertMany(testProducts);

    // 5. 返回成功响应
    return res.status(201).json({
      message: `Successfully seeded ${createdProducts.length} products${
        shouldReset ? " (after reset)" : ""
      }`,
      count: createdProducts.length,
      products: createdProducts.map((p) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        category: p.category,
      })),
    });
  } catch (error) {
    console.error("Error in seedProducts controller", error);
    return res.status(500).json({
      message: "Failed to seed products",
      error: error.message,
    });
  }
}
