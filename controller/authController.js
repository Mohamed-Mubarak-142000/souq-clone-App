import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";

//registeration controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //Validation
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "email is Required" });
    }
    if (!password) {
      return res.send({ message: "password is Required" });
    }
    if (!phone) {
      return res.send({ message: "phone is Required" });
    }
    if (!address) {
      return res.send({ message: "address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }

    //checked user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already User Register , Please Login..",
      });
    }

    //Registeration User
    const hashedPassword = await hashPassword(password);
    //Save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(200).send({
      success: true,
      message: "User Register SuccessFully..",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

//login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Your Email Or Password is Invalid",
      });
    }
    //checked existing user
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "Your Email Not Found , Please Create An Acount..",
      });
    }
    //Check Password User
    const matchPassword = await comparePassword(
      password,
      existingUser.password
    );
    if (!matchPassword) {
      return res.status(200).send({
        success: false,
        message: "Your Password is InCorrect.",
      });
    }

    //token
    const token = await JWT.sign(
      { _id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    // success login
    res.status(200).send({
      success: true,
      message: "Login Successfully..",
      user: {
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        address: existingUser.address,
        role: existingUser.role,
        answer: existingUser.answer,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login..",
      error,
    });
  }
};

//test Controller
export const testController = async (req, res) => {
  res.send("protected routes");
};
//forget Password Controller
export const forgetPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is Required." });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is Required." });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is Required." });
    }

    //check user----
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Email or Answer Invalid." });
    }

    // hashing password--
    const hashedPassword = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Something went wrong.." }),
      error;
  }
};
export const getOrdersController = async (req, res) => {
  try {
    const order = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while get all orders",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const order = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while get all orders",
      error,
    });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findByIdAndDelete(
      orderId,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while update status",
      error,
    });
  }
};
