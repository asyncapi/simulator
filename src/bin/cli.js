#!/usr/bin/env node
const {Command} = require('commander');
const program = new Command();
const readline = require('readline');
const chalk = require('chalk');
const filesystem = require('fs');
const path = require('path');
const  {asyncParser} = require('../parser/index');

const verifyInput_ParseApi =  (rd, file) => {
  const handlingContext = this;
  handlingContext.ready = false;
  handlingContext.rd = rd;
  handlingContext.file = file;
  const yamlJsonRegex = RegExp(/^.*\.(json|yaml)$/, 'gm');
  const inputLoop = () => {
    handlingContext.rd.question('\nEnter a proper asyncApi document filepath:',(answer) => {
      filesystem.access(answer , 1 , (err) => {
        if (err) {
          console.log(`\nError in accessing provided file \nDetails:${err}\n\n`);
          inputLoop();
        } else if (!String(answer).match(yamlJsonRegex)) {
          console.log('\nPlease provide a proper filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
          inputLoop();
        } else {
          handlingContext.ready = true;
          handlingContext.file = answer;
          parseAsyncApi();
        }
      });
    });
  };

  rd.write(chalk.blueBright(`
  Async api Fluffy-robot
  `));
  rd.write('\nWelcome ');

  if (!!file) {
    if (!String(file).match(yamlJsonRegex)) {
      console.log('\nPlease provide a correctly formatted filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
      inputLoop();
    }
  } else {
    rd.write('\nFilepath not provided');
    inputLoop();
  }

  function parseAsyncApi() {
    if (handlingContext.ready) {
      const parser = asyncParser(handlingContext.file);
      parser.Parse();
      parser.mapAsyncApiToHandler().then((res) => {
        handlingContext.ParsedAndFormated = res;
      });
    } else {
      rd.write('\nUnable to complete AsyncApi File parsing. The file is either non-Existent or there was an unknown Error.\nPress Ctrl + c to terminate');
    }
  }

  function getParsedData () {
    return handlingContext.ready? handlingContext.ParsedAndFormated : null;
  }

  return {
    getParsedData
  };
};

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

const HandlingInstance = verifyInput_ParseApi(cliInterface, path.resolve(options.filepath));

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

