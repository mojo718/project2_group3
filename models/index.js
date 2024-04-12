const Manager = require('./Manager');
const Player = require('./Player');
const Lineup = require('./Lineup');

Manager.hasMany(Player, {
  foreignKey: 'manager_id',
  onDelete: 'CASCADE',
});

Player.belongsTo(Manager, {
  foreignKey: 'manager_id',
});

Manager.hasMany(Lineup, {
  foreignKey: 'manager_id',
  onDelete: 'CASCADE',
});

Lineup.belongsTo(Manager, {
  foreignKey: 'manager_id',
});

Player.belongsToMany(Lineup, { 
  through: 'LineupPlayer', 
  foreignKey: 'player_id' 
});

module.exports = { Manager, Player, Lineup };