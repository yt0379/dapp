class ChronicleItem{
    constructor(text){
        if(text) {
            const o = JSON.parse(text);
            this.content = o.content;//事件内容
            this.time = o.time;//事件时间
        }else{
            this.content = '';//事件内容
            this.time = '';//事件时间
        }
    }

    toString(){
        return JSON.stringify(this)
    }
}

class Chronicle {
    constructor(){
        LocalContractStorage.defineMapProperty(this,'arrayMap',{
            parse:text=>new ChronicleItem(text),
            stringify:obj=>obj.toString()
        })
        LocalContractStorage.defineProperty(this,'size')
    }
    init(){
        this.size = 0;
    }
    append(text,time){
        var index = this.size;
        var item = new ChronicleItem();
        item.content = text;
        item.time = time;
        this.arrayMap.set(index,item);
        this.size += 1;
    }
    //分页查询：limit表示每次查询获取条目数量，offset表示查询偏移量
    getAll(limit=10,offset=0){
        if(limit <= 0) {
            limit = 10;
        }
        if(offset < 0) {
            offset = 0;
        }

        //计算访问的索引截止位置
        var number = offset + limit;
        if(number > this.size) {
            number = this.size;
        }

        //遍历
        var result = [];
        for (let i = offset; i < number; i++) {
            result.push(this.arrayMap.get(i));
        }

        return {items:result,hasMore:number < this.size};
    }
}

module.exports = Chronicle