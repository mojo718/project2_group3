const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Player extends Model {}

Player.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Position: {
      type: DataTypes.STRING,
      allowNull: false
    },
    battingAverage: {
      type: DataTypes.DECIMAL(5, 3),
      allowNull: false
    },
    homeRuns: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Hits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rbis: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'manager',
        key: 'id',
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'player',
  }
);

module.exports = Player;






