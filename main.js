const { SHA256 } = require("crypto-js");

class Block {
    constructor(timestamp, transaction, previousHash = "") {
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.hash = this.calculateHast();
        this.nonce = 0;
    }

    calculateHast() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlcok(difficulty){
        while(this.hash.substring(0 , difficulty)!== Array(difficulty +1).join("0")){
            this.nonce++;
            this.hash = this.calculateHast();
        }

        console.log("Blcok mined " + this.hash);
    }

}

class Transaction{
    constructor(from , to , amount){
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
        this.pendingTransaction = [];
        this.miningReward = 50;
    }

    createGenesisBlock() {
        return new Block("6/16/2021", "Genesis", "0");
    }

    latestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePedingTransaction(miningRewardAddress){
        let block = new Block(Date.now() , this.pendingTransaction);
        block.mineBlcok(this.difficulty);

        console.log("block mined " + block.hash);
        this.chain.push(block);

        this.pendingTransaction = [new Transaction(null , miningRewardAddress , this.miningReward)];
    }

    createTransaction(transaction){
        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const transc of block.transaction){
                if(transc.from === address)
                    balance -= transc.amount;
                
                if(transc.to === address)
                    balance += transc.amount;
            }
        }

        return balance;
    }

    validChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHast())
                return false

            if (currentBlock.previousHash !== previousBlock.hash)
                return false
        }
        return true;
    }
}

let kebabCoin = new Blockchain();

console.log("Mining block 1")
kebabCoin.minePedingTransaction('alex')

console.log("Mining block 2")
kebabCoin.minePedingTransaction('salut')

//console.log(JSON.stringify(kebabCoin , null , 4));
//console.log(kebabCoin.validChain())
