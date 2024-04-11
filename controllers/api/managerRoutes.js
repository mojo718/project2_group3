const router = require('express').Router();
const winston = require('winston'); // Import Winston
const { Manager, Player, Lineup } = require('../../models');
const path = require('path')


// Winston logger configuration
const logsFolderPath = path.join(__dirname, '..', '..', 'logs'); // Adjusted path

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(logsFolderPath, 'Manager.log') }) // Log file in /logs folder
    ]
  });

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if a manager with the provided email exists
    const manager = await Manager.findOne({ where: { email } });
    if (!manager) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if the password is correct
    const isValidPassword = await manager.checkPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // If everything is correct, set the session and redirect to the profile page
    req.session.save(() => {
      req.session.logged_in = true;
      req.session.manager_id = manager.id;
      res.redirect('/profile');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    console.log('Received signup request:', req.body); // Log the received request body

    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name, email, password }); // Log missing fields
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if a manager with the provided email already exists
    const existingManager = await Manager.findOne({ where: { email } });
    if (existingManager) {
      console.log('Email is already in use:', email); // Log existing email
      return res.status(400).json({ message: 'Email is already in use.' });
    }

    // Create a new manager
    const manager = await Manager.create({ name, email, password });
    console.log('New manager created:', manager.toJSON()); // Log the newly created manager

    // If successfully created, set the session and redirect to the profile page
    req.session.save(() => {
      req.session.logged_in = true;
      req.session.manager_id = manager.id;
      console.log('Session saved:', req.session); // Log saved session
      res.redirect('/profile');
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
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