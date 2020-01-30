// import Binance  from 'binance-api-node'
const Binance = require('binance-api-node').default
// var Binance = require('binance-api-node')
var Constant = require('./constant')


class BinanceClient {
    constructor(){
        this.binanceClient = Binance({
            apiKey:Constant.API_KEY,
            apiSecret:Constant.SECRET_KEY,
        })
    }
    async test(){
        console.log(await this.binanceClient.candles({ symbol: 'BNBBTC' }))
    }
}

module.exports = BinanceClient;