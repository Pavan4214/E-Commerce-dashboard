const asyncHandler = require("express-async-handler");
const Brand = require("../model/Brand.js");

// Create a new Brand
const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brandFound = await Brand.findOne({ name });

  if (brandFound) throw new Error("Brand already exists");

  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({ status: "success", message: "Brand created", brand });
});

// Get all brands
const getAllBrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json({ status: "success", message: "Brands fetched", brands });
});

// Get a single brand by ID
const getSingleBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  res.json({ status: "success", message: "Brand fetched", brand });
});

// Update a brand
const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  res.json({ status: "success", message: "Brand updated", brand });
});

// Delete a brand by ID
const deleteBrandCtrl = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);
  res.json({ status: "success", message: "Brand deleted" });
});

module.exports = {
  createBrandCtrl,
  getAllBrandsCtrl,
  getSingleBrandCtrl,
  updateBrandCtrl,
  deleteBrandCtrl,
};
