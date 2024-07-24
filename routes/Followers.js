const express = require("express");
const router = express.Router();
const { follow } = require("../controllers/followers");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/follow/:id", isAuthenticated, follow);

module.exports = router;
