const Brand = require('../models/brand.model');

class BrandService {
    getAllBrands = async () => {
        return await Brand.find({}); // truy xuất tới cơ sở dữ liệu
    }

    createBrand = async (name, description, thumbnails) => {
        const brand = new Brand({
            name,
            description,
            thumbnails
        })
        return await brand.save();
    }

    getBrandById = async (id) => {
        return await Brand.findById(id);
    }

    updateBrand = async (id, brandData) => {
        return await Brand.findByIdAndUpdate(id, brandData, { new: true });
    }

    deleteBrand = async (id) => {
        return await Brand.findByIdAndDelete(id);
    }
}

module.exports = new BrandService;