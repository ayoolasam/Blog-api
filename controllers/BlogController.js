const express = require("express");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Blog = require("../models/BlogPost");
const errorHandler = require("../utils/errorHandler");
const APIfilters = require("../utils/apiFilters");

exports.CreateBlog = catchAsyncErrors(async (req, res, next) => {
  req.body.author = req.user.id;

  const blog = await Blog.create(req.body);

  res.status(200).json({
    success: true,

    message: "Blog Created",
    data: {
      blog,
    },
  });
});

//get a particular blog
exports.getBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id)
    .populate({
      path: "author",
      select: "name email",
    })
    .populate({
      path: "comments",
      select: "user content",
      populate: {
        path: "user",
        select: "name email",
      },
    });

  if (!blog) {
    return next(new errorHandler("Post not found", 404));
  }

  res.status(200).json({
    data: {
      blog,
    },
  });
});

//update blog
exports.updateBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new errorHandler("blog not found"));
  }

  if (blog.author.toString() !== req.user.id) {
    return next(new errorHandler("Not authorized to update this post", 401));
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidatord: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "job updated successfully",
    data: {
      updatedBlog,
    },
  });
});

//getblogs
exports.getBlogs = catchAsyncErrors(async (req, res, next) => {
  const Apifilters = new APIfilters(Blog.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const blogs = await Apifilters.query;

  res.status(200).json({
    success: true,
    result: blogs.length,
    data: {
      blogs,
    },
  });
});

//get currentUserBlogs

exports.getCurrentUserBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.find({ author: req.user.id });

  if (!blog) {
    return next(new errorHandler(`Blog not found for ${req.user.name}`));
  }

  res.status(200).json({
    success: true,
    data: {
      blog,
    },
  });
});

//delete blog
exports.deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return next(new errorHandler("blog not found"));
  }

  if (blog.author.toString() !== req.user.id && req.user.role !== "admin" ) {
    return next(new errorHandler("Not authorized to delete this blog"));
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
});
