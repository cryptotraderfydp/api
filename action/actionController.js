var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

const Init = require('../fsm/fsm')

// var BinanceClient = require("../binance/binanceClient")
// var binanceClient = new BinanceClient()

router.use(express.json())

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

// function createNewTask(body){
//     var task = new Task();
//     task.user_id = body.user_id;
//     task.currency_pair = body.currency_pair;
//     task.risk_level = body.risk_level;
//     task.start_time = body.start_time;
//     task.end_time = body.end_time;
//     task. current_return = body.current_return;
//     task.max_return = body.max_return ? body.max_return : task.max_return;
//     return task;
// }

router.post('/start', function(req, res) {
    let init_satte =new Init();

    return res.status(200).json({
        message: 'start successfully'
    });
});

router.post('/stop', function(req, res) {
    return res.status(200).json({
        message: 'stop successfully'
    });
});

router.get('/test', function(req, res) {
    console.log("test")
    // binanceClient.GetOrderBook("WRXBTC").then(function(result){
    //     console.log(result)
    // })
    return res.status(200).json({
        message: 'test'
    });
});

module.exports = router;