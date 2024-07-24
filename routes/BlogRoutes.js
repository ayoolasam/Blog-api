const express = require("express");
const router = express.Router();
const {
  CreateBlog,
  getBlog,
  updateBlog,
  getBlogs,
  getCurrentUserBlog,
  deleteBlog
} = require("../controllers/BlogController");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/blog", isAuthenticated, CreateBlog);
router.get("/blog/:id", isAuthenticated, getBlog);
router.put("/blog/:id", isAuthenticated, updateBlog);
router.get("/blog", getBlogs);
router.get("/me/blog", isAuthenticated, getCurrentUserBlog);
router.delete("/blog/:id", isAuthenticated, deleteBlog);

module.exports = router;
