#!/usr/bin/env node
const {Command} = require('commander');
const program = new Command();
const readline = require('readline');
const chalk = require('chalk');
const filesystem = require('fs');
const path = require('path');
const  {asyncParser} = require('../parser/index');

/**
 * Verifies the command line arguments , repromts in case of error. ParsesFile and return a object
 * to be provided to the event Handler.
 * @param rd
 * @param file
 * @returns {{getParsedData: (function(): any | null)}}
 */
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
          rd.write(`\nError in accessing provided file \nDetails:${err}\n\n`);
          inputLoop();
        } else if (!String(answer).match(yamlJsonRegex)) {
          rd.write('\nPlease provide a proper filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
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
      rd.write('\nPlease provide a correctly formatted filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
      inputLoop();
    } else {
      handlingContext.file = file;
      handlingContext.ready = true;
      parseAsyncApi();
    }
  } else {
    rd.write('\nFilepath not provided');
    inputLoop();
  }

  function parseAsyncApi() {
    if (handlingContext.ready) {
      const parser = asyncParser(handlingContext.file);
      parser.mapAsyncApiToHandler().then((res) => {
        handlingContext.ParsedAndFormated = res;
      }).catch((err) => {
        rd.write('\nError Parsing Content:');
        rd.write(err);
      });
    } else {
      rd.write('\nUnable to complete AsyncApi File parsing. The file is either non-Existent or there was an unknown Error.\nPress Ctrl + c to terminate');
    }
  }

  /**
   * Returns the formated parsed data that is ready to be provided
   * to event handler.
   * @returns {*|null}
   */
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

