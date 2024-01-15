import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(500).send({
        message: "Name is Required",
      });
    }

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res
        .status(200)
        .send({ success: false, message: "Category Already Exists" });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(200).send({
      success: true,
      message: "Create Category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
    });
  }
};
export const getAllCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "all category successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};
export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ id: req.params });
    res.status(200).send({
      success: true,
      message: "Get Single category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "delete category successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};
