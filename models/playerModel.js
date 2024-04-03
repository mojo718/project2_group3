// Import Sequelize library
const { Sequelize, DataTypes } = require('sequelize');

// Create the Player model
module.exports = (sequelize) => {
  const Player = sequelize.define('Player', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Team_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    BattingAverage: {
      type: DataTypes.DECIMAL(5, 3),
      allowNull: false
    },
    HomeRuns: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Hits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    RBIS: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    // Other options, such as tableName, timestamps, etc., can be specified here
  });

  return Player;
};
