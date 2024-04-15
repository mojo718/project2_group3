const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Lineup extends Model {}

Lineup.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
   player1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player4: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player5: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player6: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player7: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player8: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player9: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'manager',
        key: 'id',
      }
    },
    game_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'lineup',
  }
);

module.exports = Lineup;
