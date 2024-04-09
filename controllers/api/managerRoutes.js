const router = require('express').Router();
const winston = require('winston'); // Import Winston
const { manager } = require('../../models');

// Winston logger configuration
const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(logsFolderPath, 'Manager.log') }) // Log file in /logs folder
    ]
  });


router.post('/', async (req, res) => {
  try {
    const managerData = await manager.create(req.body);

    req.session.save(() => {
      req.session.manager_id = managerData.id;
      req.session.logged_in = true;

      res.status(200).json(managerData);
    });

   
    logger.info('New manager created successfully');
  } catch (err) {
    res.status(400).json(err);

   
    logger.error(`Error occurred while creating a new manager: ${err}`);
  }
});

router.post('/login', async (req, res) => {
  try {
    const managerData = await manager.findOne({ where: { email: req.body.email } });

    if (!managerData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await managerData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.manager_id = managerData.id;
      req.session.logged_in = true;

      res.json({ manager: managerData, message: 'You are now logged in!' });
    });

   
    logger.info(`Manager ${managerData.email} logged in successfully`);
  } catch (err) {
    res.status(400).json(err);

   
    logger.error(`Error occurred while logging in: ${err}`);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }

 
  logger.info('Manager logged out successfully');
});

module.exports = router;
