const User = require("../model/User.js");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken.js");
const { getTokenFromHeader } = require("../utils/getTokenFromHeader.js");
const { verifyToken } = require("../utils/verifyToken.js");

// Register user
exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  // Check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    // Throw
    throw new Error("User already exists");
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create the user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    status: "success",
    message: "User Registered Successfully",
    data: user,
  });
});

// Login user
exports.loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Find the user in db by email only
  const userFound = await User.findOne({
    email,
  });
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    res.json({
      status: "success",
      message: "User logged in successfully",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("Invalid login credentials");
  }
});

// Get user profile
exports.getUserProfileCtrl = asyncHandler(async (req, res) => {
  // Find the user
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    message: "User profile fetched successfully",
    user,
  });
});

// Update user shipping address
exports.updateShippingAddresctrl = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phone,
    country,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
        country,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  // Send response
  res.json({
    status: "success",
    message: "User shipping address updated successfully",
    user,
  });
});
