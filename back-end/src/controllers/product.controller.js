const { ProductService } = require("../services/index");
const fs = require("fs");
const path = require("path");
class ProductController {
  /**
   * Method: Get
   * router(/get-all-products)
   */
  getAllProducts = async (req, res, next) => {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };
  getAlldDiscountSuggestions = async (req, res, next) => {
    try {
      const products = await ProductService.getAllDiscountSuggestions();
      // const products = await ProductService.updateRandomExpiryAndImportDateForProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };
  /**
   * Method: Get
   * router(/:productId)
   */
  getProductById = async (req, res, next) => {
    try {
      const products = await ProductService.getProductById(
        req.params.productId
      );
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getPaginatedProducts = async (req, res, next) => {
    try {
      const { page = 1, pageSize = 10, keywords = "", sortBy = "" } = req.query;
      const result = await ProductService.getPaginatedProducts(
        parseInt(page),
        parseInt(pageSize),
        keywords,
        sortBy
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getAllDeletedProducts = async (req, res, next) => {
    try {
      const result = await ProductService.getAllDeletedProducts();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  addProduct = async (req, res, next) => {
    try {
      const imageFiles = req.files;
      // Giới hạn dung lượng ảnh
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

      // Kiểm tra dung lượng ảnh
      if (imageFiles) {
        for (let file of imageFiles) {
          if (file.size > MAX_FILE_SIZE) {
            return res.status(400).json({
              message: `File ${file.originalname} exceeds the maximum size of 2MB.`,
            });
          }
        }
      }
      const {
        name,
        description,
        brand,
        category,
        specs,
        inStock,
        isAvailable,
        expiryDate,
        importDate,
      } = req.body;
      const newProduct = await ProductService.addProduct(
        name,
        description,
        brand,
        category,
        specs,
        inStock,
        isAvailable,
        imageFiles,
        expiryDate,
        importDate
      );
      res.json({
        success: true,
        message: "Add product successfully!",
        newProduct,
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const productId = req.params.id;
      const imageFiles = req.files;
      // Giới hạn dung lượng ảnh
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

      // Kiểm tra dung lượng ảnh
      if (imageFiles) {
        for (let file of imageFiles) {
          if (file.size > MAX_FILE_SIZE) {
            return res.status(400).json({
              message: `File ${file.originalname} exceeds the maximum size of 2MB.`,
            });
          }
        }
      }
      const {
        name,
        description,
        brand,
        category,
        specs,
        inStock,
        isAvailable,
        expiryDate,
        importDate,
      } = req.body;
      const newProductData = await ProductService.updateProduct(
        productId,
        name,
        description,
        brand,
        category,
        specs,
        inStock,
        isAvailable,
        imageFiles,
        expiryDate,
        importDate
      );
      res.json({
        success: true,
        message: "Update product successfully!",
        newProductData,
      });
    } catch (error) {
      next(error);
    }
  };

  getImage = (req, res, next) => {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, "../uploads", filename);
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.sendFile(imagePath);
    });
  };

  getProductsSortedByPriceAscending = async (req, res, next) => {
    try {
      const products = await ProductService.getProductsSortedByPriceAscending();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  getProductsSortedByPriceDescending = async (req, res, next) => {
    try {
      const products =
        await ProductService.getProductsSortedByPriceDescending();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  searchProducts = async (req, res, next) => {
    try {
      const { query } = req.query;
      const products = await ProductService.searchProducts(query);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  softDeleteProduct = async (req, res, next) => {
    try {
      const productId = req.params.id;
      const deletedProduct = await ProductService.softDeleteProduct(productId);
      return res.status(200).json({
        success: true,
        message: "Soft delete success!",
        product: deletedProduct,
      });
    } catch (error) {
      next(error);
    }
  };

  getNewArrivals = async (req, res, next) => {
    try {
      const products = await ProductService.getNewArrivals();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ProductController();
