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

class Init{
    constructor(){
        console.log("successfully initialized init state!");
        
        // TODO: go to idle at 整点
        this.goIdle();
    };

    goIdle(){
        let idle = new Idle();
    };  
};



class Idle{
    constructor(){
        console.log("successfully initialized idle state!");
        this.clock();
    };

    async clock(){
        console.log("clock function called");
        // TODO: call gorunalgo() every 1 min
        
        let runAlgo = new RunAlgo();
        

        var count = 0

        while(1){
            count ++;
            //let decision = runAlgo.run();
            let decision = await movingAverageStrategy.GetDecision();
            console.log("decision:", decision);
            console.log("count ",count);
            sleep(Action_Interval);
            var d = new Date();
            console.log(d.getTime());
        }
        
    }

}

class RunAlgo{
    constructor(){
        console.log("runalgo state initialized");
    };

    // trasition function
    run(){
        console.log("run");
       
        let decision = this.getDecision();
        
        if(decision == STRATEGY_HOLD){
            // decision is do nothing, go back to dile

        }else if(decision == STRATEGY_SELL){
            // decision is sell

        }else if(decision == STRATEGY_BUY){
            // decision is buy

        }
        
        
    }

    // get data every 5 minutes
    async getDecision(){
        let decision = await movingAverageStrategy.GetDecision();
        console.log("decision ", decision);
        return decision;
    };

    // find the intersetion
    static findInsersection(){


        // if buy

        buy.goBuy();

        // if sell

        sell.goSell();

    }

    static goBuy(){

    };

    static goSell(){

    }
}

class sell{
    constructor(){

    };

    static sell(){

    }
}

class buy{
    constructor(){

    };

    static buy(){

    }
}

module.exports = Init;