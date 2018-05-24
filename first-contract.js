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
    init(){
        LocalContractStorage.set('name','Tom')
        LocalContractStorage.set('age',20)
        LocalContractStorage.set('address',{city:'上海',district:'浦东'})
        LocalContractStorage.set('hobby',['basketball','football'])
    }
    sayHello(msg){
        return '合约回应：'+msg
    }
    getData(key){
        return LocalContractStorage.get(key)
    }
    delData(key){
        return LocalContractStorage.del(key)
    }
}

module.exports = FirstContract