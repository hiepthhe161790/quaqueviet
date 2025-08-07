const express = require('express');
const router = express.Router();
const { BrandController } = require('../../../controllers/index');

/**
 * Định nghĩa các router ở đây theo feature
 * router.get('<router>', BrandController.<Method>);
 * router.post('<router>', BrandController.<Method>);
 * VD:
 */
router.get('/', BrandController.getAllBrands);
router.post('/', BrandController.createBrand);
router.get('/:id', BrandController.getBrandById);
router.put('/:id', BrandController.updateBrand);
router.delete('/:id', BrandController.deleteBrand);
module.exports = router;