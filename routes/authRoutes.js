const express = require("express");
const {
  registerUser,
  LoginUser,
  getCurrentUser,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/me", isAuthenticated, getCurrentUser);

module.exports = router;
