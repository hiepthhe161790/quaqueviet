const { BrandService } = require('../services/index');

class BrandController {
    getAllBrands = async (req, res, next) => {
        try {
            const brands = await BrandService.getAllBrands();
            res.json(brands);
        }
        catch (error) {
            next(error);
        }
    }
    createBrand = async (req, res, next) => {
        try {
            const { name, description, thumbnails } = req.body.brand;
            const newestBrand = await BrandService.createBrand(name, description, thumbnails);
            res.json(newestBrand);
        }
        catch (error) {
            next(error);
        }
    }

    getBrandById = async (req, res, next) => {
        try {
            const brand = await BrandService.getBrandById(req.params.id);
            res.status(200).json(brand);
        } catch (error) {
            next(error);
        }
    }

    updateBrand = async (req, res, next) => {
        try {
            const brand = await BrandService.updateBrand(req.params.id, req.body);
            res.status(200).json(brand);
        } catch (error) {
            next(error);
        }
    }

    deleteBrand = async (req, res, next) => {
        try {
            await BrandService.deleteBrand(req.params.id);
            res.status(204).json();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BrandController;