export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

// middleware/errorHandler.js
/**
 * 自定义错误类
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

/**
 * 全局错误处理中间件
 */
export const errorHandler = (err, req, res, next) => {
  console.log(err);

  const { statusCode = 500, status = "error", stack, message } = err;
  const { path, method } = req;
  // 设置默认值

  //   // 开发环境：输出详细错误信息
  //   if (process.env.NODE_ENV === "development") {
  //     console.error("❌ Error:", {
  //       message,
  //       stack,
  //       statusCode,
  //       path,
  //       method,
  //       timestamp: new Date().toISOString(),
  //     });

  //     return res.status(statusCode).json({
  //       status,
  //       message,
  //       error: err,
  //       stack,
  //     });
  //   }

  // 生产环境：友好的错误响应
  if (err.isOperational) {
    // 可预期的操作错误
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  console.error("💥 Unexpected Error:", {
    message,
    stack,
    path,
    method,
    timestamp: new Date().toISOString(),
  });

  // ========== 1. 处理 Mongoose 验证错误 ==========
  if (err.name === "ValidationError") {
    const errors = {};

    // 提取每个字段的错误消息
    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message; // 使用你在 Schema 中定义的 message
    });

    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors, // 返回具体的字段错误
    });
  }

  // ========== 2. 处理 CastError（无效的 ID） ==========
  if (err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // ========== 3. 处理重复键错误（unique: true） ==========
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];

    return res.status(400).json({
      status: "fail",
      message: `Duplicate field value: '${value}' already exists`,
      field,
      value,
    });
  }

  return res.status(statusCode).json({
    status: "error",
    message: "Something went wrong!",
  });
};
