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






class init{
    constructor(){
        print("successfully initialized init state!");
    };

    static goIdle(){
        
    };  
};

class idle{
    constructor(){

    };

    static goRunAlgo(){

    };
}

class runAlgo{
    constructor(){

    };

    // get data every 5 minutes
    static getData(){
        while(1){
            // call api

            sleeep(300000);
        }
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