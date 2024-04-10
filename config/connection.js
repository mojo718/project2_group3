const Sequelize = require('sequelize');
require('dotenv').config();
const winston = require('winston');
const path = require('path');

// Construct the path to the logs  folder
const logsFolderPath = path.join(__dirname, '..', 'logs'); 

// Configure Winston logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logsFolderPath, 'sequelize.log') }) // Log file in /logs folder
  ]
});

// Create Sequelize instance using the ClearDB database URL else use local DB
let sequelize;

if (process.env.CLEARDB_DATABASE_URL) {
  sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );
}
// Test the connection
sequelize.authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch(err => {
    logger.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;

