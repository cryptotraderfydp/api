/**
 * 
 *   ___________                 ____________                        _______________
 *  |           |   (start)     |           |     (trigger)         |               |
 *  |   init    |-------------> |   idle    |---------------------->|   run algo    |
 *  |           |<--------------|           |<----------------------|               |
 *  |___________|     (stop)    |___________|                       |_______________|
 *                                   /|\                                     |
 *                                    |------------------<-------------------|
 *                                    |                                      |
 *                                    |     |---------------<----------------|
 *                                    |    \|/                              \|/
 *                                   _|_____|______                   _______|______
 *                                  |              |                 |              |
 *                                  |              |                 |              |
 *                                  |      sell    |                 |    buy       |
 *                                  |              |                 |              |
 *                                  |______________|                 |______________|
 *                                                                 
 *                                                
 * 
 */

var sleep = require('system-sleep');
var MovingAverageStrategy = require('../strategy/movingAverageStrategy');
var {STRATEGY_BUY, STRATEGY_HOLD, STRATEGY_SELL} = require('../strategy/constant');
const { Action_Interval, Strategy_1_coin, Strategy_1_base } = require('../fsm/constant');
const BinanceClient = require("../binance/binanceClient");
let movingAverageStrategy = new MovingAverageStrategy();

class MAStrategy{
    constructor(){
        console.log("Strategy 1 is initialized.");
        this.binanceClient = new BinanceClient({
            options: {
                adjustForTimeDifference: true,
                'recvWindow': 10000000, 
            }
        });
        this.clock();
    };

    async clock(){
        console.log("clock function called");

        var count = 0

        while(1){
            count ++;
            let decision = await movingAverageStrategy.GetDecision();
            this.run(decision);
            sleep(Action_Interval);
        }
        
    }

    async run(decision){
        
        const accountInfo = await this.binanceClient.GetAccountInfo();
        const balances = accountInfo.balances;
        var balance_coin = 0;
        var balance_base = 0;
        balances.forEach(coin => {
            if(coin.asset == Strategy_1_coin){
                balance_coin = coin.free;
            }
            if(coin.asset == Strategy_1_base){
                balance_base =  coin.free;
            }
        });
        var price_coin = 0;
        price_coin = await this.binanceClient.GetCurrentUSDTPrice(Strategy_1_coin);
        console.log('current balance of', Strategy_1_coin ,' is:', balance_coin);
        console.log('current balance of', Strategy_1_base, ' is:', balance_base);
        console.log('current price of' , Strategy_1_coin, ' is:', price_coin);
        
        if(decision == STRATEGY_HOLD){
            console.log('hold');
        }else if(decision == STRATEGY_SELL){
            console.log('sell');
            if(balance_coin > balance_base){
                const quantity = this.changePrecision(balance_coin, 2);
                const sellResult = await this.binanceClient.PlaceMarketSellOrder(Strategy_1_coin+Strategy_1_base, quantity);
            }
        }else if(decision == STRATEGY_BUY){
            console.log('buy');
            if(balance_base > balance_coin){
                var quantity = balance_base/price_coin;
                quantity = this.changePrecision(quantity, 2);
                const buyResult = await this.binanceClient.PlaceMarketBuyOrder(Strategy_1_coin+Strategy_1_base, quantity);
            }
        }
        
    }

    changePrecision(price, digit){
        return Math.floor(Number(price) * Math.pow(10, digit)) /  Math.pow(10, digit);
    }

}

module.exports = MAStrategy;