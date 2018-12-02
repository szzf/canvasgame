function Watcher(vm, exp, cb) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.value = this.get()
}

Watcher.prototype = {
    update: function () {
        var newVal = this.vm[this.exp]
        var oldVal = this.value
        if (newVal != oldVal) {
            this.value = newVal
            this.cb.call(this.vm, newVal, oldVal)
        }

    },
    get: function () {
        Dep.target = this
        var value = this.vm[this.exp]
        // console.log(value)
        Dep.target = null
        return value
    }
}