const { A,B, Strategy_2_Pulling_Interval } = require('../fsm/constant');
const BinanceClient = require("../binance/binanceClient");
const Sleep = require('system-sleep');

class OrderBookStrategy {
    constructor() {
        console.log("Strategy 2 is initialized.");
        this.binanceClient = new BinanceClient();
        this.Balance_A = 0;
        this.Balance_B = 0;
        this.kickoff();
    };


    async kickoff(){
        //get current balance
        await this.getCurrentBalance();
        console.log("Current balance:", A, " has", this.Balance_A, ";", B, " has", this.Balance_B);
        this.idle();
    }

    // function to get the current balance of account
    async getCurrentBalance(){
        console.log("Current selected pair is: ", A, "and", B);
        const accountInfo = await await this.binanceClient.GetAccountInfo();
        const balances = accountInfo.balances;
        
        balances.forEach(coin => {
            if(coin.asset == A){
                this.Balance_A = coin.free;
            }
            if(coin.asset == B){
                this.Balance_B = coin.free;
            }
        });
    }

    // idle state
    idle(){
        console.log("Entered Idle state.");
        let count = 1;
        // run algo every 10 second
        while(1){
            console.log("iteration number ", count);
            count++;
            this.algo();  
            Sleep(Strategy_2_Pulling_Interval);
        }
    }

    // core algorithm
    async algo(){
        const orderBook = await this.binanceClient.GetOrderBook(B+A);
        //console.log("orderbook ", orderBook);
        const { buyA, sellA, buyVolumn, sellVolumn } = await this.getDecision(orderBook);

        
    }

    // TODO: return 
    async getDecision(orderBook){
        let buyA = false;
        let sellA = false;
    }

}

module.exports = OrderBookStrategy;