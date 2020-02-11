var BinanceClient = require("../binance/binanceClient")
var Constant = require('./constant')

class AverageDifferenceStrategy {
    constructor(){
        this.binanceClient = new BinanceClient()
        this.prevState = Constant.FIVE_IDLE
    }
    async GetDecision(){
        // todo: pass symbol as a variable 
        const currentPrice = await this.binanceClient.GetCurrentPrice("BNBBTC")
        const movingAvg = await this.binanceClient.GetMovingAvg(Constant.CANDLE_INTERVAL_AVG_DIFF)
        const diff = Math.abs(movingAvg[0] - movingAvg[1]) - currentPrice * Constant.TRANSACTION_FEE
        // console.log(this.prevState)
        // console.log(movingAvg)
        if (this.prevState === Constant.FIVE_IDLE) {
            if (movingAvg[0] > movingAvg[1]){
                this.prevState = Constant.FIVE_BIG
                return Constant.STRATEGY_HOLD
            }
            else if (movingAvg[0] < movingAvg[1]){
                this.prevState = Constant.FIVE_SMALL
                return Constant.STRATEGY_HOLD
            }
            else{
                return Constant.STRATEGY_HOLD
            }
        }
        else{
            if (this.prevState === Constant.FIVE_BIG){
                // 5 cross 25 from top
                if (movingAvg[0] < movingAvg[1]){
                    this.prevState = Constant.FIVE_SMALL
                    if (diff > 0) {
                        return Constant.STRATEGY_SELL
                    }
                    else {
                        return Constant.STRATEGY_HOLD
                    }
                }
                // same trend
                else{
                    return Constant.STRATEGY_HOLD
                }
            }
            else if (this.prevState === Constant.FIVE_SMALL){
                // 5 cross 25 from bottom
                if (movingAvg[0] > movingAvg[1]){
                    this.prevState = Constant.FIVE_BIG
                    if (diff > 0) {
                        return Constant.STRATEGY_BUY
                    }
                    else {
                        return Constant.STRATEGY_HOLD
                    }
                }
                // same trend
                else{
                    return Constant.STRATEGY_HOLD
                }
            }
        }
    }
}
module.exports = AverageDifferenceStrategy;