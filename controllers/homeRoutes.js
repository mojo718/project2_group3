const router = require('express').Router();
const winston = require('winston'); // Import Winston
const { Manager, Lineup, Player } = require('../models');
const withAuth = require('../utils/auth');

// Winston logger configuration
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

router.get('/', async (req, res) => {
  try {
    res.render('homepage');
    logger.info('Homepage rendered successfully')
  } catch (err) {
    res.status(500).json(err);
    logger.error(`Error occurred while rendering home: ${err}`);
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    const managerData = await Manager.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Player, model: Lineup }],
    });

    const manager = managerData.get({ plain: true });

    res.render('profile', {
      ...manager,
      logged_in: true
    });
    logger.info('Profile rendered successfully');
  } catch (err) {
    res.status(500).json(err);
    logger.error(`Error occurred while rendering profile: ${err}`);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }
  
  res.render('login');
  logger.info('Login page rendered successfully');
});

module.exports = router;
