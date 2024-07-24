const express = require("express");
const app = express();
const dotenv = require("dotenv");
const BlogRoutes = require("./routes/BlogRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/comment")
const followRoutes = require("./routes/Followers")
const errorMiddleware = require("./middlewares/errors");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./config/config.env" });
const databaseConnection = require("./config/database");

databaseConnection();

app.use(express.json());

app.use(cookieParser());
app.use("/api/v1", BlogRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", followRoutes);

app.use(errorMiddleware);
const PORT = process.env.PORT || 7000;
const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT} in ${process.env.NODE_ENV}`);
});
