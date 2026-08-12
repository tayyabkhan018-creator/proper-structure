const express = require('express');
const userRoutes = require('./user.routes');

/**
 * Central place to mount every resource's router.
 * Adding a new resource (e.g. products) later is just:
 *   router.use('/products', productRoutes);
 */
const router = express.Router();

router.use('/users', userRoutes);

module.exports = router;
