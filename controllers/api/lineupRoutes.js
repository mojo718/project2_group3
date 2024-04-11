const router = require('express').Router();
const winston = require('winston');
const { Lineup, Player } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');

// Constructed path to the logs folder
const logsFolderPath = path.join(__dirname, '..', '..', 'logs'); // Adjusted path

const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(logsFolderPath, 'lineup.log') }) // Log file in /logs folder
    ]
  });

router.post('/', withAuth, async (req, res) => {
    try {
        const newLineup = await Lineup.create({
            ...req.body,
            manager_id: req.session.manager_id,
        });
        res.status(200).json(newLineup);
        logger.info('Successfully created a new lineup');
    } catch (err) {
        res.status(400).json(err);
        logger.error(`Error occurred while creating a new lineup: ${err}`);
    }
});

router.put('/:id', withAuth, async (req, res) => {
    try {
        await Lineup.update(req.body, {
            where: {
                id: req.params.id,
                manager_id: req.session.manager_id,
            },
        });
        res.status(200).json();
        logger.info(`Successfully updated lineup with id ${req.params.id}`);
    } catch (err) {
        res.status(500).json(err);
        logger.error(`Error occurred while updating lineup with id ${req.params.id}: ${err}`);
    }
});

router.get('/', withAuth, async (req, res) => {
    try {
        const lineups = await Lineup.findAll({
            include: [{ model: Player, through: 'PlayerLineup' }],
            where: {
                manager_id: req.session.manager_id,
            },
          });
        res.status(200).json(lineups);
        logger.info('Successfully fetched all lineups');
    } catch (err) {
        res.status(500).json(err);
        logger.error(`Error occurred while fetching lineups: ${err}`);
    }
});

router.get('/:id', withAuth, async (req, res) => {
    try {
        const lineups = await Lineup.findByPK(req.params.id, {
            include: [{ model: Player, through: 'PlayerLineup' }],
            where: {
                id: req.params.id,
                manager_id: req.session.manager_id,
            },
          });
        if (!lineups) {
            res.status(404).json({ message: 'No lineup found with this id!' });
            return;
        }
        res.status(200).json(lineups);
        logger.info(`Successfully fetched lineup with id ${req.params.id}`);
    } catch (error) {
        res.status(500).json(err);
        logger.error(`Error occurred while fetching lineup with id ${req.params.id}: ${err}`);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const lineups = await Lineup.destroy({
            where: {
                id: req.params.id,
                manager_id: req.session.manager_id,
            }
        });
        if (!lineups) {
            res.status(404).json();
            return;
        }
        res.status(200).json(lineups);
        logger.info(`Successfully deleted lineup with id ${req.params.id}`);
    } catch (err) {
        res.status(500).json(err);
        logger.error(`Error occurred while deleting lineup with id ${req.params.id}: ${err}`);
    }
});

module.exports = router;

