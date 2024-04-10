const sequelize = require('../config/connection');
const { Manager, Player, Lineup } = require('../models');

const managerData = require('./managerData.json');
const playerData = require('./playerData.json');
const lineupData = require('./lineupData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  try {
    // Insert manager data
    const managers = await Manager.bulkCreate(managerData);
    console.log(`${managers.length} managers inserted.`);

    // Insert player data
    const players = await Player.bulkCreate(playerData);
    console.log(`${players.length} players inserted.`);

    // Insert lineup data
    for (const lineup of lineupData) {
      const createdLineup = await Lineup.create(lineup);
      console.log(`Lineup created with ID: ${createdLineup.id}`);
      // Associate players with the lineup
      await createdLineup.setPlayers(lineup.players);
      console.log(`Players associated with lineup.`);
    }

    console.log('Seeding completed.');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
};

seedDatabase();
