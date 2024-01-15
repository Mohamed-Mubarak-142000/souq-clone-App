import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoryController,
  singleCategoryController,
  updateCategoryController,
} from "../controller/categoryController.js";
const router = express.Router();
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);
router.get("/get-all-category", getAllCategoryController);
router.delete(
  "/delete-single-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);
router.get("/single-category/:slug", singleCategoryController);
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

export default router;
