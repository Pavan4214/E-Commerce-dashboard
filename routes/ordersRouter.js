const express = require("express");
const orderCtrl = require("../controllers/orderCtrl.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, orderCtrl.createOrderCtrl);
orderRouter.get("/", isLoggedIn, orderCtrl.getAllordersCtrl);
orderRouter.get("/sales/stats", isLoggedIn, orderCtrl.getOrderStatsCtrl);
orderRouter.put("/update/:id", isLoggedIn, orderCtrl.updateOrderCtrl);
orderRouter.get("/:id", isLoggedIn, orderCtrl.getSingleOrderCtrl);

module.exports = orderRouter;
