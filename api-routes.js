let router = require('express').Router();

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to CryptoTrade API',
    });
});

var taskController = require('./taskController');
var daraWarehousing = require('./dataWarehousing');

router.use('/task', taskController);
router.use('/data', dataWarehousing);

module.exports = router;