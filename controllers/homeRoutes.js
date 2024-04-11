const router = require('express').Router();
const winston = require('winston');
const { Manager, Lineup, Player } = require('../models');
const withAuth = require('../utils/auth');
const path = require('path');

// Winston logger configuration
const logsFolderPath = path.join(__dirname, '..', 'logs');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsFolderPath, 'homeRoutes.log') })
  ]
});

router.get('/', async (req, res) => {
  try {
    if (req.session.logged_in) {
      const lineups = await Lineup.findAll({
        where: {
          manager_id: req.session.manager_id
        },
      });
      res.render('homepage', { lineups });
    } else {
      res.render('homepage');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    // Fetch manager data and players
    const managerData = await Manager.findByPk(req.session.manager_id, {
      attributes: { exclude: ['password'] },
      include: { model: Player },
    });
    
    // Render the 'profile' template passing in data
    res.render('profile', {
      isLoggedIn: true, // Assuming this variable determines if the user is logged in
      manager: managerData.toJSON(), // Assuming managerData is in the correct format
      players: managerData.players.map(player => player.toJSON()), // Assuming players are in the correct format
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json(err);
  }
});



router.get('/login', (req, res) => {
  res.render('login');
  logger.info('Login page rendered successfully');
});

module.exports = router;

