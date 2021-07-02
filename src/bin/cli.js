#!/usr/bin/env node
const {Command} = require('commander');
const program = new Command();
const readline = require('readline');
const chalk = require('chalk');
const filesystem = require('fs');
const path = require('path');
const  {scenarioParserAndConnector} = require('../parser/index');

/**
 * Verifies the command line arguments, re-prompts in case of error. Parses file and returns the object representation.
 * @param rd
 * @param file
 * @returns {Promise<*|null>}
 */
const verifyInput_ParseFile =  async (rd, file,scenarioFile) => {
  const handlingContext = this;
  handlingContext.ready = false;
  handlingContext.rd = rd;
  handlingContext.file = file;
  handlingContext.scenarioFile= scenarioFile;
  const yamlJsonRegex = RegExp(/^.*\.(json|yaml)$/, 'gm');

  const inputLoopScenario = () => {
    rd.question('\nEnter a proper scenario document filepath:', (scenarioFile) => {
      filesystem.access(scenarioFile, 1, (err) => {
        if (err) {
          console.log(`\nError in accessing provided scenario file \nDetails:${err}\n\n`);
          inputLoopScenario();
        } else if (!String(scenarioFile).match(yamlJsonRegex)) {
          console.log('\nPlease provide a proper scenario filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
          inputLoopScenario();
        } else {
          handlingContext.scenarioFile = scenarioFile;
          handlingContext.scenarioReady = true;
          parseAsyncApi();
        }
      });
    });
  };
  
  const inputLoopAsyncApi = () => {
    rd.question('\nEnter a proper asyncApi document filepath:', (filepath) => {
      filesystem.access(filepath, 1, (err) => {
        if (err) {
          console.log(`\nError in accessing provided file \nDetails:${err}\n\n`);
          inputLoopAsyncApi();
        } else if (!String(filepath).match(yamlJsonRegex)) {
          console.log('\nPlease provide a proper filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
          inputLoopAsyncApi();
        } else {
          handlingContext.ready = true;
          handlingContext.file = filepath;
          if (!scenarioFile) {
            inputLoopScenario();
          } else {
            handlingContext.scenarioReady = true;
            parseAsyncApi();
          }
        }
      });
    });
  };

  console.log(chalk.blueBright(`
  Async api Fluffy-robot
  `));
  console.log('\nWelcome ');

  if (!!file) {
    if (!String(file).match(yamlJsonRegex)) {
      console.log('\nPlease provide a correctly formatted filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
      inputLoopAsyncApi();
    } else {
      handlingContext.file = file;
      handlingContext.ready = true;
      if (!scenarioFile) {
        inputLoopScenario();
      } else if (!String(scenarioFile).match(yamlJsonRegex)) {
        inputLoopScenario();
      } else {
        handlingContext.scenarioFile = scenarioFile;
        handlingContext.scenarioReady = true;
        parseAsyncApi();
      }
    }
  } else {
    rd.write('\nFilepath not provided');
    inputLoopAsyncApi();
  }

  function parseAsyncApi() {
    if (handlingContext.ready && handlingContext.scenarioReady) {
      handlingContext.ParsedAndFormated = scenarioParserAndConnector(handlingContext.file,handlingContext.scenarioFile);
    } else  {
      rd.write('\nUnable to complete AsyncApi File parsing. The file is either non-Existent or there was an unknown Error.\nPress Ctrl + c to terminate');
    }
  }

  return handlingContext.ready ? await handlingContext.ParsedAndFormated : null;
};

(async function Main ()  {
  program.version('0.0.1', 'v', 'async-api performance tester cli version');

  program
    .requiredOption('-f, --filepath <type>', 'The filepath of a async-api specification yaml or json file')
    .requiredOption('-s, --scenario <type>', 'The filepath of a file defining a scenario based on the spec.')
    .option('-b, --basedir <type>', 'The basepath from which relative paths are computed.\nDefaults to the directory where simulator.sh resides.');

  program.parse(process.argv);
  ///Interface , SignalsHandling
  const cliInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  cliInterface.on('SIGINT', () => {
    console.log('\nShutting down');
    process.exit();
  });
  cliInterface.on('close', () => {
    console.log('\nAsync-api performance tester instance closed');
    process.exit();
  });
  cliInterface.on('uncaughtException', (err) => {
    console.log(err);
    process.exit();
  });

  const options = program.opts();

  await verifyInput_ParseFile(cliInterface, path.resolve(options.filepath),path.resolve(options.scenario));
}());