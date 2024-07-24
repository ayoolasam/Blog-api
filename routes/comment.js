const express = require("express")
const router = express.Router();
const {createAComment,} = require("../controllers/commentController")
const {isAuthenticated} = require("../middlewares/auth")


router.post("/comment/:id",isAuthenticated,createAComment)



module.exports = router;