// 寻路算法
function Node(x, y) {
    this.x = x
    this.y = y
    this.f = 0
    this.g = 0
    this.h = 0
    this.p = null
}

function AStarPathFinding(w, h, map) {
    this.w = w
    this.h = h
    this.map = map
}


// 获取周围十字方位的坐标值
AStarPathFinding.prototype.getCross = function (curNode, map) {
    if (!curNode) {
        return
    }
    var rounds = []
    var length = this.w
    var x = curNode.x
    var y = curNode.y

    var direction = [
        { x: x, y: y - 1 },
        { x: x - 1, y: y },
        { x: x + 1, y: y },
        { x: x, y: y + 1 }
    ]

    for (var i = 0; i < direction.length; i++) {
        var _x = direction[i].x
        var _y = direction[i].y

        // 处理边界
        if (_x >= 0 && _y >= 0 && _x <= length && _y <= length) {

            // 判断是否是障碍物 并且不存在this.closeList 和 this.openList中
            // 6 以上是障碍物
            if ((map[_x + '-' + _y] <= 6) && !this.inList(_x, _y, this.closeList) && !this.inList(_x, _y, this.openList)) {
                var newNode = new Node(_x, _y)
                rounds.push(newNode)
            }
        }
    }
    return rounds
}

// 是否在列表中
AStarPathFinding.prototype.inList = function (x, y, list) {
    for (var key of list) {
        if (key.x == x && key.y == y) {
            return key
        }
    }
    return false
}

// 距离计算
AStarPathFinding.prototype.calcDistance = function (nodeA, nodeB) {
    var h = (Math.abs(nodeB.x - nodeA.x) + Math.abs(nodeB.y - nodeA.y)) * 10
    return h
}

// 寻找路径 
AStarPathFinding.prototype.findPath = function (nodeA, nodeB) {
    // 重置
    this.openList = new Set()
    this.closeList = new Set()
    // 1 把起始点加入 this.openList
    this.openList.add(nodeA)

    // 2 查找周围的方格 除去障碍物 
    var rounds = this.getCross(nodeA, this.map)

    // 3 将起始点从this.openList删除
    if (this.openList.has(nodeA)) {
        this.closeList.add(nodeA)
        this.openList.delete(nodeA)
    }

    // 把周围的方格设置父节点为起始节点 并加入到this.openList
    for (var i = 0; i < rounds.length; i++) {

        // 计算f = g + h
        rounds[i].h = this.calcDistance(rounds[i], nodeB)
        rounds[i].g = Math.abs(nodeA.x - rounds[i].x) == 1 && Math.abs(nodeA.y - rounds[i].y) == 1 ? 14 + nodeA.g : 10 + nodeA.g
        rounds[i].f = rounds[i].h + rounds[i].g

        rounds[i].p = nodeA
        this.openList.add(rounds[i])

        if (rounds[i].x == nodeB.x && rounds[i].y == nodeB.y) {
            // 如果end就在周围 就直接返回end 并将end.p指向start
            nodeB.p = nodeA
            return [nodeB, nodeA]
        }
    }

    // 重复以下步骤
    var time = XLEN * YLEN
    while (time--) {

        // 1 遍历this.openList 找到最小格 作为选定方格
        var tempArr = Array.from(this.openList).sort(function (a, b) {
            return a.f - b.f
        })

        //  如果有多个相同最小值 取距离最近的那个
        var minArr = []
        minArr.push(tempArr[0])

        for (var i = 1; i < tempArr.length; i++) {
            if (tempArr[0].f == tempArr[i].f) {
                minArr.push(tempArr[i])
            }
        }

        minArr.sort(function (a, b) {
            return a.h - b.h
        })

        var curNode = minArr[0]

        // 2 对选定方格做以下操作

        //      a.从this.openList取出放到this.closeList中
        for (var key of this.openList) {
            if (key.x == curNode.x && key.y == curNode.y) {
                this.closeList.add(key)
                this.openList.delete(key)
            }
        }

        //      b.检查与该方格相邻的格子, 忽略在this.closeList的格子
        rounds = this.getCross(curNode, this.map)

        if (!rounds) {
            console.log('没有路径')
            return false
        }

        for (var i = 0; i < rounds.length; i++) {
            // 如果检查的格子不在this.openList则加入this.openList 并设置父节点为cur
            // 计算f = g + h
            rounds[i].h = this.calcDistance(rounds[i], nodeB)
            rounds[i].g = Math.abs(curNode.x - rounds[i].x) == 1 && Math.abs(curNode.y - rounds[i].y) == 1 ? 14 + curNode.g : 10 + curNode.g
            rounds[i].f = rounds[i].h + rounds[i].g

            this.openList.add(rounds[i])
            rounds[i].p = curNode

        }

        // 如果nodeB 在openList 中 返回路径 
        if (this.inList(nodeB.x, nodeB.y, this.openList) != false) {
            nodeB.p = curNode
            var path = []
            var cur = nodeB
            // 把路径填到数组
            while (cur) {
                path.push(cur)
                cur = cur.p
            }
            return path
            break;
        }
    }
}
