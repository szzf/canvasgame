// 渲染
function Render(m) {
    this.map = m.map
    this.m = m
    this.init(this.map)
}

Render.prototype = {
    init: function (map) {
        var self = this
        Object.keys(map).forEach(function (key) {
            self.renderGround(map, key, map[key])
        })
    },
    renderGround: function (map, key, type) {
        var self = this
        var temp = key.split('-')
        var pointX = parseInt(temp[0]) * SQUAREWIDTH
        var pointY = parseInt(temp[1]) * SQUAREWIDTH

        ctx.fillStyle = TYPESTRATEGY[type]
        if (type === 0) {
            ctx.fillRect(pointX + BASICLINE, pointY + BASICLINE, SQUAREWIDTH - BASICLINE * 2, SQUAREWIDTH - BASICLINE * 2)
        } else {
            ctx.fillRect(pointX, pointY, SQUAREWIDTH, SQUAREWIDTH)
        }
        // strokeSide(pointX, pointY, type)

        // 订阅者 数据变动重新渲染
        new Watcher(map, key, function (newType, oldType) {
            // console.log('新值:' + newType, 'old:' + oldType)

            ctx.fillStyle = TYPESTRATEGY[newType]
            ctx.fillRect(pointX + BASICLINE, pointY + BASICLINE, SQUAREWIDTH - BASICLINE * 2, SQUAREWIDTH - BASICLINE * 2)

            // 数据改变后的操作


            self.pushData(newType, temp[0], temp[1])
            self.removeData(oldType, temp[0], temp[1])

        })
    },
    pushData: function (newType, x, y) {
        // 新数据 添加到新容器中
        switch (newType) {
            case 10:
                // console.log('生成障碍物')
                this.m.stones.push(x + '-' + y)
                break;
            case 5:
                // console.log('生成食物')
                this.m.foods.push(x + '-' + y)
                break;
            case 6:
                // console.log('生成路径')
                this.m.path.push(x + '-' + y)
                break;
            case 0:
                // console.log('删除地板')
                this.m.ground[x + '-' + y] = 0
                break;
        }
        if (newType > 10) {
            // console.log('生成蛇')
            this.m.snakeBodys.push(x + '-' + y)
        }
    },
    removeData: function (oldType, x, y) {
        // 旧数据 在之前的容器中删除
        switch (oldType) {
            case 10:
                // console.log('删除障碍物')
                var index = this.m.stones.findIndex(function (key) {
                    return key === x + '-' + y
                })
                this.m.stones.splice(index, 1)
                break;
            case 5:
                // console.log('删除食物')
                var index = this.m.foods.findIndex(function (key) {
                    return key === x + '-' + y
                })
                this.m.foods.splice(index, 1)
                break;
            case 6:
                // console.log('删除路径')
                var index = this.m.path.findIndex(function (key) {
                    return key === x + '-' + y
                })
                this.m.path.splice(index, 1)
                break;
            case 0:
                // console.log('删除地板')
                delete this.m.ground[x + '-' + y]
                break;
        }

        if (oldType > 10) {
            // console.log('删除蛇')
            var index = this.m.snakeBodys.findIndex(function (key) {
                return key === x + '-' + y
            })
            this.m.snakeBodys.splice(index, 1)
        }
    }
}

// 描边
function strokeSide(pointX, pointY, type) {

    if (type === 0) {
        ctx.beginPath()
        ctx.moveTo(pointX + BASICLINE / 2, pointY + BASICLINE / 2)
        ctx.lineTo(pointX - BASICLINE / 2 + SQUAREWIDTH, pointY + BASICLINE / 2)
        ctx.lineTo(pointX - BASICLINE / 2 + SQUAREWIDTH, pointY - BASICLINE / 2 + SQUAREWIDTH)
        ctx.lineTo(pointX + BASICLINE / 2, pointY - BASICLINE / 2 + SQUAREWIDTH)
        ctx.closePath()
        ctx.lineWidth = BASICLINE
        ctx.strokeStyle = '#fff'
        ctx.stroke()
    }
}
