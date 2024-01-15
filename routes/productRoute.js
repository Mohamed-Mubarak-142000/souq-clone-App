import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteproductController,
  filterProductController,
  getProductsController,
  productListController,
  productPagenationController,
  productPhotoController,
  similarProductController,
  singleProductController,
  updateproductController,
} from "../controller/productController.js";
import formidable from "express-formidable";
const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
router.get("/single-product/:id", singleProductController);
router.get("/get-all-products", getProductsController);
router.get("/product-photo/:id", productPhotoController);
router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  deleteproductController
);
router.put(
  "/update-product/:slug",
  requireSignIn,
  formidable(),
  isAdmin,
  updateproductController
);

router.post("/filter-product", filterProductController);

router.get("/product-related/:pid/:cid ", similarProductController);
router.get("/product-pagenation", productPagenationController);

router.get("/product-list/:page", productListController);

router.get("/braintree/token", braintreeTokenController);

router.post("/braintree/payment", requireSignIn, braintreePaymentController);
export default router;
