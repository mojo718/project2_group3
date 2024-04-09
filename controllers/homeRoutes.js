const router = require('express').Router();
const winston = require('winston'); // Import Winston
const { Project, User } = require('../models');
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
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const projects = projectData.map((project) => project.get({ plain: true }));

    res.render('homepage', { 
      projects, 
      logged_in: req.session.logged_in 
    });

   
    logger.info('Homepage rendered successfully');
  } catch (err) {
    res.status(500).json(err);

   
    logger.error(`Error occurred while rendering homepage: ${err}`);
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });

   
    logger.info(`Project with id ${req.params.id} rendered successfully`);
  } catch (err) {
    res.status(500).json(err);

    logger.error(`Error occurred while rendering project with id ${req.params.id}: ${err}`);
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
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
