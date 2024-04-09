const router = require('express').Router();
const winston = require('winston'); // Import Winston
const { Player } = require('../../models');

// Winston logger configuration
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

router.post('/', async (req, res) => {
    try {
        const players = await Player.create(req.body);
        res.status(200).json(players);
        logger.info('Successfully created a new player');
    } catch (err) {
        res.status(400).json(err);
        logger.error(`Error occurred while creating a new player: ${err}`);
    }
});

router.put('/:id', async (req, res) => {
    try {
        await Player.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        res.status(200).json();
        logger.info(`Successfully updated player with id ${req.params.id}`);
    } catch (err) {
        res.status(500).json(err);
        logger.error(`Error occurred while updating player with id ${req.params.id}: ${err}`);
    }
});

router.get('/', async (req, res) => {
    try {
        const players = await Player.findAll();
        res.status(200).json(players);
        logger.info('Successfully fetched all players');
    } catch (err) {
        res.status(500).json(err);
        logger.error(`Error occurred while fetching players: ${err}`);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const players = await Playerlayer.findByPk(req.params.id);
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

router.delete('/:id', async (req, res) => {
    try {
        const players = await Player.destroy({
            where: {
                id: req.params.id
            }
        });
        if (!players) {
            res.status(404).json();
            return;
        }
        res.status(200).json(players);
        logger.info(`Successfully deleted player with id ${req.params.id}`);
    } catch (err) {
        res.status(500).json(err);
        logger.error(`Error occurred while deleting player with id ${req.params.id}: ${err}`);
    }
});

module.exports = router;