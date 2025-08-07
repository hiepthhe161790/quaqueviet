const Category = require('../models/category.model');

class CategoryService {
    getAllCategories = async () => {
        return await Category.find({});
    }

    getCategoryById = async (categoryId) => {
        return await Category.findById(categoryId);
    }

    createCategory = async (name, description, thumbnails) => {
        const category = new Category({
            name,
            description,
            thumbnails
        });
        return await category.save();
    }

    updateCategory = async (id, categoryData) => {
        return await Category.findByIdAndUpdate(id, categoryData, { new: true });
    }

    deleteCategory = async (id) => {
        return await Category.findByIdAndDelete(id);
    }
}
module.exports = new CategoryService;