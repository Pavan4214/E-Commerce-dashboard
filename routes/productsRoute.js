const express = require("express");
const upload = require("../config/fileUpload.js");
const productsCtrl = require("../controllers/productsCtrl.js");
const isAdmin = require("../middlewares/isAdmin.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const productsRouter = express.Router();

productsRouter.get("/", productsCtrl.getProductsCtrl);
productsRouter.get("/:id", productsCtrl.getProductCtrl);
productsRouter.put("/:id", isLoggedIn, isAdmin, productsCtrl.updateProductCtrl);
productsRouter.delete(
  "/:id/delete",
  isLoggedIn,
  isAdmin,
  productsCtrl.deleteProductCtrl
);
productsRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.array("file"),
  productsCtrl.createProductCtrl
);

module.exports = productsRouter;
