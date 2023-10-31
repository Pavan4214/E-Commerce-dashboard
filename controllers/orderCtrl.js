const asyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const Order = require("../model/Order.js");
const Product = require("../model/Product.js");
const User = require("../model/User.js");
const Coupon = require("../model/Coupon.js");
dotenv.config();

// Create a new order
exports.createOrderCtrl = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;
  console.log(req.body);

  const user = await User.findById(req.userAuthId);

  if (!user?.hasShippingAddress)
    throw new Error("Please provide shipping address");
  if (orderItems?.length <= 0) throw new Error("No Order Items");

  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    totalPrice,
  });

  const products = await Product.find({ _id: { $in: orderItems } });

  orderItems?.map(async (order) => {
    const product = products?.find(
      (product) => product?._id?.toString() === order?._id?.toString()
    );
    if (product) product.totalSold += order.qty;
    await product.save();
  });

  user.orders.push(order?._id);
  await user.save();

  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });
});

// Get all orders
exports.getAllordersCtrl = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user");
  res.json({
    status: "success",
    message: "All orders",
    orders,
  });
});

// Get a single order by ID
exports.getSingleOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);
  res.status(200).json({
    status: "success",
    message: "Single order",
    order,
  });
});

// Update order status
exports.updateOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "Order updated",
    updatedOrder,
  });
});

// Get order statistics
exports.getOrderStatsCtrl = asyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: { $min: "$totalPrice" },
        totalSales: { $sum: "$totalPrice" },
        maxSale: { $max: "$totalPrice" },
        avgSale: { $avg: "$totalPrice" },
      },
    },
  ]);

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
