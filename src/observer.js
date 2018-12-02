function Observer(data) {
    this.data = data
    this.init(this.data)
}

Observer.prototype = {
    init: function (data) {
        if (typeof data != 'object' || !data) {
            return
        }

        var self = this
        Object.keys(data).forEach(function (key) {
            self.defineProp(data, key, data[key])
        })
    },
    defineProp: function (data, key, val) {
        // observer(val)
        var dep = new Dep()
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                // console.log('getter')
                if (Dep.target) {
                    dep.addSub(Dep.target)
                }
                return val
            },
            set: function (newVal) {
                // console.log('setter')
                if (newVal != val) {
                    val = newVal
                    dep.notify()
                }
            }
        })
    }
}


function Dep() {
    this.subs = []
}

Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub)
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update()
        })
    }
}