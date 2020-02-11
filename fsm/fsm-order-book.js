const { A,B, USDT, Strategy_2_Pulling_Interval } = require('../fsm/constant');
const BinanceClient = require("../binance/binanceClient");
const Sleep = require('system-sleep');

class OrderBookStrategy {
    constructor() {
        console.log("Strategy 2 is initialized.");
        this.balanceThereshold = 0.4
        this.state = "BUY_SELL" // "BUY_SELL" "BUY" "SELL" 
        this.binanceClient = new BinanceClient();
        this.Balance_A = 0;
        this.Balance_B = 0;
        this.A_USDT_price = 0;
        this.B_USDT_price = 0;
        this.Balance_A_USDT = 0;
        this.Balance_B_USDT = 0;
        this.Balance_sum_USDT = 0;
        this.buyOrderId = 0;
        this.sellOrderId = 0;
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

        this.A_USDT_price = await this.binanceClient.GetCurrentUSDTPrice(A);
        this.B_USDT_price = await this.binanceClient.GetCurrentUSDTPrice(B);

        console.log("this.A_USDT_price is: ", this.A_USDT_price);
        console.log("this.B_USDT_price is: ", this.B_USDT_price);

        this.Balance_A_USDT = this.Balance_A * this.A_USDT_price;
        this.Balance_B_USDT = this.Balance_B * this.B_USDT_price;
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
            console.log("\n \n \n");
            count++;

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
        await this.getCurrentBalance();
        const orderBook = await this.binanceClient.GetOrderBook(A+B);
        const currentPrice = await this.binanceClient.GetCurrentPrice(A+B);
        // const orders = await this.binanceClient.GetOrder(A+B, 329766180);
    
        // console.log("order is ", orders);
        //console.log("orderbook ", orderBook);
        
        this.updateState();
        // up 80 BNB
        // down 80 BNB
        const buyPrice = this.getBuyPrice(orderBook.bids);
        const sellPrice = this.getSellPrice(orderBook.asks);
        console.log("buyPrice is: ", buyPrice);
        console.log("sellPrice is: ", sellPrice);
        console.log("currentPrice is: ", currentPrice);
        console.log("gap ratio is ", (sellPrice - buyPrice) / currentPrice)
        if((sellPrice - buyPrice) / currentPrice < 0.9/1000) {
            console.log("in algo, gap is not big enough");
            return;
        }
        // const testOrderQuantity = this.changePrecision(this.Balance_A, 2);
        // console.log("testOrderQuantity", testOrderQuantity);
        // const orderResult = await this.binanceClient.PlaceSellOrder(A+B, testOrderQuantity, sellPrice);
        // console.log("orderResult", orderResult);
        const allOrders = await this.binanceClient.GetAllOrders(A+B);
        const leftoverOrders = allOrders.filter((order) => order.status === "NEW" || order.status === "PARTIALLY_FILLED");
        console.log("this.buyOrderId", this.buyOrderId);
        console.log("this.sellOrderId", this.sellOrderId);
        console.log("leftoverOrders: ", leftoverOrders);
        
        Promise.all(leftoverOrders.map(order => {
            return this.binanceClient.CancelOrder(A+B, order.orderId);
        })).then(() =>console.log("all leftover orders are canceled"));
        // if(this.buyOrderId){
        //     await this.binanceClient.CancelOrder(A+B, this.buyOrderId);
        // }
        // if(this.sellOrderId){
        //     await this.binanceClient.CancelOrder(A+B, this.sellOrderId);
        // }

        

        switch (this.state) {
            case "BUY_SELL":
                console.log("in BUY_SELL state");
                const sellQuantity_BS = this.changePrecision(this.Balance_A * 0.99, 2);
                const buyQuantity_BS = this.changePrecision(this.Balance_B / currentPrice * 0.99, 2);
                console.log("placing order, sellQuantity_BS is: ", sellQuantity_BS);
                console.log("placing order, buyQuantity_BS is: ", buyQuantity_BS);
                const sellOrderResult_BS = await this.binanceClient.PlaceSellOrder(A+B, sellQuantity_BS, sellPrice);
                const buyOrderResult_BS = await this.binanceClient.PlaceBuyOrder(A+B, buyQuantity_BS, buyPrice);
                this.sellOrderId = sellOrderResult_BS.orderId;
                this.buyOrderId = buyOrderResult_BS.orderId;
                break;
            case "BUY":
                console.log("in BUY state");
                const buyQuantity_BUY = this.changePrecision(this.Balance_sum_USDT / this.A_USDT_price / 2 - this.Balance_A, 2);
                console.log("placing order, buyQuantity_BUY is: ", buyQuantity_BUY);
                const buyOrderResult_B = await this.binanceClient.PlaceBuyOrder(A+B, buyQuantity_BUY, buyPrice);
                this.sellOrderId = 0;
                this.buyOrderId = buyOrderResult_B.orderId;
                break;
            case "SELL":
                console.log("in SELL state");
                const sellQuantity_SELL = this.changePrecision(this.Balance_A - this.Balance_sum_USDT / this.A_USDT_price / 2, 2);
                console.log("placing order, sellQuantity_SELL is: ", sellQuantity_SELL);
                const sellOrderResult_S = await this.binanceClient.PlaceSellOrder(A+B, sellQuantity_SELL, sellPrice);
                this.sellOrderId = sellOrderResult_S.orderId;
                this.buyOrderId = 0;
                break;
            default:
                this.buyOrderId = 0;
                this.sellOrderId = 0;
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
        if(this.Balance_sum_USDT < 1) {
            this.state = "OTHER";
        }
        console.log("state: " + this.state);
    }
    
    getBuyPrice(bids){
        let sum = 0;
        for(let i = 0; i < bids.length; i++){
            sum += Number(bids[i].quantity);
            // 150 and 0.0000001 is temporary
            if(sum >= 150) {
                const edgePrice = this.changePrecision(Number(bids[i].price) + 0.0000001, 7);
                return edgePrice.toString();
            }
        }
        console.log("error, getBuyPrice failed, sum is: ", sum);
    }

    getSellPrice(asks){
        let sum = 0;
        for(let i = 0; i < asks.length; i++){
            sum += Number(asks[i].quantity);
            if(sum >= 150) {
                const edgePrice = this.changePrecision(Number(asks[i].price) - 0.0000001, 7);
                return edgePrice.toString();
            }
        }
        console.log("error, getSellPrice failed, sum is: ", sum);
    }

    changePrecision(price, digit){
        return Math.floor(Number(price) * Math.pow(10, digit)) /  Math.pow(10, digit);
    }
}

module.exports = OrderBookStrategy;