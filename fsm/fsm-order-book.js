const { A,B, USDT, Strategy_2_Pulling_Interval } = require('../fsm/constant');
const BinanceClient = require("../binance/binanceClient");
const Sleep = require('system-sleep');

class OrderBookStrategy {
    constructor() {
        console.log("Strategy 2 is initialized.");
        this.balanceThereshold = 0.1
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
        console.log("Balance_A_USDT is: ", this.Balance_A_USDT );
        console.log("Balance_B_USDT is: ", this.Balance_B_USDT);
        this.Balance_sum_USDT = this.Balance_A_USDT + this.Balance_B_USDT
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
            // try {
            //     setTimeout(() => {
            //         console.log("iteration number ", count);
            //         count++;
        
            //         // check balance before run algorithm
            //         if(this.checkBalance() == false){
            //             console.log("There is something wrong with balance, exiting...");
            //             throw "checkBalance failed";
            //         }
        
            //         // run strategy algorithm
            //         this.algo();  
            //     }, 10000);
            // } catch (e) {
            //     break;
            // } 
        }
    }

    // core algorithm
    async algo(){
        const orderBook = await this.binanceClient.GetOrderBook(A+B);
        const currentPrice = await this.binanceClient.GetCurrentPrice(A+B);
        //console.log("orderbook ", orderBook);
        this.state = this.updateState();
        // up 80 BNB
        // down 80 BNB
        const buyPrice = this.getBuyPrice(orderBook.bids);
        const sellPrice = this.getSellPrice(orderBook.asks);
        console.log("buyPrice is: ", buyPrice);
        console.log("sellPrice is: ", sellPrice);
        console.log("currentPrice is: ", currentPrice);
        console.log("gap ratio is ", (sellPrice - buyPrice) / currentPrice)
        if((sellPrice - buyPrice) / currentPrice < 0.75/1000) {
            console.log("in algo, gap is not big enough");
            return;
        }

        switch (this.state) {
            case "BUY_SELL":
                console.log("in BUY_SELL state");
                await this.binanceClient.PlaceSellOrder(A+B, this.Balance_A * 0.99, sellPrice);
                await this.binanceClient.PlaceBuyOrder(A+B, this.Balance_B / currentPrice * 0.99, buyPrice);
            case "BUY":
                console.log("in BUY state");
                await this.binanceClient.PlaceBuyOrder(A+B, this.Balance_B / currentPrice * 0.5, buyPrice);
            case "SELL":
                console.log("in SELL state");
                await this.binanceClient.PlaceSellOrder(A+B, this.Balance_A * 0.5 , sellPrice);
            default:
                console.log("in OTHER state");
        }
    }

    updateState(){
        if(this.Balance_A_USDT / this.Balance_sum_USDT < this.balanceThereshold){
            this.state = "BUY";
        } else if(this.Balance_A_USDT / this.Balance_sum_USDT > 1 - this.balanceThereshold){
            this.state = "SELL";
        } else {
            this.state = "BUY_SELL";
        }
        console.log("state: " + this.state);
    }
    
    getBuyPrice(bids){
        let sum = 0;
        for(let i = 0; i < bids.length; i++){
            sum += Number(bids[i].quantity);
            // 80 and 0.0000001 is temporary
            if(sum >= 80) {
                return (Number(bids[i].price) + 0.0000001).toString();
            }
        }
        console.log("error, getBuyPrice failed, sum is: ", sum);
    }

    getSellPrice(asks){
        let sum = 0;
        for(let i = 0; i < asks.length; i++){
            sum += Number(asks[i].quantity);
            if(sum >= 80) {
                return (Number(asks[i].price) - 0.0000001).toString();
            }
        }
        console.log("error, getSellPrice failed, sum is: ", sum);
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