const notFound = (_req, res, next) => {
    res.status(400).json({
        message: "route not found",
    });
    next();
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.isOperational ? err.message : "Something went wrong";

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
    }

    // Duplicate key (unique index)
    if (err.code === 11000) {
        statusCode = 409;
        message = `Duplicate value for field: ${Object.keys(err.keyValue)[0]}`;
    }

    if (process.env.NODE_ENV !== "production") {
        console.error(err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports.notFound = notFound;
module.exports.errorHandler = errorHandler;
