const router = require('express').Router();
const managerRoutes = require('./managerRoutes');
const playerRoutes = require('./playerRoutes');
const lineupRoutes = require('./lineupRoutes');


router.use('/managers', managerRoutes);
router.use('/players', playerRoutes);
router.use('/lineups', lineupRoutes)

module.exports = router;
