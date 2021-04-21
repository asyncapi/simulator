const process = require("process")
const rdl = require("readline")
class LoadingBar {
    constructor(size) {
        this.size = size
        this.cursor = 0
        this.timer = null
    }
    start() {

        process.stdout.write("\x1B[?25l")
        for (let i = 0; i < this.size; i++) {
             process.stdout.write("\u2591")


        }

        rdl.cursorTo(process.stdout, 0, 1);
        this.timer = setInterval(() => {
            process.stdout.write("\u2588")
            this.cursor++;
            if (this.cursor >= this.size) {
                clearTimeout(this.timer)
            }
        }, 100)
    }
}
const ld = new LoadingBar(50)
ld.start()