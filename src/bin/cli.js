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
 * @param scenarioFile
 * @returns {{getParsedData: (function(): any | null)}}
 */
const verifyInput_ParseFile =  async (rd, file, scenarioFile) => {
  const handlingContext = this;
  handlingContext.asyncApiReady = false;
  handlingContext.scenarioReady = false;
  handlingContext.rd = rd;
  //handlingContext.file = file;
  //handlingContext.scenarioFile = scenarioFile;
  const yamlJsonRegex = RegExp(/^.*\.(json|yaml)$/, 'gm');
  const inputLoopAsyncApiFile = () => {
    handlingContext.rd.question('\nEnter a proper asyncApi document filepath:', (filepath) => {
      filesystem.access(filepath, 1, (err) => {
        if (err) {
          rd.write(`\nError in accessing provided file \nDetails:${err}\n\n`);
          inputLoopAsyncApiFile();
        } else if (!String(filepath).match(yamlJsonRegex)) {
          rd.write('\nPlease provide a proper filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
          inputLoopAsyncApiFile();
        } else {
          handlingContext.asyncApiReady = true;
          handlingContext.file = filepath;
        }
      });
    });
  };

  const inputLoopScenario = () => {
    handlingContext.rd.question('\nEnter a proper scenario document filepath:', (filepath) => {
      filesystem.access(scenarioFile, 1, (err) => {
        if (err) {
          rd.write(`\nError in accessing provided scenario file \nDetails:${err}\n\n`);
          inputLoopScenario();
        } else if (!String(scenarioFile).match(yamlJsonRegex)) {
          rd.write('\nPlease provide a proper scenario filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
          inputLoopScenario();
        } else {
          handlingContext.scenarioReady = true;
          handlingContext.scenarioFile = scenarioFile;
          parse_Connect_AsyncApi_Scenario();
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
      rd.write('\nPlease provide a correctly formatted filepath for -f option ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
      inputLoopAsyncApiFile();
    } else {
      handlingContext.file = file;
      handlingContext.asyncApiReady = true;
    }
  } else {
    rd.write('\nFilepath for async api file not provided');
    inputLoopAsyncApiFile();
  }

  if (!!scenarioFile) {
    if (!String(file).match(yamlJsonRegex)) {
      rd.write('\nPlease provide a correctly formatted filepath for -s option ex:\'./scenario.json ./scenario.yaml\':\n');
      inputLoopScenario();
    } else {
      handlingContext.scenarioFile = scenarioFile;
      handlingContext.scenarioReady = true;
      parse_Connect_AsyncApi_Scenario();
    }
  } else {
    rd.write('\nScenario filepath not provided');
    inputLoopScenario();
  }

  function parse_Connect_AsyncApi_Scenario() {
    if (!!(handlingContext.asyncApiReady && handlingContext.scenarioReady)) {
      handlingContext.ParsedAndFormated = scenarioParserAndConnector(handlingContext.file,handlingContext.scenarioFile,{});
    } else {
      rd.write('\nUnable to complete parsing of AsyncApi and scenario files. The files are either non-Existent or there was an  Error.\nPress Ctrl + c to terminate');
    }
  }

  return handlingContext.asyncApiReady && handlingContext.scenarioReady ? await handlingContext.ParsedAndFormated : null;
};

(async function Main ()  {
  program.version('0.0.1', 'v', 'async-api performance tester cli version');

  program
    .requiredOption('-f, --filepath <type>', 'The filepath of a async-api specification yaml or json file.')
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
