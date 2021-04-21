#!/usr/bin/env node

const {Command} = require('commander');
const program = new Command();
const readline = require('readline')
const chalk = require("chalk");
const filesystem = require('fs')
const  {AsyncParser} = require('../parser')

const setup = async (interface, file) => {
    var filepath;



    const handleFilepath = async (filepath = '') => {
        if (filepath === '') await promtForFilepath(true)

        const ParsedObject = await  AsyncParser(filepath)
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




program.version('0.0.1', 'v', 'async-api performance tester cli version');

program
    .requiredOption('-f, --filepath <type>', 'The filepath of a async-api specification yaml or json file');

program.parse(process.argv);

const cliInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const options = program.opts();
setup(cliInterface, options.filepath)


cliInterface.on("SIGINT", () => {
    console.log('\nShutting down')
    process.exit()
})
cliInterface.on("close", () => {
    console.log('\nAsync-api performance tester instance closed')
    process.exit()
})
process.on("uncaughtException", (err) => {
    console.log(err)
    process.exit()
})
