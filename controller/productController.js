import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";
dotenv.config();

//getway card
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MARCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      counter,
      price,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "description is Required" });
      case !price:
        return res.status(500).send({ error: "price is Required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is Required" });
      case !category:
        return res.status(500).send({ error: "category is Required" });
      case photo && photo.size > 1000000:
        res
          .status(500)
          .send({ error: "Photo is Required and should be less than 1mb" });
    }

    const product = new productModel({
      ...req.fields,
      slug: slugify(name),
      counter: 0,
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(200).send({
      success: true,
      message: "product is created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
    });
  }
};

export const getProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createAt: -1 });
    res.status(200).send({
      success: true,
      message: "All products",
      products,
      countTotal: products.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
    });
  }
};

export const singleProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel
      .findOne({ id })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Get single product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
    });
  }
};
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
    });
  }
};

export const deleteproductController = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id).select("-photo");
    res.status(200).send({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "something went wrong",
    });
  }
};

export const updateproductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.status(400).send({ messgage: "Name is Required" });
    }
    if (!description) {
      return res.status(400).send({ messgage: "description is Required" });
    }
    if (!price) {
      return res.status(400).send({ messgage: "price is Required" });
    }
    if (!quantity) {
      return res.status(400).send({ messgage: "quantity is Required" });
    }
    if (!category) {
      return res.status(400).send({ messgage: "category is Required" });
    }
    if (!shipping) {
      return res.status(400).send({ messgage: "shipping is Required" });
    }
    if (photo && photo.size > 1000000) {
      return res
        .status(400)
        .send({ messgage: "Photo is Required and should be less than 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.slug,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(200).send({
      success: true,
      message: "product is update successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      messga: "something went wrong",
    });
  }
};

export const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong while filter product",
    });
  }
};

export const productPagenationController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      message: "pagenation successfully",
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while product pagenation",
    });
  }
};

export const productListController = async (req, res) => {
  try {
    const products = 8;
    const page = req.params.page ? req.params.page : 1;
    const productList = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * products)
      .limit(products)
      .sort({ createAt: -1 });

    res.status(200).send({
      success: true,
      productList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error while product list",
    });
  }
};

export const similarProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    const { cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while similar Product",
    });
  }
};

export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (error, response) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while processing payment ",
    });
  }
};
