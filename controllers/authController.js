const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/userModel");
const errorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/sendToken");

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

const user = await User.findById(req.user.id)

if(!user){
  return next(new errorHandler("User Not found",404))
}



res.status(200).json({
  success:true,
  data:{
    user
  }
})
}
)
