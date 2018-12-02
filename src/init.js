var XLEN = 30
var YLEN = 30
var BASICLINE = 1
var SQUAREWIDTH = 30
var SPEED = 120
var MAXBODYS = 20
var SCORES = 0
var ISGAMEOVER = false
var TYPESTRATEGY = {
    0: '#eee',  // 地板
    5: 'red', // 食物
    6: 'pink', // 路径
    11: 'darkblue',   // 蛇头
    12: 'skyblue',  // 蛇身
    18: 'gray',  // AI蛇身
    19: '#444',   // AI蛇头
    10: '#222',  // 障碍物
}
var canvas = document.querySelector('#canvas')
var ctx = canvas.getContext('2d')
canvas.width = XLEN * SQUAREWIDTH
canvas.height = YLEN * SQUAREWIDTH

// 生成地图
function Map(x, y) {
    this.map = {}
    this.ground = {}
    this.stones = []
    this.foods = []
    this.snakeBodys = []
    this.path = []
    this.init(x, y)
}

Map.prototype = {
    init: function (countX, countY) {
        for (var i = 0; i < countX; i++) {
            for (var j = 0; j < countY; j++) {
                if (i == 0 || i == countX - 1 || j == 0 || j == countY - 1) {
                    this.map[j + '-' + i] = 10
                } else {
                    this.map[j + '-' + i] = 0
                    this.ground[j + '-' + i] = 0
                }
            }
        }
    },

    initStones: function (count) {

        var length = Object.keys(this.ground).length
        for (var i = 0; i < count; i++) {
            var random = Math.floor(Math.random() * (length - i))
            var key = Object.keys(this.ground)[random]
            this.map[key] = 10
        }
    },
    initFoods: function (count = 1) {

        var length = Object.keys(this.ground).length
        for (var i = 0; i < count; i++) {
            var random = Math.floor(Math.random() * (length - i))
            var key = Object.keys(this.ground)[random]
            this.map[key] = 5
        }
    },
    stringToObj: function (string) {
        if (typeof string != 'string') {
            console.log('类型错误')
            return
        }
        var temp = string.split('-')
        return {
            x: parseInt(temp[0]),
            y: parseInt(temp[1])
        }
    }
}

// 定义一个基类
function Square(x, y, type) {
    this.x = x
    this.y = y
    this.type = type
}

