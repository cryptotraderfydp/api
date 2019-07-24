var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Request = require("request");

const binance = require('node-binance-api');

router.use(express.json())
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

router.get('/getCoinPrice', function(req, res) {
    const coin_id = req.params.coin_id; 
    try {
        binance.prices(coin_id, (error, ticker) => {
            console.log("Price of ", coin_id , ":" , ticker.coin_id);
            res.json(ticker.coin_id)
            res.status(200);
          });
      } catch (error) {
        console.log(error);
        res.json(error);
        res.status(400);
      }
});


module.exports = router;
