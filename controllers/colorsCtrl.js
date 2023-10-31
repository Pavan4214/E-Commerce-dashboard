const asyncHandler = require("express-async-handler");
const Color = require("../model/Color.js");

// Create a new color
exports.createColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const colorFound = await Color.findOne({ name });

  if (colorFound) throw new Error("Color already exists");

  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({ status: "success", message: "Color created", color });
});

// Get all colors
exports.getAllColorsCtrl = asyncHandler(async (req, res) => {
  const colors = await Color.find();
  res.json({ status: "success", message: "Colors fetched", colors });
});

// Get a single color by ID
exports.getSingleColorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  res.json({ status: "success", message: "Color fetched", color });
});

// Update a color
exports.updateColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true }
  );
  res.json({ status: "success", message: "Color updated", color });
});

// Delete a color by ID
exports.deleteColorCtrl = asyncHandler(async (req, res) => {
  await Color.findByIdAndDelete(req.params.id);
  res.json({ status: "success", message: "Color deleted" });
});
