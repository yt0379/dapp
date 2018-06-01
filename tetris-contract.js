class TetrisContract {
    constructor() {
        LocalContractStorage.defineMapProperty(this, 'userScore', {
            parse: text => new BigNumber(text),
            stringify: obj => obj.toString()
        })
    }

    init() {
    }

    start() {
        const from = Blockchain.transaction.from;
        let score = this.userScore.get(from) || new BigNumber(0);
        return score.toNumber();
    }

    newScore(score) {
        const from = Blockchain.transaction.from;
        let oldScore = this.userScore.get(from) || new BigNumber(0);
        score = new BigNumber(score);
        //新纪录高于老记录则更新
        if (oldScore.lessThan(score)) {
            this.userScore.set(from, score);
        }
    }
}

module.exports = TetrisContract;