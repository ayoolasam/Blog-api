const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const errorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")

//register user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new errorHandler("Please fill in Details", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(200).json({
    success: true,
    nessage: "Registered succesfully",
  });
});

//login user
exports.LoginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorHandler("Please fill in Details", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new errorHandler("Invalid Email", 404));
  }

  const comparePassword = await user.comparePassword(password);

  if (!comparePassword) {
    return next(new errorHandler("Password incorrect", 404));
  }

  sendToken(user, 200, res);
});

//get current user
exports.getCurrentUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new errorHandler("User Not found", 404));
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

//update user details
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Updated successfully",
  });
});

//forgotPassword
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new errorHandler("User Not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `{process.env.resetUrl}/password/reset/${resetToken}`;
  const message = `your password reset link is as follow ${resetUrl} if you have not if you have not requested this please ignore`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset email for this app ",
      message,
    });

    res.status(200).json({
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new AppError("There was an error sending the email", 400));
  }





});










//reset password functionality
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
  //get token from url 
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  })


if(!user){
  return next(new errorHandler("Invalid token", 400))
}

//set up new Password
user.password = req.body.password
user.resetPasswordExpired = undefined;
user.resetPasswordToken = undefined
await user.save({validateBeforeSave: false})
sendToken(user,200,res)



})