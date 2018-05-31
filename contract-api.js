const contractAddress = 'n1wHd8KTQKDkMhfSyoshsDnV7BHbfLciwWy';
const useTestnet = true;

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

function NoteContractApi() {
    this.get = function (limit, offset, cb) {
        this.simulateCall('get', JSON.stringify([limit,offset]),cb)
    }
    this.add = function (text, color, cb) {
        return this.call('add', JSON.stringify([new Date().toLocaleString(),text,color]),cb)
    }
    this.update = function (id, text, color, cb) {
        return this.call('update', JSON.stringify([id,text,color]),cb)
    }
    this.delete = function (id, cb) {
        return this.call('delete', JSON.stringify([id]),cb)
    }
}

NoteContractApi.prototype = new SmartContractApi(contractAddress,useTestnet)