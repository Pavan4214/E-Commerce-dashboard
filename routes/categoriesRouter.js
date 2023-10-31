const exppress = require("express");
const catetgoryFileUpload = require("../config/categoryUpload.js");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const categoriesRouter = exppress.Router();
const {
  createCategoryCtrl,
  getAllCategoriesCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoryCtrl,
} = require("../controllers/categoriesCtrl.js");

categoriesRouter.post(
  "/",
  isLoggedIn,
  catetgoryFileUpload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/", getAllCategoriesCtrl);
categoriesRouter.get("/:id", getSingleCategoryCtrl);
categoriesRouter.delete("/:id", deleteCategoryCtrl);
categoriesRouter.put("/:id", updateCategoryCtrl);
module.exports = categoriesRouter;
