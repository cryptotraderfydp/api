const Binance = require('binance-api-node').default
var Constant = require('./constant')


class BinanceClient {
    constructor(){
        this.binanceClient = Binance({
            apiKey:Constant.API_KEY,
            apiSecret:Constant.SECRET_KEY,
        })
    }
    async GetMovingAvg(){
        const avgFiveMinRequest = await this.binanceClient.avgPrice({ symbol: Constant.SYMBOL })
        const avgFiveMin = parseFloat(avgFiveMinRequest.price)
        // console.log(await this.binanceClient.avgPrice({ symbol: Constant.SYMBOL }))
        // console.log(await this.binanceClient.candles({ symbol: 'BNBBTC', interval: "1m", limit: 5 }))
        const candlieList = await this.binanceClient.candles({ symbol: Constant.SYMBOL, interval: Constant.CANDLE_INTERVAL, limit: Constant.CANDLE_LIMIT })
        // let sumFive = 0
        let sumTwentyFive = 0
        for (var i=0; i<25; i++){
            // if(i < 5){
            //     sumFive += parseFloat(candlieList[i].close)
            // }
            sumTwentyFive += parseFloat(candlieList[i].close)
        }
        // let avgFiveMin = sumFive / 5
        let avgTwentyFive = sumTwentyFive / 25

        // console.log("avg 5: "+avgFiveMin)
        // console.log("avg 25: "+avgTwentyFive)
        return [avgFiveMin, avgTwentyFive]
    }
}

module.exports = BinanceClient;