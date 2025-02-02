import { Request, Response, NextFunction } from "express";

// Custom Error handler middleware
const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error for internal server tracking
  console.error("errorHandler",err);

  // Determine the error status
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Customize the response structure (you can modify this based on your needs)
  const errorResponse = {
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Show stack trace only in development
  };

  // Send the error response
  res.status(status).json(errorResponse);
};

export default handleError;
