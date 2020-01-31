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

    clock(){
        console.log("clock function called");
        // TODO: call gorunalgo() every 1 min
        
        while(1){
            this.goRunAlgo();
            sleep(1000); // 1 seconds
        }
        
    }

    goRunAlgo(){
        console.log("running algorithm");
        let runAlgo = new RunAlgo();
    };
}

class RunAlgo{
    constructor(){
        console.log("runalgo state initialized");
    };

    // get data every 5 minutes
    static getData(){
        // TODO: call api to gte data here
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