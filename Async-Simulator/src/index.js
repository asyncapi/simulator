const readline = require("readline")
const filesystem = require("fs")
const chalk = require('chalk')
const clear = require('clear')
const asyncapi = require('@asyncapi/parser/lib/index')
var Sparkline = require('clui').Sparkline;


const setup = async (interface, file) => {
    var filepath;


    const handleFilepath = (filepath = '') => {
        if (filepath === '') promtForFilepath(true)

        const apiFileContent = filesystem.readFileSync(String(filepath))
        const parsed = asyncapi.parse(apiFileContent.toString());
        parsed.then((res)=>console.log(res))
    }

    const promtForFilepath = async (i = true) => {

        // if(i==true){
        //
        //     interface.question('Welcome to async api stress tester\nPlease provide a' +
        //         ' json or yml file with the api.\n',(path = '') => {
        //        filepath = path
        //     })}
        interface.question('test', () => {
            if (!String(file).match(RegExp(/^.*\.(json|yaml)/, 'gm'))) {
                interface.write("\nPlease provide a proper filepath ex:'./myAsyncApi.json ./myAsyncApi.yaml'\n")
                promtForFilepath(false)
            } else {
                filesystem.stat(filepath, (err, stats) => {
                    if (err) {
                        interface.write('\nFile non Existent\n')
                        promtForFilepath(false)
                    }
                })
                interface.close()
            }
        })

    }


    console.log(chalk.blueBright('Welcome to async api stress tester'))

    if (!file)
        interface.question('\nPlease provide a' +
            ' json or yml file with the api.\n', (path = '') => {

            handleFilepath(path)
        })
    else handleFilepath(file)
}


module.exports = {setup}


//
// var Sparkline = require('clui').Sparkline;
// var reqsPerSec = [10,12,3,7,12,9,23,10,9,19,16,18,12,12];
//
// process.stdout.write("\x1B[?25l")
// process.stdout.write("\x1B[?25h")
// setInterval(() => {
//     reqsPerSec.push(Math.ceil(Math.random()*100))
//     clear()
//     interface.write(`${Sparkline(reqsPerSec, 'reqs/sec')}\n`);
// }, 1000)
//
// setInterval(()=>{
//     clear()
//     reqsPerSec = reqsPerSec.slice(reqsPerSec.length-3)
//     clearInterval()
// },9000)
//
//
