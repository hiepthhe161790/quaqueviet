const express = require('express');
const router = express.Router();
const { CategoryController } = require('../../../controllers/index');

/**
 * Định nghĩa các router ở đây theo feature
 * router.get('<router>', CategoryController.<Method>);
 * router.post('<router>', CategoryController.<Method>);
 * VD: router.get('/view-all-category')
 */

router.get('/', CategoryController.getAllCategories);
router.post('/', CategoryController.createCategory);
router.get('/:id', CategoryController.getCategoryById);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;