let router = require('express').Router();

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to CryptoTrade API',
    });
});

// var taskController = require('./taskController');

// router.use('/task', taskController);

var actionController = require('./action/actionController');

router.use('/action', actionController);

module.exports = router;