const router = require('express').Router();
const winston = require('winston');
const { Lineup, Player, Manager } = require('../../models');
const withAuth = require('../../utils/auth');
const path = require('path');

const logsFolderPath = path.join(__dirname, '..', '..', 'logs');
const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: path.join(logsFolderPath, 'lineup.log') })
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
        res.status(400).json({ error: err.message }); // Sending error message in response
        logger.error(`Error occurred while creating a new lineup: ${err.message}`);
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
        res.status(204).json(); // Changed to 204 (No Content)
        logger.info(`Successfully updated lineup with id ${req.params.id}`);
    } catch (err) {
        res.status(500).json({ error: err.message });
        logger.error(`Error occurred while updating lineup with id ${req.params.id}: ${err.message}`);
    }
});

router.get('/', withAuth, async (req, res) => {
    try {
        const lineups = await Lineup.findAll({
            include: [
                { model: Player, attributes: ['name'], through: 'PlayerLineup' },
                { model: Manager, attributes: ['name'] }, 
            ],
            where: {
                manager_id: req.session.manager_id,
            },
        });
        res.status(200).json(lineups);
        logger.info('Successfully fetched all lineups');
    } catch (err) {
        res.status(500).json({ error: err.message });
        logger.error(`Error occurred while fetching lineups: ${err.message}`);
    }
});

router.get('/:id', withAuth, async (req, res) => {
    try {
        const lineup = await Lineup.findByPk(req.params.id, {
            include: [
                { model: Player, attributes: ['name'], through: 'PlayerLineup' },
                { model: Manager, attributes: ['name'] }, 
            ],
        });
        if (!lineup || lineup.manager_id !== req.session.manager_id) {
            res.status(404).json({ message: 'No lineup found with this id!' });
            return;
        }
        res.status(200).json(lineup);
        logger.info(`Successfully fetched lineup with id ${req.params.id}`);
    } catch (err) {
        res.status(500).json({ error: err.message });
        logger.error(`Error occurred while fetching lineup with id ${req.params.id}: ${err.message}`);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deletedCount = await Lineup.destroy({
            where: {
                id: req.params.id,
                manager_id: req.session.manager_id,
            }
        });
        if (deletedCount === 0) {
            res.status(404).json({ message: 'No lineup found with this id!' });
            return;
        }
        res.status(204).json();
        logger.info(`Successfully deleted lineup with id ${req.params.id}`);
    } catch (err) {
        res.status(500).json({ error: err.message });
        logger.error(`Error occurred while deleting lineup with id ${req.params.id}: ${err.message}`);
    }
});

module.exports = router;


