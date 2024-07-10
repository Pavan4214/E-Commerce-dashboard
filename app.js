const dotenv = require("dotenv");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const brandsRouter = require("./routes/brandsRouter.js");
const categoriesRouter = require("./routes/categoriesRouter.js");
const colorRouter = require("./routes/colorRouter.js");
const orderRouter = require("./routes/ordersRouter.js");
const compression = require("compression");
const productsRouter = require("./routes/productsRoute.js");
const reviewRouter = require("./routes/reviewRouter.js");
const userRoutes = require("./routes/usersRoute.js");
const Order = require("./model/Order.js");
const couponsRouter = require("./routes/couponsRouter.js");
const { globalErrhandler } = require("./middlewares/globalErrHandler.js");
dotenv.config();
//Connecting to Database
mongoose
  .set("strictQuery", false)
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  });

const app = express();
//cors
app.use(cors());

// This is your Stripe CLI webhook secret for testing your endpoint locally.
//const endpointSecret =
//  "whsec_2a222b6d6b7abb9982f25d1da9e63f4d0a78f6935259e4ff65cae8df7b5fdde5";

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (request, response) => {
//     const sig = request.headers["stripe-signature"];

//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//       console.log("event");
//     } catch (err) {
//       console.log("err", err.message);
//       response.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }
//     if (event.type === "checkout.session.completed") {
//       //update the order
//       const session = event.data.object;
//       const { orderId } = session.metadata;
//       const paymentStatus = session.payment_status;
//       const paymentMethod = session.payment_method_types[0];
//       const totalAmount = session.amount_total;
//       const currency = session.currency;
//       //find the order
//       const order = await Order.findByIdAndUpdate(
//         JSON.parse(orderId),
//         {
//           totalPrice: totalAmount / 100,
//           currency,
//           paymentMethod,
//           paymentStatus,
//         },
//         {
//           new: true,
//         }
//       );
//       console.log(order);
//     } else {
//       return;
//     }
//     // // Handle the event
//     // switch (event.type) {
//     //   case "payment_intent.succeeded":
//     //     const paymentIntent = event.data.object;
//     //     // Then define and call a function to handle the event payment_intent.succeeded
//     //     break;
//     //   // ... handle other event types
//     //   default:
//     //     console.log(`Unhandled event type ${event.type}`);
//     // }
//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   }
// );

//pass incoming data
app.use(express.json());
//url encoded
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   // You can use a wildcard '*' to allow any origin (not recommended for production)
//   // res.setHeader('Access-Control-Allow-Origin', '*');
//   // Add other necessary CORS headers as well
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

//server static files
app.use(express.static("public"));
app.use(compression());
app.get("/", (req, res) => {
  res.sendFile(path.join("public", "index.html"));
});

//routes
app.use("/api/v1/users/", userRoutes);
app.use("/api/v1/products/", productsRouter);
app.use("/api/v1/categories/", categoriesRouter);
app.use("/api/v1/brands/", brandsRouter);
app.use("/api/v1/colors/", colorRouter);
app.use("/api/v1/reviews/", reviewRouter);
app.use("/api/v1/orders/", orderRouter);
app.use("/api/v1/coupons/", couponsRouter);
//handles all invalid routes requests
app.use("/*", (req, res, next) => {
  const err = new Error(`Route: ${req.originalUrl} not found`);
  next(err);
});

// global error handler middleware.
app.use(globalErrhandler);

module.exports = app;
