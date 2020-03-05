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
const { Action_Interval } = require('../fsm/constant');

let movingAverageStrategy = new MovingAverageStrategy();

class MAStrategy{
    constructor(){
        console.log("Strategy 1 is initialized.");
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

    run(decision){
        
        if(decision == STRATEGY_HOLD){
            console.log('hold');
        }else if(decision == STRATEGY_SELL){
            console.log('sell');
        }else if(decision == STRATEGY_BUY){
            console.log('buy');
        }
        
    }

}

module.exports = MAStrategy;