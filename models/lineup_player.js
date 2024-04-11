const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class LineupPlayer extends Model {}

LineupPlayer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    lineup_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lineup',
        key: 'id',
      }
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'player',
        key: 'id',
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'lineup_player',
  }
);

module.exports = LineupPlayer;
