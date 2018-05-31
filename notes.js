class Note {
    constructor(text) {
        //id,date,text,color
        let obj = text ? JSON.parse(text) : {};
        this.id = obj.id || 0;
        this.date = obj.date;//创建日期，日期字符串
        this.text = obj.text;//备注内容
        this.color = obj.color;//备注背景颜色
    }

    toString() {
        return JSON.stringify(this);
    }
}

class NoteContract {
    constructor() {
        //属性绑定
        LocalContractStorage.defineProperty(this, 'count');
        //单独用户创建备忘集合
        LocalContractStorage.defineMapProperty(this, 'userNotes');
        //所有备忘集合
        LocalContractStorage.defineMapProperty(this, 'notes', {
            parse: text => new Note(text),
            stringify: obj => obj.toString()
        });
    }

    init() {
        this.count = new BigNumber(1);
    }

    total() {
        return new BigNumber(this.count).minus(1).toNumber();
    }

    add(date, text, color) {
        //交易发送者
        let from = Blockchain.transaction.from;
        //索引
        let index = this.count;

        //创建Note对象
        let note = new Note();
        note.id = index;
        note.date = date;
        note.text = text;
        note.color = color;

        //存入map
        this.notes.set(index, note);

        //userNotes更新
        let userNotes = this.userNotes.get(from) || [];
        userNotes.push(index);
        this.userNotes.set(from, userNotes);

        //更新count
        this.count = new BigNumber(index).plus(1);
    }

    update(id, text, color) {
        let note = this.notes.get(id);
        if (note) {//note存在
            note.text = text;
            note.color = color;
            this.notes.set(id, note);
        } else {
            throw new Error('备忘不存在')
        }
    }

    delete(id) {
        let note = this.notes.get(id);
        if (note) {//note存在
            this.notes.del(id);
        } else {
            throw new Error('备忘不存在')
        }
    }

    get(limit, offset) {
        //结果数组
        let arr = [];
        //分页参数
        offset = new BigNumber(offset);
        limit = new BigNumber(limit);
        for (let i = offset; i.lessThan(offset.plus(limit)); i = i.plus(1)) {
            const note = this.notes.get(i.toNumber());
            if(note) {
                arr.push(note);
            }
        }
        return arr;
    }

    //根据钱包查询
    getByWallet(wallet){
        wallet = wallet || Blockchain.transaction.from;
        let noteIds = this.userNotes.get(wallet);
        if(noteIds) {
            let arr = [];
            for (let i = 0; i < noteIds.length; i++) {
                const id = noteIds[i];
                const note = this.notes.get(id);
                if(note) {
                    arr.push(note);
                }
            }
            return arr;
        }else{
            throw new Error(`钱包${wallet}没有任何相关备忘信息`)
        }
    }
}

module.exports = NoteContract;