const router = require('express').Router();
const winston = require('winston'); // Import Winston
const { Manager, Lineup, Player } = require('../models');
const withAuth = require('../utils/auth');
const path = require('path')

// Winston logger configuration
const logsFolderPath = path.join(__dirname, '..', 'logs'); // Adjusted path

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(logsFolderPath, 'homeRoutes.log') }) // Log file in /logs folder
    ]
  });
router.get('/', async (req, res) => {
  try {
    if( req.session.logged_in ){
    const lineupData = await Lineup.findAll({
      where: {
        manager_id: req.session.manager_id,
    },
    });
    const lineups = lineupData.map((lineup) => lineup.get({ plain: true }));
    res.render('homepage', {
      lineups, 
      logged_in: req.session.logged_in 
    });
    logger.info('Homepage rendered successfully')
    }

    logger.info('User not signed in, redirecting to login')
    res.render('login');
    
  } catch (err) {
    res.status(500).json(err);
    logger.error(`Error occurred while rendering home: ${err}`);
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    const managerData = await Manager.findByPk(req.session.manager_id, {
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

router.get('/lineup', withAuth, async (req, res) => {
  try {
    const playerData = await Player.findAll({
      where: {
        manager_id: req.session.manager_id
      },
    });

    const players = playerData.map((player) => player.get({ plain: true }));

    res.render('lineup', {
      ...players,
      logged_in: true
    });
    logger.info('Lineup Rendered Successfully');
  } catch (err) {
    res.status(500).json(err);
    logger.error(`Error occurred while rendering lineup: ${err}`);
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
