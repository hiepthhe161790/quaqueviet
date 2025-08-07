const { CategoryService } = require('../services/index');
class CategoryController {
    getAllCategories = async (req, res, next) => {
        try {
            const categories = await CategoryService.getAllCategories();
            res.json(categories);
        }
        catch (error) {
            console.log(error.message);
            next(error);
        }
    }

    getCategoryById = async (req, res, next) => {
        try {
            const categories = await CategoryService.getCategoryById(req.params.categoryId);
            res.json(categories);
        }
        catch (error) {
            console.log(error.message);
            next(error);
        }
    }

    createCategory = async (req, res, next) => {
        try {
            const { name, description, thumbnails } = req.body.category;
            const newestCategory = await CategoryService.createCategory(name, description, thumbnails);
            res.json(newestCategory);
        } catch (error) {
            next(error);
        }
    }

    updateCategory = async (req, res) => {
        try {
            const category = await CategoryService.updateCategory(req.params.id, req.body);
            res.status(200).json(category);
        } catch (error) {
            next(error)
        }
    }

    deleteCategory = async (req, res) => {
        try {
            await CategoryService.deleteCategory(req.params.id);
            res.status(204).json();
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CategoryController;
