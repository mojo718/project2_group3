const Sequelize = require('sequelize');
require('dotenv').config();

// Create Sequelize instance using the ClearDB database URL
const sequelize = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
  dialect: 'mysql',
  logging: false // Optionally, set to false to disable logging
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
