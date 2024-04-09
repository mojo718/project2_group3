const router = require('express').Router();
const winston = require('winston'); // Import Winston
const { Manager, Player, Lineup } = require('../../models');

// Winston logger configuration
const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(logsFolderPath, 'Manager.log') }) // Log file in /logs folder
    ]
  });


router.post('/', async (req, res) => {
  try {
    const managerData = await Manager.create(req.body);
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
    const managerData = await Manager.findOne({ where: { email: req.body.email } });
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

router.delete('/:id', async (req, res) => {
  try {
    const manager = await Manager.findByPk(req.params.id, {
      include: [{ model: Player, model: Lineup }],
    });
    if (!manager) {
      res.status(404).json({ message: 'Manager not found' });
      return;
    }
    await manager.destroy();
    logger.info(`Manager with ID ${req.params.id} deleted successfully`);
    res.status(204).end(); 
  } catch (error) {
    logger.error(`Error occurred while deleting manager: ${error}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;