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
   player_name: {
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
