// const contractAddress = 'n1nQ2p2kwebQPkg8tjQBgiHXYVFYzGhVt8G';
const contractAddress = 'n1s5BNRdJbRaBs6hv8Wt3QiJS6Znu1eBGA5';
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

function TetrisContractApi() {
    this.start = function (cb) {
        this.simulateCall('start', '[]', cb)
    }
    this.newScore = function (score, cb) {
        return this.call('newScore', JSON.stringify([score]),cb)
    }
}

TetrisContractApi.prototype = new SmartContractApi(contractAddress,useTestnet)