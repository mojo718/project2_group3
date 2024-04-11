const router = require('express').Router();
const winston = require('winston'); // Import Winston
const { Player } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path')

// Winston logger configuration
const logsFolderPath = path.join(__dirname, '..', '..', 'logs'); // Adjusted path

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(logsFolderPath, 'player.log') }) // Log file in /logs folder
    ]
  });

router.post('/', withAuth, async (req, res) => {
    try {
        const newPlayer = await Player.create({
            ...req.body,
            manager_id: req.session.manager_id,
        });
        res.status(200).json(newPlayer);
        logger.info('Successfully created a new player');
    } catch (err) {
        res.status(400).json(err);
        logger.error(`Error occurred while creating a new player: ${err}`);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        await Player.update(req.body, {
            where: {
                id: req.params.id,
                manager_id: req.session.manager_id,
            },
        });
        res.status(200).json();
        logger.info(`Successfully updated player with id ${req.params.id}`);
    } catch (err) {
        res.status(500).json(err);
        logger.error(`Error occurred while updating player with id ${req.params.id}: ${err}`);
    }
});

router.get('/', withAuth, async (req, res) => {
    try {
        const players = await Player.findAll({
            where: {
                manager_id: req.session.manager_id,
            },
        });
        res.status(200).json(players);
        logger.info('Successfully fetched all players');
    } catch (err) {
        res.status(500).json(err);
        logger.error(`Error occurred while fetching players: ${err}`);
    }
});

router.get('/:id', withAuth, async (req, res) => {
    try {
        const players = await Player.findByPk({
            where: {
                id: req.params.id,
                manager_id: req.session.manager_id,
            },
        });
        if (!players) {
            res.status(404).json({ message: 'No player found with this id!' });
            return;
        }
        res.status(200).json(players);
        logger.info(`Successfully fetched player with id ${req.params.id}`);
    } catch (err) {
        res.status(500).json(err);
        logger.error(`Error occurred while fetching player with id ${req.params.id}: ${err}`);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const player = await Player.destroy({
            where: {
                id: req.params.id,
                manager_id: req.session.manager_id,
            },
        });
        if (!players) {
            res.status(404).json();
            return;
        }
        res.status(200).json(player);
        logger.info(`Successfully deleted player with id ${req.params.id}`);
    } catch (err) {
        res.status(500).json(err);
        logger.error(`Error occurred while deleting player with id ${req.params.id}: ${err}`);
    }
});

module.exports = router;