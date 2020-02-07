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

            // check balance before run algorithm
            if(this.checkBalance() == false){
                console.log("There is something wrong with balance, exiting...");
                break;
            }

            // run strategy algorithm
            this.algo();  

            // sleep 
            Sleep(Strategy_2_Pulling_Interval);
        }
    }

    // core algorithm
    async algo(){
        const orderBook = await this.binanceClient.GetOrderBook(B+A);
        //console.log("orderbook ", orderBook);
        const { buyA, sellA, buyVolumn, sellVolumn } = await this.getDecision(orderBook);

        // if decision is not buy or sell, do nothing
        if(buyA == false && sellA == false){
            return;
        }

        // 100% A, 0% B, sell 50% A
        if(buyA == false && sellA == true){
            // TODO: transaction sell A
            // volumn is 0.5 * balanceA
            return;
        }

        // 0% A, 100% B, buy 50% A
        if(buyA == true && sellA == false){
            //TODO: transaction buy A
            // volumn is 0.5 * balanceB
            return;
        }

        // 50% A, 50%B, buy and sell A
        if(buyA == true && sellA == true){
            //TODO: transaction sell and buy A
            // volumn is 0.5 * balanceA
            return;
        }
        
    }

    // TODO: scan through order book and decide should we sell how many A and buy how many A
    async getDecision(orderBook){
        let buyA = false;
        let sellA = false;
        let priceA = 0;
        let priceB = 0;

        return { buyA, sellA, priceA, priceB };
    }

    // balance has to be one of the condition: (50% A, 50% B) (100%A, 0%B) (0%A, 100%B)
    // return correct if true else false
    checkBalance(){
        if(this.Balance_A==0){
            return true;
        }
        if(this.Balance_B==0){
            return true;
        }
        if(this.Balance_A==this.Balance_B){
            return true;
        }
        return false;
    }

}

module.exports = OrderBookStrategy;