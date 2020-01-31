var BinanceClient = require("../binance/binanceClient")
var Constant = require('./constant')

class MovingAverageStrategy {
    constructor(){
        this.binanceClient = new BinanceClient()
        this.prevState = Constant.FIVE_IDLE
    }
    async GetDecision(){
        const movingAvg = await this.binanceClient.GetMovingAvg()
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
                    return Constant.STRATEGY_SELL
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
                    return Constant.STRATEGY_BUY
                }
                // same trend
                else{
                    return Constant.STRATEGY_HOLD
                }
            }
        }
    }
}
module.exports = MovingAverageStrategy;