#!/usr/bin/env node
const {Command} = require('commander');
const program = new Command();
const readline = require('readline');
const chalk = require('chalk');
const filesystem = require('fs');
const path = require('path');
const  {asyncParser} = require('../parser/index');

const filepathHandling1 =  (rd, file) => {
  const handlingContext = this;
  handlingContext.rd = rd;
  handlingContext.file = file;

  const inputLoop = () => {
    handlingContext.rd.question('\nEnter a proper asyncApi document filepath ',(answr) => {
      filesystem.access(answr , 1 , (err) => {
        if (err) {
          handlingContext.rd.write(`\nError in accessing provided file \nDetails:${err}\n\n`);
          inputLoop();
        } else if (!String(answr).match(RegExp(/^.*\.(json|yaml)/, 'gm'))) {
          handlingContext.rd.write('\nPlease provide a proper filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
          inputLoop();
        } else {
          handlingContext.file = answr;
          parseAsyncApi();
        }
      });
    });
  };

  rd.write(chalk.blueBright(`
  Async api traffic simulator
  `));
  rd.write('\nWelcome ');

  if (!!file) {
    filesystem.access(file , 1 , (err) => {
      if (err) {
        rd.write(`\nError in accessing provided file \nDetails:${err}\n\n`);
        inputLoop();
      }
    });
  } else {
    rd.write('\nFilepath not provided');
    inputLoop();
  }

  function getFile () {
    return handlingContext.file;
  }

  function parseAsyncApi() {
    const parser = asyncParser(handlingContext.file);
    parser.Parse();
    parser.mapAsyncApiToHandler().then((res) => {console.log(res);});
  }
  return {
    getFile,
    parseAsyncApi
  };
};
const run = () => {
  program.version('0.0.1', 'v', 'async-api performance tester cli version');

  program
    .requiredOption('-f, --filepath <type>', 'The filepath of a async-api specification yaml or json file')
    .option('-b, --basedir <type>', 'The basepath from which relative paths are computed.\nDefaults to the directory where simulator.sh resides.');

  program.parse(process.argv);

  const cliInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const options = program.opts();

  filepathHandling1(cliInterface, path.resolve(options.filepath));

  cliInterface.on('SIGINT', () => {
    console.log('\nShutting down');
    process.exit();
  });
  cliInterface.on('close', () => {
    console.log('\nAsync-api performance tester instance closed');
    process.exit();
  });
  process.on('uncaughtException', (err) => {
    console.log(err);
    process.exit();
  });
};

run();
