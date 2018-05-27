//字典项对象
class DictItem{
    constructor(text){
        if(text) {//构造DictItem传入了数据JSON字符串
            var obj = JSON.parse(text);
            this.key = obj.key;//关键词
            this.value = obj.value;//描述信息
            this.author = obj.author;//作者
        }else{//未传入参数
            this.key = '';//关键词
            this.value = '';//描述信息
            this.author = '';//作者
        }
    }
}

//合约对象
class SuperDictionary {
    constructor(){
        LocalContractStorage.defineMapProperty(this,'repo',{
            parse:text=>new DictItem(text),
            stringify:o=>JSON.stringify(o)
        })
    }

    init(){}

    //查找关键词
    get(key){
        key = key.trim();
        if(key === '') {
            throw new Error('词条名称不能为空')
        }
        return this.repo.get(key)
    }

    //新增关键词
    save(key,value){
        //非空验证
        key = key.trim();
        value = value.trim();
        if(key === '' || value === '') {
            throw new Error('词条名称和描述信息不能为空')
        }

        // 最大长度验证
        if(key.length > 64 || value.length > 64) {
            throw new Error('词条名称和描述长度不能大于64个字符')
        }

        // 创建过程
        var from = Blockchain.transaction.from;//获取请求发送者
        var dictItem = this.repo.get(key);
        if(dictItem) {
            throw new Error('该词条已存在')
        }

        dictItem = new DictItem();
        dictItem.key = key;
        dictItem.value = value;
        dictItem.author = from;

        this.repo.set(key,dictItem)
    }
}

module.exports = SuperDictionary;