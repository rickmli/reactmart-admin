// controllers/productController.js
import Product from "../model/Product.js";
import { NotFoundError, asyncHandler } from "../middleware/errorHandler.js";

// 所有控制器都用 asyncHandler 包装
export const getAllProducts = asyncHandler(async (req, res) => {
  console.log("[HIT] GET /products");
  const products = await Product.find().sort({ createdAt: -1 });
  res.status(200).json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  console.log("[HIT] GET /products/:id");
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  res.status(200).json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  console.log("[HIT] POST /products");
  const { name, price, stock, description, category, images, status } =
    req.body;

  const newProduct = new Product({
    name,
    price,
    stock,
    description,
    category,
    images,
    status,
  });

  await newProduct.save();
  res.status(201).json(newProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  console.log("[HIT] PUT /products/:id");
  const { name, price, stock, description, category, images } = req.body;
  const { id } = req.params;

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (price !== undefined) updateFields.price = price;
  if (stock !== undefined) updateFields.stock = stock;
  if (description !== undefined) updateFields.description = description;
  if (category !== undefined) updateFields.category = category;
  if (images !== undefined) updateFields.images = images;

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedProduct) {
    throw new NotFoundError("Product not found");
  }

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  console.log("[HIT] DELETE /products/:id");
  const { id } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    throw new NotFoundError("Product not found");
  }

  res.status(200).json({
    message: "Product deleted successfully",
    productId: id,
  });
});

export const deleteAllProducts = asyncHandler(async (req, res) => {
  console.log("[HIT] DELETE /products");
  const result = await Product.deleteMany();

  res.status(200).json({
    message: "All products deleted successfully",
    deletedCount: result.deletedCount,
  });
});

export const seedProducts = asyncHandler(async (req, res) => {
  console.log("[HIT] POST /products/seedProducts");
  const count = parseInt(req.query.count) || 10;
  const shouldReset = req.query.reset === "true";

  if (shouldReset) {
    const deleteResult = await Product.deleteMany();
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing products.`);
  }

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

  const createdProducts = await Product.insertMany(testProducts);

  res.status(201).json({
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
});
