const express = require("express");
const Follow = require("../models/Followers");
const User = require("../models/userModel");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//follow a user
exports.follow = catchAsyncErrors(async (req, res, next) => {


  //find the person being followed
  const followed = await User.findById(req.params.id);

  if (!followed) {
    return next(new Error("User not found", 404));
  }

  //save the id of the user being followed
  req.body.followed = followed.id;

  //save the id of the user following
  req.body.follower = req.user.id;

  //create a follow object
  const follow = await Follow.create(req.body);

  //save the id of the person following on the followed schema
  followed.followers.push(req.user.id);
  followed.save();

  //find the user follower
  const follower = await User.findById(req.user.id);

  //save the user being followed in the following object of the follower
  follower.following.push(followed.id);
  follower.save();

  res.status(201).json({
    success: true,
    message: "Followed",
  });
});
