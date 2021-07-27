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

const checkFilepath = (asyncFile,regex) => {
  let correctType = true;
  if (!String(asyncFile).match(regex)) {
    console.log('\nError: Filepath provided does not point to a yaml or json file. You must provided either a yaml or json.');
    correctType = false;
  }
  let fileAccess = true;
  try {
    filesystem.accessSync(asyncFile , filesystem.constants.R_OK);
  } catch (err) {
    console.log('Error: Accessing the provided file. Make sure it exists and the user in the terminal session has read access rights.');
    fileAccess = false;
  }
  return correctType && fileAccess;
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

const inputLoopScenario = (rd,scenario,regex) => {
  const res = checkFilepath(scenario,regex);

  if (!res) {
    return new Promise((resolve) => {
      rd.question('\nPlease provide an existent yaml or json file .It should abide by the scenario json schema.\nScenario filepath:',(answer) => {
        const inputLoop = (filepath) => {
          const res = checkFilepath(filepath,regex);
          if (!res) {
            rd.question('Please fix errors and provide a correctly formatted and accessible file in filepath.\nScenario filepath:',(answer) => {
              inputLoop(answer);
            });
          } else {
            resolve(filepath);
          }
        };

        inputLoop(answer);
      });
    });
  }
  return  new Promise((resolve) => {resolve(scenario);});
};

const inputLoopAsyncApi = (rd,asyncFile,regex) => {
  const res = checkFilepath(asyncFile,regex);

  if (!res) {
    return new Promise((resolve) => {
      rd.question('\nPlease provide an existent yaml or json file.It should abide by the asyncApi Spec.\nAsyncApi filepath:',(answer) => {
        const inputLoop = (filepath) => {
          const res = checkFilepath(filepath,regex);
          if (!res) {
            rd.question('Please fix errors and provide a correctly formatted and accessible file in filepath.\nAsyncApi Filepath:',(answer) => {
              inputLoop(answer);
            });
          } else resolve(filepath);
        };

        inputLoop(answer);
      });
    });
  }
  return new Promise((resolve) => {
    resolve(asyncFile);
  });
};

/**
 * Verifies the command line arguments, re-prompts in case of error. Parses asyncApiF and returns the object representation.
 * @returns {Promise<*|null>}
 * @param rd
 * @param asyncApiF
 * @param scenarioFile
 */
const verifyInput_getData =  async (rd, asyncApiF,scenarioFile) => {
  const yamlJsonRegex = RegExp(/^.*\.(json|yaml)$/, 'gm');

  console.log(chalk.blueBright(`
  Async api Fluffy-robot
  `));
  console.log('\nWelcome ');

  asyncApiF = await inputLoopAsyncApi(rd,asyncApiF,yamlJsonRegex);

  scenarioFile = await inputLoopScenario(rd,scenarioFile,yamlJsonRegex);

  const structuredData = await  scenarioParserAndConnector(asyncApiF,scenarioFile);

  const availableServers = Object.keys(structuredData.servers);

  structuredData.targetedServer = await inputLoopServer(availableServers);

  return   structuredData;
};

(async function Main ()  {
  program.version('0.0.1', '-v', 'async-api performance tester cli version');

  program
    .requiredOption('-f, --filepath <type>', 'The filepath of a async-api specification yaml or json asyncApiF')
    .requiredOption('-s, --scenario <type>', 'The filepath of a asyncApiF defining a scenario based on the spec.')
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

