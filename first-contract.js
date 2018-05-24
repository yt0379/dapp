class FirstContract {
    constructor(){
        LocalContractStorage.defineProperty(this,'name')
    }
    init(){
        // LocalContractStorage.set('name','Tom')
        this.name = 'Tom'
        LocalContractStorage.set('age',20)
        LocalContractStorage.set('address',{city:'上海',district:'浦东'})
        LocalContractStorage.set('hobby',['足球','篮球'])
    }
    sayHello (msg) {
        return '合约回应：'+msg;
    }
    getData(key){
        return LocalContractStorage.get(key)
    }
    delData(key){
        let result = LocalContractStorage.del(key)
        console.log("del result:" + result)
        return result
    }
}

module.exports = FirstContract