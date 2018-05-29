class Task{
    constructor(text){
        let obj = text ? JSON.parse(text) : {};
        this.id = obj.id || 0;//任务id
        this.text = obj.text;//任务描述信息
        this.completed = obj.completed;//任务状态
    }

    toString(){
        return JSON.stringify(this)
    }
}

class TaskContract{
    constructor(){
        LocalContractStorage.defineProperty(this,'count',{
            parse:text=>new BigNumber(text),
            stringify:task=>task.toString()
        });
        LocalContractStorage.defineMapProperty(this,'tasks',{
            parse:text=>new Task(text),
            stringify:task=>task.toString()
        });
    }

    init(){
        this.count = new BigNumber(1);
    }

    add(text){
        //创建一个新任务实例
        let task = new Task();
        task.id = this.count;
        task.text = text;
        task.completed = false;

        //存入map
        this.tasks.set(this.count,task);
        this.count = this.count.plus(1);
    }

    update(id,completed){
        let task = this.tasks.get(id);
        if(!task) {
            throw new Error('待办没有找到')
        }
        task.completed = completed;
        //更新后写入
        this.tasks.set(id,task);
    }

    //limit：分页查询单页尺寸
    //offset: 分页查询偏移量
    //taskType：待办状态，'active','completed','any'
    get(limit,offset,taskType){
        let arr = [];
        limit = new BigNumber(limit);
        offset = new BigNumber(offset);

        for (let i = offset; i.lessThan(offset.plus(limit)); i = i.plus(1)) {
            let index = i.toNumber();
            let task = this.tasks.get(index);
            if(task) {
                if(taskType == 'active' && task.completed == false) {
                    arr.push(task);
                    continue;
                }
                if(taskType == 'completed' && task.completed == true) {
                    arr.push(task);
                    continue;
                }
                if(taskType == 'any') {
                    arr.push(task);
                }
            }
        }
        return arr;
    }
}

module.exports = TaskContract;