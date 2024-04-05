const router = require('express').Router();
const { Player } = require('../../models');


router.get('/', async (req, res) => {

    try {
        const players = await Player.findAll({
            include: [{ model: Player }]
        });
        res.status(200).json(players)
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    // find one player by its `id` value

    try {
        const players = await Player.findByPK(req.params.id, {
            include: [{ model, Player }]
        });
        //conditional statement - if players not found return 404 error
        if (!players) {
            res.status(404).json({ message: 'No player found with this id!' });
            return;
        }
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    // create a new player
    try {
        const players = await Player.create(req.body);
        res.status(200).json(players);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:id', async (req, res) => {
    // update a player by its `id` value
    Player.update(req.body, {
        where: {
            id: req.params.id,
        },
    })
    res.status(200).json()
});

router.delete('/:id', async (req, res) => {
    // delete a player by its `id` value
    try {
        const players = await Player.destroy({
            where: {
                id: req.params.id
            }
        });
        if (!players) {
            res.status(404).json()
            return;
        }
        res.status(200).json(players);
    } catch (err) {
        res.status(500).json.json(err);
    }
});

module.exports = router;