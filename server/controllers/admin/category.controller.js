import Category from "../../models/category.model.js";
import slugify from "slugify";

/* CREATE CATEGORY */

export const createCategory = async (req,res)=>{

  try{

    const { name, description } = req.body;

    if(!name){
      return res.status(400).json({
        success:false,
        message:"Category name required"
      });
    }

    const exists = await Category.findOne({ name });

    if(exists){
      return res.status(400).json({
        success:false,
        message:"Category already exists"
      });
    }

    const category = await Category.create({

      name,
      description,
      slug: slugify(name,{ lower:true, strict:true })

    });

    res.status(201).json({
      success:true,
      category
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message:"Category creation failed",
      error: err.message
    });

  }

};

/* GET ALL CATEGORIES */

export const getCategories = async (req,res)=>{

  try{

    const categories = await Category.find({
      isActive:true
    }).sort({ createdAt:-1 });
    console.log("Fetched categories:", categories);

    res.json({
      success:true,
      categories
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message:"Fetch categories failed"
    });

  }

};

/* DELETE CATEGORY */

export const deleteCategory = async (req,res)=>{

  try{

    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if(!category){
      return res.status(404).json({
        success:false,
        message:"Category not found"
      });
    }

    res.json({
      success:true,
      message:"Category deleted"
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message:"Delete failed"
    });

  }

};

/* UPDATE CATEGORY */

export const updateCategory = async (req, res) => {

  try {

    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }

    if (description !== undefined) {
      category.description = description;
    }

    await category.save();

    res.json({
      success: true,
      category
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: "Update failed",
      error: err.message
    });

  }

};