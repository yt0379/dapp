// function FirstContract() {
//
// }
//
// FirstContract.prototype = {
//     init:function () {
//
//     },
//     sayHello:function (msg) {
//         return '合约回应：'+msg
//     }
// }

class FirstContract{
    constructor(){
        LocalContractStorage.defineProperty(this,'name')
        LocalContractStorage.defineProperties(this,{
            age:null,
            hobby:null,
            balance:{//BigNumber
                stringify:function (obj) {
                    return obj.toString()
                },
                parse:function (str) {
                    return new BigNumber(str)
                }
            }
        })
        LocalContractStorage.defineMapProperty(this,'address')
    }
    init(){
        // LocalContractStorage.set('name','Tom')
        // LocalContractStorage.set('age',20)
        // LocalContractStorage.set('address',{city:'上海',district:'浦东'})
        // LocalContractStorage.set('hobby',['basketball','football'])
        this.name = 'Tom'
        this.age = 20
        let addr = this.address;//Map
        addr.set('city','上海')
        addr.set('district','浦东')
        this.hobby = ['basketball','football']
        this.balance = new BigNumber(10)
    }
    sayHello(msg){
        return '合约回应：'+msg
    }
    getData(key){
        if(key=='address') {
            const addr = this.address;//Map
            const city = addr.get('city')
            const district = addr.get('district')
            return {city,district}
        }
        return this[key]
    }
    delData(key){
        return LocalContractStorage.del(key)
    }
    save(val){
        this.balance = this.balance.plus(val)
        return this.balance
    }
}

module.exports = FirstContract