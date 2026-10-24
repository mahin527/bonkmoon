const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const authRouter = require("./routes/auth.routes.js");
const accountRouter = require("./routes/account.routes.js");
const { notFound, errorHandler } = require("./middlewares/errorHandler.js");

const app = express();

app.use(helmet()); // security headers
app.use(cors());
app.use(express.json({ limit: "10kb" })); // body size limit, safety from DoS
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// SERVER STATUS
app.get("/health", (req, res) => res.json({ status: "ok" }));

//AUTH
app.use("/api/auth", authRouter);

//ACCOUNT
app.use("/api/account", accountRouter);

// ERROR HANDLER MIDLEWARES
app.use(notFound);
app.use(errorHandler); // সবসময় সবার শেষে

module.exports = app;
