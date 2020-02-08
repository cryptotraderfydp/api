const { A,B, USDT, Strategy_2_Pulling_Interval } = require('../fsm/constant');
const BinanceClient = require("../binance/binanceClient");
const Sleep = require('system-sleep');

class OrderBookStrategy {
    constructor() {
        console.log("Strategy 2 is initialized.");
        this.balance_thereshold = 0.1
        this.state = "BUY_SELL" // "BUY_SELL" "BUY" "SELL" 
        this.binanceClient = new BinanceClient();
        this.Balance_A = 0;
        this.Balance_B = 0;
        this.Balance_A_USDT = 0;
        this.Balance_B_USDT = 0;
        this.Balance_sum_USDT = 0;
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
        const accountInfo = await this.binanceClient.GetAccountInfo();
        const balances = accountInfo.balances;
        
        balances.forEach(coin => {
            if(coin.asset == A){
                this.Balance_A = coin.free;
            }
            if(coin.asset == B){
                this.Balance_B = coin.free;
            }
        });
        console.log("this.Balance_A is: ", this.Balance_A);
        console.log("this.Balance_B is: ", this.Balance_B);

        const A_USDT_price = await this.binanceClient.GetCurrentUSDTPrice(A);
        const B_USDT_price = await this.binanceClient.GetCurrentUSDTPrice(B);

        console.log("A_USDT_price is: ", A_USDT_price);
        console.log("B_USDT_price is: ", B_USDT_price);

        this.Balance_A_USDT = this.Balance_A * A_USDT_price;
        this.Balance_B_USDT = this.Balance_B * B_USDT_price;
        this.Balance_sum_USDT = Balance_A_USDT + Balance_B_USDT
        console.log("sum usdt is: ", this.Balance_sum_USDT);
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
        this.state = this.updateState();
        const { buyA, sellA, buyVolumn, sellVolumn } = await this.getDecision(orderBook);

        switch (this.state) {
            case "BUY_SELL":
                console.log("in BUY_SELL state");
            case "BUY":
                console.log("in BUY state");
            case "SELL":
                console.log("in SELL state");
            default:
                console.log("in OTHER state");
        }
    }

    updateState(){
        if(this.Balance_A_USDT / this.Balance_sum_USDT < this.balance_thereshold){
            this.state = "BUY";
        } else if(this.Balance_A_USDT / this.Balance_sum_USDT > 1 - this.balance_thereshold){
            this.state = "SELL";
        } else {
            this.state = "BUY_SELL";
        }
    }

    // TODO: scan through order book and decide should we sell how many A and buy how many A
    async getDecision(orderBook){
        // console.log('orderBook is: ', orderBook);

        let buyA = this.Balance_A_USDT / this.Balance_sum_USDT < this.balance_thereshold;
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