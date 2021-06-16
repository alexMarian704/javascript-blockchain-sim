const { SHA256 } = require("crypto-js");
const EC = require('elliptic').ec
const ec = new EC('secp256k1');

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

    hasValidTransactions(){
        for(const tx  of this.transaction){
            if(!tx.isValid())
                return false
        }
        return true;
    }

}

class Transaction{
    constructor(from , to , amount){
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    calculateHast(){
        return SHA256(this.from + this.to + this.amount).toString();
    }

    signTransaction(sigingKey){
        if(sigingKey.getPublic('hex') !== this.from)
            throw new Error('Error')

        const hashTx = this.calculateHast();
        const sig = sigingKey.sign(hashTx , 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.from === null) return true;

        if(!this.signature || this.signature.length ===0){
            throw new Error("No signature")
        }

        const publicKey = ec.keyFromPublic(this.from , 'hex')
        return publicKey.verify(this.calculateHast() , this.signature)
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransaction = [];
        this.miningReward = 100;
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

    addTransaction(transaction){
        if(!transaction.from || !transaction.to)
            throw new Error("Transaction failed")
        
        if(!transaction.isValid())
            throw new Error("Invalid transaction")    

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

            if(!currentBlock.hasValidTransactions())
                return false

            if (currentBlock.hash !== currentBlock.calculateHast())
                return false

            if (currentBlock.previousHash !== previousBlock.hash)
                return false
        }
        return true;
    }
}

let kebabCoin = new Blockchain();
const myKey = ec.keyFromPrivate('348c45c37381511d7769c5304b8a1ef3950bedbbd5b025a58c7b0b348bc02fcf')
const myWalletAddress = myKey.getPublic('hex')

const tx1 = new Transaction(myWalletAddress , 'public' , 20);
tx1.signTransaction(myKey);
kebabCoin.addTransaction(tx1)

console.log("Mining block")
kebabCoin.minePedingTransaction(myWalletAddress)

console.log("Mining block")
kebabCoin.minePedingTransaction(myWalletAddress)

console.log('My balance is ' + kebabCoin.getBalanceOfAddress(myWalletAddress))

//console.log(JSON.stringify(kebabCoin , null , 4));
//console.log(kebabCoin.validChain())
