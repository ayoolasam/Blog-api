const express = require("express");
const {
  registerUser,
  LoginUser,
  getCurrentUser,
  updateUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/me", isAuthenticated, getCurrentUser);
router.put("/update/me", isAuthenticated, updateUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

module.exports = router;
