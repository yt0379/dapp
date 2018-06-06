const contractAddress = 'n1yPMEvmqLXY5DnwqknpvZyQNyc8pgmn3YP';
// const contractAddress = 'n22CgqEm9jbsNwnTuAHZqLzvErHa6FxiBcu';
const useTestnet = false;

function SmartContractApi(contractAddress, useTestnet) {
    const NebPay = require('nebpay');
    this.nebPay = new NebPay();
    this.callbackUrl = useTestnet ?
        NebPay.config.testnetUrl : NebPay.config.mainnetUrl;
    this.contractAddress = contractAddress;
}
SmartContractApi.prototype = {
    simulateCall:function (callFunction,callArgs="[]",callback,value=0) {
        this.nebPay.simulateCall(this.contractAddress,value,callFunction,callArgs,{
            listener:function (resp) {
                if(callback) {
                    callback(resp);
                }
            }
        })
    },
    call:function (callFunction,callArgs="[]",callback=null,value=0) {
        return this.nebPay.call(this.contractAddress,value,callFunction,callArgs,{
            callback:this.callbackUrl,
            listener:function (resp) {
                console.log(resp);
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
}

function StudentContractApi() {
    this.get = function (cb) {
        this.simulateCall('getByWallet', JSON.stringify([]),cb)
    }
    this.add = function (name, clazz, score, cb) {
        return this.call('add', JSON.stringify([name, clazz, score]),cb)
    }
    this.update = function (id, name, clazz, score, cb) {
        return this.call('update', JSON.stringify([id, name, clazz, score]),cb)
    }
    this.delete = function (id, cb) {
        return this.call('delete', JSON.stringify([id]),cb)
    }
}

StudentContractApi.prototype = new SmartContractApi(contractAddress,useTestnet)