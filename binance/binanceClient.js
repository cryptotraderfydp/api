const Binance = require('binance-api-node').default
var Constant = require('./constant')
var StrategyConstant = require('../strategy/constant')


class BinanceClient {
    constructor(){
        this.binanceClient = new Binance({
            apiKey:Constant.API_KEY,
            apiSecret:Constant.SECRET_KEY,
            options: {
                    adjustForTimeDifference: true,
                    'recvWindow': 10000000, 
            }
        })
    }
    async GetMovingAvg(candleInterval){
        var avgFiveMin = 0
        if (candleInterval == StrategyConstant.CANDLE_INTERVAL_MOVING_AVG){
            var avgFiveMinRequest = await this.binanceClient.avgPrice({ symbol: Constant.SYMBOL })
            avgFiveMin = parseFloat(avgFiveMinRequest.price)
        }
        // console.log(await this.binanceClient.avgPrice({ symbol: Constant.SYMBOL }))
        // console.log(await this.binanceClient.candles({ symbol: 'BNBBTC', interval: "1m", limit: 5 }))
        const candleList = await this.binanceClient.candles({ symbol: Constant.SYMBOL, interval: candleInterval, limit: Constant.CANDLE_LIMIT })
        let sumFive = 0
        let sumTwentyFive = 0
        for (var i=0; i<Constant.CANDLE_LIMIT; i++){
            if (candleInterval == StrategyConstant.CANDLE_INTERVAL_AVG_DIFF){
                if(i < 5){
                    sumFive += parseFloat(candleList[i].close)
                }
            }
            sumTwentyFive += parseFloat(candleList[i].close)
        }
        if (candleInterval == StrategyConstant.CANDLE_INTERVAL_AVG_DIFF){
            avgFiveMin = sumFive / 5
        }
        let avgTwentyFive = sumTwentyFive / Constant.CANDLE_LIMIT

        // console.log("avg 5: "+avgFiveMin)
        // console.log("avg 25: "+avgTwentyFive)
        return [avgFiveMin, avgTwentyFive]
    }
    async GetCurrentPrice(){
        const lastCandle = await this.binanceClient.candles({ symbol: Constant.SYMBOL, interval: "1m", limit: 1 })
        return parseFloat(lastCandle[0].close)
    }
    async GetOrderBook(symbol){
        const orderBook = await this.binanceClient.book({ symbol: symbol, limit: Constant.ORDER_BOOK_LIMIT})
        return orderBook
    }
    async PlaceBuyOrder(symbol, quantity, price){
        const orderResult = await this.binanceClient.order({ symbol: symbol, side: Constant.ORDER_BUY, quantity: quantity, price: price })
        return orderResult
    }
    async PlaceSellOrder(symbol, quantity, price){
        const orderResult = await this.binanceClient.order({ symbol: symbol, side: Constant.ORDER_SELL, quantity: quantity, price: price })
        return orderResult
    }
    async GetCurrentUSDTPrice(symbol){
        const lastCandle = await this.binanceClient.candles({ symbol: symbol+"USDT", interval: "1m", limit: 1 })
        return parseFloat(lastCandle[0].close)
    }
    async PlaceMarketBuyOrder(symbol, quantity){
        const orderResult = await this.binanceClient.order({ symbol: symbol, type: 'MARKET', side: Constant.ORDER_BUY, quantity: quantity})
        return orderResult
    }
    async PlaceMarketSellOrder(symbol, quantity){
        const orderResult = await this.binanceClient.order({ symbol: symbol, type: 'MARKET', side: Constant.ORDER_SELL, quantity: quantity })
        return orderResult
    }
    async GetOrder(symbol, orderId){
        const order = await this.binanceClient.getOrder({ symbol: symbol, orderId: orderId })
        return order
    }
    async CancelOrder(symbol, orderId){
        const order = await this.binanceClient.cancelOrder({ symbol: symbol, orderId: orderId })
        return order
    }
    async GetAllOrders(symbol){
        const orders = await this.binanceClient.allOrders({ symbol: symbol })
        return orders
    }
    async GetAccountInfo(){
        const info = await this.binanceClient.accountInfo();
        return info
    }
}

module.exports = BinanceClient;