#!/usr/bin/env node
const {Command} = require('commander');
const program = new Command();
const readline = require('readline');
const chalk = require('chalk');
const filesystem = require('fs');
const path = require('path');
const  {scenarioParserAndConnector} = require('../parser/index');
const {RequestManager} = require('../RequestHandler/RequestManager');
const rdInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const enumerateOptions = (serv) => {
  let res = '';
  serv.forEach((value,i) => {
    res += `\n${i}: ${value}`;
  });

  return res;
};

const inputLoopServer =  (availableServers) =>  {
  return new Promise((resolve) => {
    rdInterface.question('\nSelect the server you want to target\n' + 'Options' + `\n${enumerateOptions(availableServers)}\nSelect:` , (selectedServer) => {
      const questionLoop = (availableServers) => {
        rdInterface.question('\nPlease select one server id number from the list\n' + 'Options:' + `\n${enumerateOptions(availableServers)}\nSelect:` , (selectedServer) => {
          if (selectedServer < 0 || selectedServer > availableServers.length -1) {
            questionLoop(availableServers);
          } else {
            resolve(availableServers[parseInt(selectedServer, 10)]);
          }
        });
      };

      if (selectedServer < 0 || selectedServer > availableServers.length -1) {
        questionLoop(availableServers);
      } else {
        resolve(availableServers[parseInt(selectedServer, 10)]);
      }
    });
  });
};

function  parseAsyncApi(handlingContext) {
  if (handlingContext.ready && handlingContext.scenarioReady) {
    handlingContext.ParsedAndFormated = scenarioParserAndConnector(handlingContext.file,handlingContext.scenarioFile);
  } else {
    console.log('\nUnable to complete AsyncApi File parsing. The file is either non-Existent or there was an unknown Error.\nPress Ctrl + c to terminate');
  }
}

const inputLoopScenario = (handlingContext) => {
  handlingContext.rd.question(`\nEnter a proper ${chalk.blueBright('scenario')} document filepath:`, (scenarioFile) => {
    filesystem.access(scenarioFile, 1, (err) => {
      if (err) {
        console.log(`\nError in accessing provided ${chalk.blueBright('scenario')} file \nDetails:${err}\n\n`);
        inputLoopScenario(handlingContext);
      } else if (!String(scenarioFile).match(handlingContext.yamlJsonRegex)) {
        console.log(`\nPlease provide a proper ${chalk.blueBright('scenario')} filepath ex: ./myAsyncApi.json ./myAsyncApi.yaml:`);
        inputLoopScenario(handlingContext);
      } else {
        handlingContext.scenarioFile = scenarioFile;
        handlingContext.scenarioReady = true;
        parseAsyncApi(handlingContext);
      }
    });
  });
};

const inputLoopAsyncApi = (handlingContext) => {
  handlingContext.rd.question(`\nEnter a proper ${chalk.green('asyncApi')} document filepath:`, (filepath) => {
    filesystem.access(filepath, 1, (err) => {
      if (err) {
        console.log(`\nError in accessing provided file \nDetails:${err}\n\n`);
        inputLoopAsyncApi(handlingContext);
      } else if (!String(filepath).match(handlingContext.yamlJsonRegex)) {
        console.log('\nPlease provide a proper filepath ex: ./myAsyncApi.json ./myAsyncApi.yaml:');
        inputLoopAsyncApi(handlingContext);
      } else {
        handlingContext.ready = true;
        handlingContext.file = filepath;
        if (!handlingContext.scenarioFile) {
          inputLoopScenario(handlingContext);
        }
        // eslint-disable-next-line sonarjs/no-identical-functions
        filesystem.access(handlingContext.scenarioFile, 1, (err) => {
          if (err) {
            console.log(`\nError in accessing provided ${chalk.blueBright('scenario')} file \nDetails:${err}\n\n`);
            inputLoopScenario(handlingContext);
          } else if (!String(handlingContext.scenarioFile).match(handlingContext.yamlJsonRegex)) {
            console.log(`\nPlease provide a proper ${chalk.blueBright('scenario')} filepath ex: ./myAsyncApi.json ./myAsyncApi.yaml:`);
            inputLoopScenario(handlingContext);
          } else {
            //handlingContext.scenarioFile = handlingContext.scenarioFile;
            handlingContext.scenarioReady = true;
            parseAsyncApi(handlingContext);
          }
        }
        );
      }
    });
  });
};

/**
 * Verifies the command line arguments, re-prompts in case of error. Parses file and returns the object representation.
 * @returns {Promise<*|null>}
 * @param rd
 * @param file
 * @param scenarioFile
 */
const verifyInput_getData =  async (rd, file,scenarioFile) => {
  const handlingContext = this;
  handlingContext.ready = false;
  handlingContext.rd = rd;
  handlingContext.file = file;
  handlingContext.scenarioFile= scenarioFile;
  const yamlJsonRegex = RegExp(/^.*\.(json|yaml)$/, 'gm');
  handlingContext.yamlJsonRegex = yamlJsonRegex;

  console.log(chalk.blueBright(`
  Async api Fluffy-robot
  `));
  console.log('\nWelcome ');

  if (!!file) {
    if (!String(file).match(yamlJsonRegex)) {
      console.log('\nPlease provide a correctly formatted filepath ex: ./myAsyncApi.json ./myAsyncApi.yaml:');
      inputLoopAsyncApi(handlingContext);
    } else {
      handlingContext.file = file;
      handlingContext.ready = true;
      if (!scenarioFile) {
        inputLoopScenario(handlingContext);
      } else if (!String(scenarioFile).match(yamlJsonRegex)) {
        inputLoopScenario(handlingContext);
      } else {
        handlingContext.scenarioFile = scenarioFile;
        handlingContext.scenarioReady = true;
        parseAsyncApi(handlingContext);
      }
    }
  } else {
    console.log('\nFilepath not provided');
    inputLoopAsyncApi(handlingContext);
  }
  const structuredData = await handlingContext.ParsedAndFormated;
  const availableServers = Object.keys(structuredData.servers);

  structuredData.targetedServer = await inputLoopServer(availableServers);

  return   structuredData;
};

(async function Main ()  {
  program.version('0.0.1', '-v', 'async-api performance tester cli version');

  program
    .requiredOption('-f, --filepath <type>', 'The filepath of a async-api specification yaml or json file')
    .requiredOption('-s, --scenario <type>', 'The filepath of a file defining a scenario based on the spec.')
    .option('-b, --basedir <type>', 'The basepath from which relative paths are computed.\nDefaults to t he directory where simulator.sh resides.');

  program.parse(process.argv);
  ///Interface , SignalsHandling

  rdInterface.on('SIGINT', () => {
    console.log('\nShutting down');
    process.exit();
  });
  rdInterface.on('close', () => {
    console.log('\nAsync-api performance tester instance closed');
    process.exit();
  });
  rdInterface.on('uncaughtException', (err) => {
    console.log(err);
    process.exit();
  });
  process.on('SIGINT', () => {
    console.log('\nShutting down');
    process.exit();
  });
  process.on('close', () => {
    console.log('\nAsync-api performance tester instance closed');
    process.exit();
  });
  process.on('uncaughtException', (err) => {
    console.log(err);
    process.exit();
  });

  const options = program.opts();

  const structuredData = await verifyInput_getData(rdInterface, path.resolve(options.filepath),path.resolve(options.scenario));

  const manager = RequestManager();
  await manager.createReqHandler(structuredData);
  await manager.startOperations();
}());

