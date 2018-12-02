// 方向初始值
var DIRECTIONLIST = {
    LEFT: {
        x: -1,
        y: 0
    },
    UP: {
        x: 0,
        y: -1
    },
    RIGHT: {
        x: 1,
        y: 0
    },
    DOWN: {
        x: 0,
        y: 1
    }

}

// 创建蛇
function Snake(m, head, body, tail, headColor, bodysColor) {

    this.head = new Square(head.x, head.y, headColor)
    this.body = new Square(body.x, body.y, bodysColor)
    this.tail = new Square(tail.x, tail.y, bodysColor)
    this.headColor = headColor
    this.bodysColor = bodysColor
    this.map = m.map
    this.m = m
    this.speed = 120
    this.scores = 0
    this.maxBodys = MAXBODYS
    this.astar = new AStarPathFinding(XLEN, YLEN, this.m.map)

    // 创建双向链表
    this.head.prev = null
    this.head.next = this.body

    this.body.prev = this.head
    this.body.next = this.tail

    this.tail.prev = this.body
    this.tail.next = null

    // 初始方向
    this.direction = DIRECTIONLIST.RIGHT

    // 初次渲染
    this.updateSnake(this.head)

}

Snake.prototype = {

    // 更新type
    update: function (x, y, type) {
        this.map[x + '-' + y] = type
    },
    updateSnake: function (snakeHead) {
        var current = snakeHead.next
        while (current) {
            this.map[current.x + '-' + current.y] = this.bodysColor
            current = current.next
        }
        this.map[snakeHead.x + '-' + snakeHead.y] = this.headColor
    },
    run: function (x, y) {
        if (x === undefined && y === undefined) {
            // 获取下一点的坐标
            x = this.head.x + this.direction.x
            y = this.head.y + this.direction.y
        }

        var type = this.map[x + '-' + y]
        if (type === 0 || type === 6) {
            // 执行MOVE
            this.strategies.MOVE(this, x, y)
        } else if (type === 5) {
            // 执行EAT
            this.strategies.EAT(this, x, y)
        } else {
            // 执行DIE
            this.strategies.DIE(this)
        }

    }, autoRun: function () {

        // 计算 起始点 - 终点 的路径
        var path = this.getPath(this.astar)
        this.autoMove(path)

    },
    autoMove: function (path) {
        if (ISGAMEOVER) return
        // 找不到路径就随机移动
        if (typeof path != 'object') {

            var current = this.randomMove()
            if (!current) {
                this.run()
                return
            }

            this.timer = setTimeout(() => {
                console.log('随机寻路')
                this.run(current.x, current.y)

                path = this.getPath(this.astar)
                this.autoMove(path)
            }, this.speed);
            return
        }

        this.renderPath(path)
        var length = path.length - 2
        path.pop()
        var minLength = this.shortestLength(new Node(this.head.x, this.head.y), this.astar.end) / 10 - 1

        this.timer = setInterval(() => {
            var food = path[0]
            var current = path[length]

            length--
            minLength--
            path.pop()

            this.run(current.x, current.y)
            // 路径走完
            // 路径比最短路径要长
            // 或者食物被吃掉
            // 路径被破坏
            if (length < 0
                || length - minLength > 2
                || this.m.map[food.x + '-' + food.y] != 5
                || length != this.m.path.length) {
                // 清理之前的路径
                this.clearPath(path)
                clearInterval(this.timer)
                path = this.getPath(this.astar)
                this.autoMove(path)
            }
        }, this.speed);
    },
    // 获取路径
    getPath: function (astar) {
        astar.start = new Node(this.head.x, this.head.y)

        var foods = this.m.foods
        // 找到距离最短的        
        foods.sort((a, b) => {
            return astar.calcDistance(astar.start, this.m.stringToObj(a)) - astar.calcDistance(astar.start, this.m.stringToObj(b))
        })

        var food = this.m.stringToObj(foods[0])
        astar.end = new Node(food.x, food.y)
        var path = astar.findPath(astar.start, astar.end)
        return path
    },
    shortestLength: function (nodeA, nodeB) {
        return this.astar.calcDistance(nodeA, nodeB)
    },
    // 渲染路径
    renderPath: function (path) {
        var current = path[1]
        while (current.p) {
            if (this.m.map[current.x + '-' + current.y] === 0) {
                this.m.map[current.x + '-' + current.y] = 6
            }
            current = current.p
        }
    },
    clearPath: function (path) {
        if (path.length > 0) {
            path.forEach((node) => {
                if (this.m.map[node.x + '-' + node.y] === 6) {
                    this.m.map[node.x + '-' + node.y] = 0
                }
            })
        }
    },
    // 随机寻路
    randomMove: function () {

        for (var key in DIRECTIONLIST) {
            this.direction = DIRECTIONLIST[key]
            x = this.head.x + this.direction.x
            y = this.head.y + this.direction.y

            var type = this.m.map[x + '-' + y]

            if (type === 0 || type === 5) {
                // 判断这个点周围是否有2个以上的路径
                var count = 0
                for (var key in DIRECTIONLIST) {
                    var _x = x + DIRECTIONLIST[key].x
                    var _y = y + DIRECTIONLIST[key].y

                    if (this.m.map[_x + '-' + _y] < 5) {
                        count++
                    }
                    if (count >= 1) {
                        return { x, y }
                    }
                }
            }
        }
        return false
    },
    strategies: {
        // 执行移动时策略
        MOVE: function (sna, x, y) {
            // console.log('MOVE')
            var tailX = sna.tail.x
            var tailY = sna.tail.y

            var current = sna.tail

            while (current.prev) {
                current.x = current.prev.x
                current.y = current.prev.y
                current = current.prev
            }

            sna.head.x = x
            sna.head.y = y

            sna.update(sna.head.x, sna.head.y, sna.headColor)
            sna.update(sna.head.next.x, sna.head.next.y, sna.bodysColor)
            sna.update(tailX, tailY, 0)

        },
        EAT: function (sna, x, y) {
            // console.log('EAT')
            sna.scores++
            if (sna.speed > 80) sna.speed -= 5

            if (sna.maxBodys > 0) {
                sna.maxBodys--

                var newBody = new Square(sna.head.x, sna.head.y, sna.headColor)
                var temp = sna.head.next

                // 把newBody 加入链表
                temp.prev = newBody
                newBody.prev = sna.head
                newBody.next = temp
                sna.head.next = newBody

                sna.head.x = x
                sna.head.y = y

                sna.update(sna.head.x, sna.head.y, sna.headColor)
                sna.update(newBody.x, newBody.y, sna.bodysColor)

            } else {
                // console.log('达到最大长度')
                this.MOVE(sna, x, y)
            }

            // 重新生成食物
            sna.m.initFoods(1)
        },
        DIE: function (sna) {
            console.log('DIE')
            ISGAMEOVER = true
            game.stop()
        }
    }
}
