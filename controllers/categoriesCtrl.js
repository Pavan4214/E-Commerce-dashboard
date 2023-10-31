const asyncHandler = require("express-async-handler");
const Category = require("../model/Category.js");

// Create a new category
const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const categoryFound = await Category.findOne({ name });

  if (categoryFound) throw new Error("Category already exists");

  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    image: req?.file?.path,
  });

  res.json({ status: "success", message: "Category created", category });
});

// Get all categories
const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({ status: "success", message: "Categories fetched", categories });
});

// Get a single category by ID
const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json({ status: "success", message: "Category fetched", category });
});

// Update a category
const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  res.json({ status: "success", message: "Category updated", category });
});

// Delete a category by ID
const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ status: "success", message: "Category deleted" });
});

module.exports = {
  createCategoryCtrl,
  getAllCategoriesCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
};
