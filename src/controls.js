function Game() {
    this.timer = null
    this.bindEvent()
}

Game.prototype = {
    init: function () {
        this.flag = false
        ISGAMEOVER = false
        this.m = new Map(XLEN, YLEN)
        new Observer(this.m.map)
        new Render(this.m)
        this.snake = new Snake(this.m, { x: 3, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 1 }, 11, 12)
        this.snakeAI = new Snake(this.m, { x: XLEN - 4, y: YLEN - 2 }, { x: XLEN - 3, y: YLEN - 2 }, { x: XLEN - 2, y: YLEN - 2 }, 19, 18)

        this.m.initStones(10)
        this.m.initFoods(5)
    },

    bindEvent: function () {
        var self = this
        document.onkeydown = function (e) {
            // 37 38 39 40 left up right down

            if (e.which == 32 && !self.flag) {
                self.run()
            }

            if (e.which == 37 && self.snake.direction != DIRECTIONLIST.RIGHT && self.flag) {
                self.snake.direction = DIRECTIONLIST.LEFT
                // console.log('left')
            } else if (e.which == 38 && self.snake.direction != DIRECTIONLIST.DOWN && self.flag) {
                self.snake.direction = DIRECTIONLIST.UP
                // console.log('up')
            } else if (e.which == 39 && self.snake.direction != DIRECTIONLIST.LEFT && self.flag) {
                self.snake.direction = DIRECTIONLIST.RIGHT
                // console.log('right')
            } else if (e.which == 40 && self.snake.direction != DIRECTIONLIST.UP && self.flag) {
                self.snake.direction = DIRECTIONLIST.DOWN
                // console.log('down')
            }
            // self.flag = false
        }
    },
    run: function () {
        clearInterval(this.timer)

        this.flag = true
        this.timer = setInterval(() => {
            this.snake.run()
        }, SPEED);
        this.snakeAI.autoRun()
    },
    stop: function () {

        clearInterval(this.timer)
        clearInterval(this.snakeAI.timer)
        clearTimeout(this.snakeAI.timer)
        alert('你的分数是: ' + this.snake.scores + '    电脑的分数是: ' + this.snakeAI.scores)
        this.init()
    },
}

var game = new Game()

game.init()

