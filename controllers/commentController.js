const express = require("express");
const Comment = require("../models/comment");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Blog = require("../models/BlogPost");
const ErrorHandler = require("../utils/errorHandler");

//create a comment
exports.createAComment = catchAsyncErrors(async (req, res, next) => {
  const blogPost = await Blog.findById(req.params.id);

  if (!blogPost) {
    return next(new ErrorHandler("Blog not found", 404));
  }
  //push the comment

  req.body.user = req.user._id;
  req.body.blogPost = req.params.id;

  const comment = await Comment.create(req.body);

  blogPost.comments.push(comment.id);

  await blogPost.save();

  res.status(200).json({
    success: true,
    comment,
    blogPost,
  });
});

//delete a comment
exports.deleteComment = catchAsyncErrors(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorHandler("Comment not found", 404));
  }

  if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorHandler("not authorized to delete this comment", 401));
  }

  await Comment.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
});
