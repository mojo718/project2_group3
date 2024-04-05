const router = require('express').Router();
const managerRoutes = require('./managerRoutes');
const playerRoutes = require('.//managerRoutes');
const lineupRoutes = require('.//lineupRoutes');


router.use('/managers', managerRoutes);
router.use('/lineups', lineupRoutes);
router.use('/players', playerRoutes)

module.exports = router;
