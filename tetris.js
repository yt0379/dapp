//匿名自调函数，避免污染全局对象
var tetris = (function (win, doc, pg) {
    const IMG_T = 'img/T.png';
    const IMG_I = 'img/I.png';
    const IMG_J = 'img/J.png';
    const IMG_L = 'img/L.png';
    const IMG_S = 'img/S.png';
    const IMG_Z = 'img/Z.png';
    const IMG_O = 'img/O.png';
    const IMG_BG = 'img/tetris.png';
    const IMG_PAUSE = 'img/pause.png';
    const IMG_OVER = 'img/game-over.png';
    const CELL_SIZE = 26;

    /**一个单元格**/
    function Cell(row, col, img) {
        this.row = row;
        this.col = col;
        this.img = img;
        this.softDrop = function () {
            this.row++;
        }
        this.moveRight = function () {
            this.col++;
        }
        this.moveLeft = function () {
            this.col--;
        }
    }

    /**每种图形一种的旋转状态**/
    function State(row0, col0, row1, col1, row2, col2, row3, col3) {
        this.row0 = row0;
        this.col0 = col0;
        this.row1 = row1;
        this.col1 = col1;
        this.row2 = row2;
        this.col2 = col2;
        this.row3 = row3;
        this.col3 = col3;
    }

    /**由四个单元格组成的一个图形**/
    function Tetromino() {
        this.cells = [];	//四个单元格组成的数组
        this.states = [];	//当前图形可能的旋转状态
        this.index = 9999;	//当前图形旋转计数
        this.softDrop = function () {
            for (var i = 0; i < this.cells.length; i++) {
                this.cells[i].softDrop();
            }
        }
        this.moveRight = function () {
            for (var i = 0; i < this.cells.length; i++) {
                this.cells[i].moveRight();
            }
        }
        this.moveLeft = function () {
            for (var i = 0; i < this.cells.length; i++) {
                this.cells[i].moveLeft();
            }
        }
        this.rotateRight = function () {
            this.index++;
            var state = this.states[this.index % this.states.length]; //下一个旋转状态

            var r = this.cells[0].row;	//轴点位置不变
            var c = this.cells[0].col;
            this.cells[1].row = r + state.row1;
            this.cells[1].col = c + state.col1;
            this.cells[2].row = r + state.row2;
            this.cells[2].col = c + state.col2;
            this.cells[3].row = r + state.row3;
            this.cells[3].col = c + state.col3;
        }
        this.rotateLeft = function () {
            this.index--;
            var state = this.states[this.index % this.states.length]; //下一个旋转状态

            var r = this.cells[0].row;	//轴点位置不变
            var c = this.cells[0].col;
            this.cells[1].row = r + state.row1;
            this.cells[1].col = c + state.col1;
            this.cells[2].row = r + state.row2;
            this.cells[2].col = c + state.col2;
            this.cells[3].row = r + state.row3;
            this.cells[3].col = c + state.col3;
        }
    }

    /**七种图形之一：T型**/
    function T() {
        Object.setPrototypeOf(this, new Tetromino());
        this.cells[0] = new Cell(0, 4, IMG_T);
        this.cells[1] = new Cell(0, 3, IMG_T);
        this.cells[2] = new Cell(0, 5, IMG_T);
        this.cells[3] = new Cell(1, 4, IMG_T);
        this.states[0] = new State(0, 0, 0, -1, 0, 1, 1, 0);
        this.states[1] = new State(0, 0, -1, 0, 1, 0, 0, -1);
        this.states[2] = new State(0, 0, 0, 1, 0, -1, -1, 0);
        this.states[3] = new State(0, 0, 1, 0, -1, 0, 0, 1);
    }

    /**七种图形之二：I型**/
    function I() {
        Object.setPrototypeOf(this, new Tetromino());
        this.cells[0] = new Cell(0, 4, IMG_I);
        this.cells[1] = new Cell(0, 3, IMG_I);
        this.cells[2] = new Cell(0, 5, IMG_I);
        this.cells[3] = new Cell(0, 6, IMG_I);
        this.states[0] = new State(0, 0, 0, -1, 0, 1, 0, 2);
        this.states[1] = new State(0, 0, -1, 0, 1, 0, 2, 0);
    }

    /**七种图形之三：S型**/
    function S() {
        Object.setPrototypeOf(this, new Tetromino());
        this.cells[0] = new Cell(1, 4, IMG_S);
        this.cells[1] = new Cell(0, 5, IMG_S);
        this.cells[2] = new Cell(0, 4, IMG_S);
        this.cells[3] = new Cell(1, 3, IMG_S);
        this.states[0] = new State(0, 0, 0, -1, -1, 0, -1, 1);
        this.states[1] = new State(0, 0, -1, 0, 0, 1, 1, 1);
    }

    /**七种图形之四：Z型**/
    function Z() {
        Object.setPrototypeOf(this, new Tetromino());
        this.cells[0] = new Cell(1, 4, IMG_Z);
        this.cells[1] = new Cell(0, 3, IMG_Z);
        this.cells[2] = new Cell(0, 4, IMG_Z);
        this.cells[3] = new Cell(1, 5, IMG_Z);
        this.states[0] = new State(0, 0, -1, -1, -1, 0, 0, 1);
        this.states[1] = new State(0, 0, -1, 1, 0, 1, 1, 0);
    }

    /**七种图形之五：O型**/
    function O() {
        Object.setPrototypeOf(this, new Tetromino());
        this.cells[0] = new Cell(0, 4, IMG_O);
        this.cells[1] = new Cell(0, 5, IMG_O);
        this.cells[2] = new Cell(1, 4, IMG_O);
        this.cells[3] = new Cell(1, 5, IMG_O);
        this.states[0] = new State(0, 0, 0, 1, 1, 0, 1, 1);
        this.states[1] = new State(0, 0, 0, 1, 1, 0, 1, 1);
    }

    /**七种图形之六：L型**/
    function L() {
        Object.setPrototypeOf(this, new Tetromino());
        this.cells[0] = new Cell(0, 4, IMG_L);
        this.cells[1] = new Cell(0, 3, IMG_L);
        this.cells[2] = new Cell(0, 5, IMG_L);
        this.cells[3] = new Cell(1, 3, IMG_L);
        this.states[0] = new State(0, 0, 0, 1, 0, -1, -1, 1);
        this.states[1] = new State(0, 0, 1, 0, -1, 0, 1, 1);
        this.states[2] = new State(0, 0, 0, -1, 0, 1, 1, -1);
        this.states[3] = new State(0, 0, -1, 0, 1, 0, -1, -1);
    }

    /**七种图形之七：J型**/
    function J() {
        Object.setPrototypeOf(this, new Tetromino());
        this.cells[0] = new Cell(0, 4, IMG_J);
        this.cells[1] = new Cell(0, 3, IMG_J);
        this.cells[2] = new Cell(0, 5, IMG_J);
        this.cells[3] = new Cell(1, 5, IMG_J);
        this.states[0] = new State(0, 0, 0, -1, 0, 1, 1, 1);
        this.states[1] = new State(0, 0, -1, 0, 1, 0, 1, -1);
        this.states[2] = new State(0, 0, 0, 1, 0, -1, -1, -1);
        this.states[3] = new State(0, 0, 1, 0, -1, 0, -1, 1);
    }


    const STATE_RUNNING = 0;
    const STATE_PAUSE = 1;
    const STATE_OVER = 2;
    const ROWS = 20;
    const COLS = 10;

    /**游戏对象**/
    function Tetris() {
        /**生成一个随机的图形**/
        this.randomTetromino = function () {
            var type = parseInt(Math.random() * 7);
            switch (type) {
                case 0:
                    return new T();
                case 1:
                    return new S();
                case 2:
                    return new Z();
                case 3:
                    return new L();
                case 4:
                    return new J();
                case 5:
                    return new O();
                case 6:
                    return new I();
            }
        }

        /**初始化所有状态**/
        this.init = function () {
            this.state = STATE_RUNNING;
            this.score = 0;	//得分
            this.lines = 0;	//消除的行数
            this.level = 1;	//级别
            this.speed = 40;
            this.index = 0;
            this.curTetromino = this.randomTetromino();		//当前图形
            this.nextTetromino = this.randomTetromino();	//下一个图形
            this.wall = [];	//方块墙
            for (var i = 0; i < ROWS; i++) {
                this.wall[i] = [];
                for (var j = 0; j < COLS; j++) {
                    this.wall[i][j] = null;
                }
            }

            win.onkeyup = function (event) {
                event.preventDefault();	//阻止窗口滚动等默认行为
                var key = event.which || event.keyCode || event.charCode;

                function process() {
                    switch (this.state) {
                        case STATE_RUNNING:
                            this.processRunning(key);
                            break;
                        case STATE_PAUSE:
                            this.processPause(key);
                            break;
                        case STATE_OVER:
                            this.processOver(key);
                            break;
                    }
                    this.paint();
                }

                process.apply(t);
            }

            return this;	//链式调用
        }

        /**键盘事件监听——在游戏运行状态下**/
        this.processRunning = function (key) {
            switch (key) {
                case 37:
                    this.moveLeftAction();
                    break;		//左
                case 38:
                    this.rotateRightAction();
                    break;		//上
                case 39:
                    this.moveRightAction();
                    break;		//右
                case 40:
                    this.softDropAction();
                    break;		//下
                case 90:
                    this.rotateLeftAction();
                    break;		//Z 向左旋转
                case 32:
                    this.hardDropAction();
                    break;		//空格
                case 81:
                    this.state = STATE_OVER;
                    break;		//Q
                case 80:
                    this.state = STATE_PAUSE;
                    break;		//P
            }
        }
        /**键盘事件监听——在游戏暂停状态下**/
        this.processPause = function (key) {
            switch (key) {
                case 81:
                    this.state = STATE_OVER;
                    break;	//Q
                case 67:								//C
                    this.state = STATE_RUNNING;
                    this.index = 1;
                    break;
            }
        }
        /**键盘事件监听——在游戏结束状态下**/
        this.processOver = function (key) {
            switch (key) {
                case 81:
                    this.state = STATE_OVER;
                    break;		//Q
                case 83:
                    this.init().start();				//S
            }
        }

        /**实现右移动流程控制 */
        this.moveRightAction = function () {
            this.curTetromino.moveRight();
            if (this.outOfBounds() || this.concide()) {
                this.curTetromino.moveLeft();
            }
        }
        /** 旋转流程控制*/
        this.rotateRightAction = function () {
            this.curTetromino.rotateRight();
            if (this.outOfBounds() || this.concide()) {
                this.curTetromino.rotateLeft();
            }
        }
        this.rotateLeftAction = function () {
            this.curTetromino.rotateLeft();
            if (this.outOfBounds() || this.concide()) {
                this.curTetromino.rotateRight();
            }
        }
        this.moveLeftAction = function () {
            this.curTetromino.moveLeft();
            if (this.outOfBounds() || this.concide()) {
                this.curTetromino.moveRight();
            }
        }
        /**判定目标格内是否已经存在方块**/
        this.concide = function () {
            var cells = this.curTetromino.cells;
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if (this.wall[cell.row][cell.col] != null) {
                    return true;
                }
            }
            return false;
        }

        /** 检查正在下落的方块是否出界了**/
        this.outOfBounds = function () {
            var cells = this.curTetromino.cells;
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if (cell.row < 0 || cell.row >= ROWS || cell.col < 0 || cell.col >= COLS) {
                    return true;
                }
            }
            return false;
        }
        //				   0  1  2  3  4
        this.scoreTable = [0, 10, 50, 80, 200];
        this.hardDropAction = function () {
            while (this.canDrop()) {
                this.curTetromino.softDrop();
            }
            this.landIntoWall();
            var lines = this.destroyLines();

            this.lines += lines;
            this.score += this.scoreTable[lines];

            if (this.isGameOver()) {
                this.state = STATE_OVER;
                if(this.gameOverCallback) {
                    this.gameOverCallback(this.score);
                }
            } else {
                this.curTetromino = this.nextTetromino;
                this.nextTetromino = this.randomTetromino();
            }
        }

        this.softDropAction = function () {
            if (this.canDrop()) {
                this.curTetromino.softDrop();
            } else {
                this.landIntoWall();
                var lines = this.destroyLines();// 0 ~ 4
                this.lines = parseInt(this.lines + lines);
                this.score = parseInt(this.score + this.scoreTable[lines]);
                if (this.isGameOver()) {
                    this.state = STATE_OVER;
                    if(this.gameOverCallback) {
                        this.gameOverCallback(this.score);
                    }
                } else {
                    this.curTetromino = this.nextTetromino;
                    this.nextTetromino = this.randomTetromino();
                }
            }
        }

        this.canDrop = function () {
            var cells = this.curTetromino.cells;
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if (cell.row == (ROWS - 1)) {
                    return false;
                }
            }
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if (this.wall[cell.row + 1][cell.col] != null) {
                    return false;
                }
            }
            return true;
        }

        this.landIntoWall = function () {
            var cells = this.curTetromino.cells;
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                this.wall[cell.row][cell.col] = cell;
            }
        }

        this.destroyLines = function () {
            var lines = 0;
            for (var row = 0; row < ROWS; row++) {
                if (this.fullCells(row)) {
                    this.deleteRow(row);
                    lines++;
                }
            }
            return lines;
        }
        this.deleteRow = function (row) {
            for (var i = row; i >= 1; i--) {
                for (var j = 0; j < COLS; j++) {
                    this.wall[i][j] = this.wall[i - 1][j];
                }
            }
            for (var j = 0; j < COLS; j++) {
                this.wall[0][j] = null;
            }
        }

        this.fullCells = function (row) {
            var line = this.wall[row];
            for (var i = 0; i < line.length; i++) {
                var cell = line[i];
                if (cell == null) {
                    return false;
                }
            }
            return true;
        }

        this.isGameOver = function () {
            var cells = this.nextTetromino.cells;
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if (this.wall[cell.row][cell.col] != null) {
                    return true;
                }
            }
            return false;
        }


        /**绘制**/
        this.paint = function () {
            pg.innerHTML = '';
            this.paintWall();
            this.paintTetromino();
            this.paintNextTetromino();
            this.paintScore();
            this.paintState();
        }

        const OFFSET_X = 15;
        const OFFSET_Y = 15;
        this.paintWall = function () {
            var img = new Image();
            img.src = IMG_BG;
            img.style.position = 'absolute';
            pg.appendChild(img);

            for (var row = 0; row < ROWS; row++) {
                for (var col = 0; col < COLS; col++) {
                    var cell = this.wall[row][col];
                    var x = col * CELL_SIZE + OFFSET_X;
                    var y = row * CELL_SIZE + OFFSET_Y;
                    if (cell != null) {
                        var img = new Image();
                        img.src = cell.img;
                        img.style.left = x + 'px';
                        img.style.top = y + 'px';
                        pg.appendChild(img);
                    }
                }
            }
        }

        this.paintTetromino = function () {
            if (this.curTetromino == null)
                return;
            var cells = this.curTetromino.cells;
            for (var i = 0; i < cells.length; i++) {
                //c 是正在下落方块的每个格子的引用
                var c = cells[i];
                var x = c.col * CELL_SIZE + OFFSET_X;
                var y = c.row * CELL_SIZE + OFFSET_Y;
                var img = new Image();
                img.src = c.img;
                img.style.left = x + 'px';
                img.style.top = y + 'px';
                pg.appendChild(img);
            }
        }
        this.paintNextTetromino = function () {
            if (this.nextTetromino == null)
                return;
            var cells = this.nextTetromino.cells;
            for (var i = 0; i < cells.length; i++) {
                var c = cells[i];
                var row = c.row + 1;
                var col = c.col + 11;
                var x = col * CELL_SIZE;
                var y = row * CELL_SIZE;
                var img = new Image();
                img.src = c.img;
                img.style.left = x + 'px';
                img.style.top = y + 'px';
                pg.appendChild(img);
            }

        }
        this.paintScore = function () {
            var x = 305;
            var y = 120;
            var p = document.createElement('p');
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.innerHTML = 'SCORE:' + this.score;
            pg.appendChild(p);
            y += 56;
            var p = document.createElement('p');
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.innerHTML = 'LINES:' + this.lines;
            pg.appendChild(p);
            y += 56;
            var p = document.createElement('p');
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.innerHTML = 'LEVEL:' + this.level;
            pg.appendChild(p);
        }
        this.paintState = function () {
            var img = new Image();
            img.style.position = 'absolute';
            switch (this.state) {
                case STATE_PAUSE:
                    img.src = IMG_PAUSE;
                    break;
                case STATE_OVER:
                    img.src = IMG_OVER;
                    break;
            }
            pg.appendChild(img);
        }

        /**开始游戏**/
        this.start = function (cb) {
            this.gameOverCallback = cb;
            var timer = win.setInterval(function () {
                function task() {
                    this.speed = 40 - (this.score / 1000);
                    this.speed = this.speed <= 1 ? 1 : parseInt(this.speed);
                    this.level = parseInt(41 - this.speed);
                    if (this.index % this.speed == 0) {
                        if (this.state == STATE_RUNNING) {
                            this.softDropAction();
                        } else if (this.state == STATE_OVER) {
                            win.clearInterval(timer);
                        }
                    }
                    this.index++;
                    this.paint();
                }

                task.apply(t);
            }, 10);
        }
    }

    //启动游戏
    var t = new Tetris();

    return t;
})(window, document, document.getElementsByClassName('playground')[0]);