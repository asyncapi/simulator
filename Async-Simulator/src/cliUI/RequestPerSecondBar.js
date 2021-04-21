const readline = require("readline")
const filesystem = require("fs")
const chalk = require('chalk')
const clear = require('clear')
const asyncapi = require('@asyncapi/parser/lib/index')
const Sparkline = require('clui').Sparkline;
let reqsPerSec = [10,12,3,7,12,9,23,10,9,19,16,18,12,12];

const interface = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})


process.stdout.write("\x1B[?25l")
process.stdout.write("\x1B[?25h")
setInterval(() => {
    reqsPerSec.push(Math.ceil(Math.random()*100))
    clear()
    interface.write(`${Sparkline(reqsPerSec, 'reqs/sec')}\n`);
}, 1000)

setInterval(()=>{
    clear()
    reqsPerSec = reqsPerSec.slice(reqsPerSec.length-3)
    clearInterval()
},9000)