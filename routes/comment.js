const express = require("express")
const router = express.Router();
const {createAComment,deleteComment} = require("../controllers/commentController")
const {isAuthenticated} = require("../middlewares/auth")


router.post("/comment/:id",isAuthenticated,createAComment)
router.delete("/comment/:id", isAuthenticated, deleteComment);



module.exports = router;