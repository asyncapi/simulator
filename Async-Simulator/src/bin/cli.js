#!/usr/bin/env node

const {Command} = require('commander');
const program = new Command();
const readline = require('readline')
const {setup} = require('../index')
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
