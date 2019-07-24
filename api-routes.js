let router = require('express').Router();

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to CryptoTrade API',
    });
});

var taskController = require('./taskController');

router.use('/task', taskController);

module.exports = router;