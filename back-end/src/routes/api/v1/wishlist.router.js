const express = require('express');
const router = express.Router();
const { wishlistController } = require('../../../controllers/index');

/**
 * Định nghĩa các router ở đây theo feature
 * router.get('<router>', wishlistController.<Method>);
 * router.post('<router>', wishlistController.<Method>);
 * VD: router.get('/view-all-wishlist')
 */
// http://localhost:3333/api/v1/wishlist/add-to-wishlist
router.post('/add-to-wishlist', wishlistController.addToWishlist);

// http://localhost:3333/api/v1/wishlist/remove-wishlist
router.delete('/remove', wishlistController.removeFromwishlist);

// http://localhost:3333/api/v1/wishlist/:userId
router.get('/:userId', wishlistController.getWishlist);

module.exports = router;