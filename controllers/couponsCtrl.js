const asyncHandler = require("express-async-handler");
const Coupon = require("../model/Coupon.js");

// Create a new coupon
exports.createCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  // Check if the coupon already exists
  const couponExists = await Coupon.findOne({ code });
  if (couponExists) throw new Error("Coupon already exists");

  // Check if the discount is a number
  if (isNaN(discount)) throw new Error("Discount value must be a number");

  // Create the coupon
  const coupon = await Coupon.create({
    code,
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });

  res.status(201).json({
    status: "success",
    message: "Coupon created",
    coupon,
  });
});

// Get all coupons
exports.getAllCouponsCtrl = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});

// Get a single coupon by code
exports.getCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.query.code });

  if (!coupon) throw new Error("Coupon not found");
  if (coupon.isExpired) throw new Error("Coupon Expired");

  res.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
});

// Update a coupon
exports.updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;

  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    message: "Coupon updated",
    coupon,
  });
});

// Delete a coupon by ID
exports.deleteCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  res.json({
    status: "success",
    message: "Coupon deleted",
    coupon,
  });
});
