const express = require("express");
const colorsCtrl = require("../controllers/colorsCtrl.js");
const isAdmin = require("../middlewares/isAdmin.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const colorRouter = express.Router();

colorRouter.post("/", isLoggedIn, isAdmin, colorsCtrl.createColorCtrl);
colorRouter.get("/", colorsCtrl.getAllColorsCtrl);
colorRouter.get("/:id", colorsCtrl.getSingleColorCtrl);
colorRouter.delete("/:id", isLoggedIn, isAdmin, colorsCtrl.deleteColorCtrl);
colorRouter.put("/:id", isLoggedIn, isAdmin, colorsCtrl.updateColorCtrl);

module.exports = colorRouter;
