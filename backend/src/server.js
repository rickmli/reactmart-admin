import express from "express";
import productRouter from "./routes/productRouter.js"; // 加上 .js
import userRouter from "./routes/userRouter.js"; // 加上 .js
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
// import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler, NotFoundError } from "./middleware/errorHandler.js";

// configs
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}
app.use(express.json()); // 如果后面要处理 POST/JSON，建议加上
app.use(clerkMiddleware());

// routes
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

// 404 处理
app.use(/.*/, (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
});

// 全局错误处理中间件（必须在所有路由之后）
app.use(errorHandler);

// dev/production filter
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT: ", PORT);
  });
});
