import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//protected routes token base

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Your An Account UnAthorizated Access..",
      error,
    });
  }
};

//checked isAdmin or customer
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      console.log("Your Account is UnAthorizated Access");
      return res.status(401).send({
        success: false,
        message: "UnAthorizated Access..",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in MiddleWare..",
      error,
    });
  }
};
