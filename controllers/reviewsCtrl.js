const asyncHandler = require("express-async-handler");
const Product = require("../model/Product.js");
const Review = require("../model/Review.js");

// Create new review
exports.createReviewCtrl = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body;
  // Find the product
  const { productID } = req.params;
  const productFound = await Product.findById(productID).populate("reviews");
  if (!productFound) {
    throw new Error("Product Not Found");
  }
  // Check if user already reviewed this product
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error("You have already reviewed this product");
  }
  // Create review
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });
  // Push review into product Found
  productFound.reviews.push(review?._id);
  // Resave
  await productFound.save();
  res.status(201).json({
    status: "success",
    message: "Review created successfully",
  });
});
