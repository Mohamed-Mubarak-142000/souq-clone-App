import express from "express";
import {
  forgetPasswordController,
  getAllOrdersController,
  getOrdersController,
  loginController,
  registerController,
  testController,
  updateOrderStatusController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/test", requireSignIn, isAdmin, testController);
router.post("/forget-password", forgetPasswordController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/orders", requireSignIn, getOrdersController);
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  updateOrderStatusController
);
export default router;
