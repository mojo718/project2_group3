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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player3: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player4: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player5: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player6: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player7: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player8: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player9: {
      type: DataTypes.INTEGER,
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
