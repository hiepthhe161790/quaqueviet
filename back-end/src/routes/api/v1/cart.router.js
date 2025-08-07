const express = require('express');
const router = express.Router();
const { CartController } = require('../../../controllers/index');

/**
 * Định nghĩa các router ở đây theo feature
 * router.get('<router>', CartController.<Method>);
 * router.post('<router>', CartController.<Method>);
 * VD: router.get('/view-personal-shopping-cart')
 */



// http://localhost:3333/api/v1/cart/add-to-cart
router.post('/add-to-cart', CartController.addToCart);

// http://localhost:3333/api/v1/cart/update-card
router.put('/update', CartController.updateCart);

// http://localhost:3333/api/v1/cart/remove-card
router.delete('/remove', CartController.removeFromCart);

// http://localhost:3333/api/v1/cart/:userId
router.get('/:userId', CartController.getCartById);
module.exports = router;