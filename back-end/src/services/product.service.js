const Product = require('../models/product.model');
const fs = require('fs');

class ProductService {
    async getProductsSortedByPriceAscending() {
        return await Product.find().sort({ price: 1 }).populate('brand').populate('category');
    }

    async getProductsSortedByPriceDescending() {
        return await Product.find().sort({ price: -1 }).populate('brand').populate('category');
    }
    async searchProducts(query) {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).populate('brand').populate('category');
        return products;
    }

    getProductById = async (productId) => {
        const product = await Product.findById(productId)
            .populate('brand', 'name')
            .populate('category', 'name')
            .lean();
        const result = {
            ...product,
            brand: product.brand.name,
            category: product.category.name,
        };
        return result;
    }

    async getAllProducts() {
        try {
            // Tự động ẩn sản phẩm hết hạn
            await Product.updateMany(
                { expiryDate: { $lte: new Date() }, isAvailable: true },
                { $set: { isAvailable: false } }
            );
            const products = await Product.find({
                isDeleted: false,
                $or: [
                    { expiryDate: { $gt: new Date() } },
                    { expiryDate: { $exists: false } },
                    { expiryDate: null }
                ]
            }).populate('brand').populate('category');
            return products;
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }
    
    getPaginatedProducts = async (page, pageSize, keywords, sortBy, importDateFrom, importDateTo) => {
        const skip = (page - 1) * pageSize;
        let filter = {
            isDeleted: false,
            // $or: [
            //     { expiryDate: { $gt: new Date() } },
            //     { expiryDate: { $exists: false } },
            //     { expiryDate: null }
            // ]
        };
        if (keywords) {
            const regex = new RegExp(keywords, 'i');
            filter.name = { $regex: regex };
        }
        // Lọc theo ngày nhập hàng nếu có
        if (importDateFrom || importDateTo) {
            filter.importDate = {};
            if (importDateFrom) filter.importDate.$gte = new Date(importDateFrom);
            if (importDateTo) filter.importDate.$lte = new Date(importDateTo);
        }
        let sort = {};
        switch (sortBy) {
            case 'name': {
                sort.name = 1;
                break;
            }
            case 'brand': {
                sort['brand.name'] = 1;
                break;
            }
            case "category": {
                sort['category.name'] = 1;
                break;
            }
            case "phoneNumber": {
                sort.phoneNumber = 1;
                break;
            }
            case "role": {
                sort.totalPrice = 1;
                break;
            }
            case "isVerified": {
                sort.isVerified = 1;
                break;
            }
            case "cost": {
                sort.cost = 1;
                break;
            }
            case "price": {
                sort.price = 1;
                break;
            }
        }
        // Tự động ẩn sản phẩm hết hạn
        await Product.updateMany(
            { expiryDate: { $lte: new Date() }, isAvailable: true },
            { $set: { isAvailable: false } }
        );
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .populate('brand')
            .populate('category')
            .lean();
        const totalProducts = await Product.countDocuments(filter);
        return {
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / pageSize),
            currentPage: page,
        };
    }

    getAllDeletedProducts = async () => {
        const products = await Product.find({ isDeleted: true })
            .populate('brand', 'name')
            .populate('category', 'name')
            .lean()
        const productsDetail = products.map(product => ({
            ...product,
            brand: product?.brand.name,
            category: product?.category.name,
        }));
        return {
            products: productsDetail,
        };
    };

    addProduct = async (name, description, brand, category, specs, inStock, isAvailable, imageFiles, expiryDate, importDate) => {
        const images = [];
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach(file => {
                images.push({
                    filename: file.filename,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size
                });
            });
        }
        if (typeof specs === 'string') {
            specs = JSON.parse(specs);
        }
        if (typeof inStock === 'string') {
            inStock = JSON.parse(inStock);
        }
        const newProduct = new Product({
            name,
            description,
            brand,
            category,
            specs,
            inStock,
            isAvailable,
            images,
            expiryDate,
            importDate
        });
        return await newProduct.save();
    }

    updateProduct = async (productId, name, description, brand, category, specs, inStock, isAvailable, imageFiles, expiryDate, importDate) => {
    const currentProduct = await Product.findById(productId);
    let images = currentProduct.images || [];

    if (imageFiles && imageFiles.length > 0) {
        // Xóa ảnh cũ trên ổ đĩa
        images.forEach(image => {
            try {
                fs.unlink(image.path, () => {});
            } catch (error) {
                console.log(error)
            }
        });
        // Thêm ảnh mới
        images = imageFiles.map(file => ({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
        }));
    }
    if (typeof specs === 'string') {
        specs = JSON.parse(specs);
    }
    if (typeof inStock === 'string') {
        inStock = JSON.parse(inStock);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, description, brand, category, specs, inStock, isAvailable, images, expiryDate, importDate },
        { new: true }
    );
    return updatedProduct;
}

    softDeleteProduct = async (productId) => {
        return await Product.updateOne({ _id: productId }, { $set: { isDeleted: true } }, { new: true });
    }

    async getNewArrivals() {
        // Tự động ẩn sản phẩm hết hạn
        await Product.updateMany(
            { expiryDate: { $lte: new Date() }, isAvailable: true },
            { $set: { isAvailable: false } }
        );
        return await Product.find({
            isDeleted: false,
            $or: [
                { expiryDate: { $gt: new Date() } },
                { expiryDate: { $exists: false } },
                { expiryDate: null }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('brand', 'name')
            .populate('category', 'name')
    }
    async getAllDiscountSuggestions() {
    try {
        // Tự động ẩn sản phẩm hết hạn
        await Product.updateMany(
            { expiryDate: { $lte: new Date() }, isAvailable: true },
            { $set: { isAvailable: false } }
        );

        const now = new Date();
        const soonExpireDate = new Date();
        soonExpireDate.setDate(now.getDate() + 7);

        // Lấy sản phẩm sắp hết hạn, chưa bị xóa và còn khả dụng
        const products = await Product.find({
            isDeleted: false,
            isAvailable: true,
            expiryDate: { $gt: now, $lte: soonExpireDate }
        })
        .populate('brand')
        .populate('category')
        .lean();
        const discountSuggestions = products.map(p => ({
            ...p,
            reason: 'Sản phẩm sắp hết hạn',
            suggestedDiscountPercent: 20
        }));

        return discountSuggestions;
    } catch (error) {
        throw new Error('Error fetching products: ' + error.message);
    }
}
async updateRandomExpiryAndImportDateForProducts() {
    const products = await Product.find({
        $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { importDate: { $exists: false } },
            { importDate: null }
        ]
    });

    for (const product of products) {
        let updated = false;

        // Nếu inStock rỗng hoặc không hợp lệ, thêm phần tử mẫu để tránh lỗi validate
        if (!Array.isArray(product.inStock) || product.inStock.length === 0 || !product.inStock[0].variant || !product.inStock[0].price) {
            product.inStock = [{
                variant: 'default',
                quantity: 0,
                price: 1000
            }];
            updated = true;
        }

        if (!product.expiryDate) {
            const daysToAdd = Math.floor(Math.random() * 30) + 1;
            product.expiryDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
            updated = true;
        }
        if (!product.importDate) {
            const daysAgo = Math.floor(Math.random() * 51) + 10;
            product.importDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
            updated = true;
        }
        if (updated) {
            await product.save();
        }
    }
    return { updatedCount: products.length };
}
}

module.exports = new ProductService;