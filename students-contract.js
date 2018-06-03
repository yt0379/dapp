class Student {
    constructor(text) {
        //id,date,text,color
        let obj = text ? JSON.parse(text) : {};
        this.id = obj.id || 0;
        this.name = obj.name;//姓名
        this.clazz = obj.clazz;//班级
        this.score = obj.score;//课时
    }

    toString() {
        return JSON.stringify(this);
    }
}

class StudentContract {
    constructor() {
        //属性绑定
        LocalContractStorage.defineProperty(this, 'count');
        //单独用户创建学员集合
        LocalContractStorage.defineMapProperty(this, 'userStudents');
        //所有学员集合
        LocalContractStorage.defineMapProperty(this, 'students', {
            parse: text => new Student(text),
            stringify: obj => obj.toString()
        });
    }

    init() {
        this.count = 1;
    }

    add(name, clazz, score) {
        //交易发送者
        let from = Blockchain.transaction.from;
        //索引
        let index = this.count;

        //创建Note对象
        let s = new Student();
        s.id = index;
        s.name = name;
        s.clazz = clazz;
        s.score = score;

        //存入map
        this.students.set(index, s);

        //userStudents更新
        let userStudents = this.userStudents.get(from) || [];
        userStudents.push(index);
        this.userStudents.set(from, userStudents);

        //更新count
        this.count += 1;
    }

    update(id, name, clazz, score) {
        let s = this.students.get(id);
        if (s) {//学员存在
            if(name) s.name = name;
            if(clazz) s.clazz = clazz;
            if(score) s.score = score;
            this.students.set(id, s);
        } else {
            throw new Error('学员不存在')
        }
    }

    delete(id) {
        let s = this.students.get(id);
        if (s) {//学员存在
            this.students.del(id);
        } else {
            throw new Error('学员不存在')
        }
    }

    // get(limit, offset) {
    //     //结果数组
    //     let arr = [];
    //     //分页参数
    //     offset = new BigNumber(offset);
    //     limit = new BigNumber(limit);
    //     for (let i = offset; i.lessThan(offset.plus(limit)); i = i.plus(1)) {
    //         const note = this.notes.get(i.toNumber());
    //         if(note) {
    //             arr.push(note);
    //         }
    //     }
    //     return arr;
    // }

    //根据钱包查询
    getByWallet(wallet){
        wallet = wallet || Blockchain.transaction.from;
        let stuIds = this.userStudents.get(wallet);
        if(stuIds) {
            let arr = [];
            for (let id of stuIds) {
                const s = this.students.get(id);
                if(s) {
                    arr.push(s);
                }
            }
            return arr;
        }else{
            throw new Error(`钱包${wallet}没有任何相关数据`)
        }
    }
}

module.exports = StudentContract;