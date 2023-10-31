const User = require("../model/User.js");

const isAdmin = async (req, res, next) => {
  //find the login user
  const user = await User.findById(req.userAuthId);
  //check if admin
  if (user?.isAdmin) {
    //console.log("user is Admdin");
    next();
  } else {
    next(new Error("Access denied, admin only"));
  }
};

module.exports = isAdmin;
