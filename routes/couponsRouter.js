const express = require("express");
const couponsCtrl = require("../controllers/couponsCtrl.js");
const isAdmin = require("../middlewares/isAdmin.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn, couponsCtrl.createCouponCtrl);
couponsRouter.get("/", couponsCtrl.getAllCouponsCtrl);
couponsRouter.put(
  "/update/:id",
  isLoggedIn,
  isAdmin,
  couponsCtrl.updateCouponCtrl
);
couponsRouter.delete(
  "/delete/:id",
  isLoggedIn,
  isAdmin,
  couponsCtrl.deleteCouponCtrl
);
couponsRouter.get("/single", couponsCtrl.getCouponCtrl);

module.exports = couponsRouter;
