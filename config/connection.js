const Sequelize = require('sequelize');
require('dotenv').config();
const winston = require('winston');
const path = require('path');

// Construct the path to the logs folder
const logsFolderPath = path.join(__dirname, '..', 'logs');

// Configure Winston logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsFolderPath, 'sequelize.log') }) // Log file in /logs folder
  ]
});

// Create Sequelize instance using the ClearDB database URL
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
  dialect: 'mysql',
  logging: (msg) => logger.info(msg) // Use Winston logger for Sequelize logging
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;

