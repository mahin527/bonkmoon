const mongoose = require("mongoose");
const app = require("./src/app.js");
const { connectDB } = require("./src/config/db.js");

const PORT = process.env.PORT || 3006;

const start = async () => {
    await connectDB();

    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown: চলমান request শেষ করে তারপর বন্ধ হবে
    const shutdown = (signal) => {
        console.log(`${signal} received, shutting down...`);
        server.close(async () => {
            await mongoose.connection.close();
            process.exit(0);
        });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    process.on("unhandledRejection", (err) => {
        console.error("Unhandled Rejection:", err);
        server.close(() => process.exit(1));
    });
};

start();
