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

const enumerateOptions = (serverNames) => {
  let result = '';
  serverNames.forEach((value,i) => {
    result += `\n${i}: ${value}`;
  });
  return result;
};

const checkFilepath = (asyncFile,regex,basedir) => {
  if (!String(asyncFile).match(regex)) {
    console.log('\nError: Filepath provide does not point to a yaml or json file. You must provided either a yaml or json.');
    return false;
  }
  try {
    if (!basedir) {
      filesystem.accessSync(asyncFile , filesystem.constants.R_OK);
    } else {
      filesystem.accessSync(path.resolve(basedir, asyncFile) , filesystem.constants.R_OK);
    }
  } catch (err) {
    console.log('Error: Accessing the provided file. Make sure it exists and the user in the terminal session has read access rights.');
    return false;
  }
  return true;
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

const inputLoopScenario = (rd,scenario,regex,basedir) => {
  const isFileValid = checkFilepath(scenario,regex,basedir);
  if (!isFileValid) {
    return new Promise((resolve) => {
      rd.question('\nPlease provide an existent yaml or json file .It should abide by the scenario json schema.\nScenario filepath:',(answer) => {
        const inputLoop = (filepath) => {
          const isFileValid = checkFilepath(filepath,regex,basedir);
          if (!isFileValid) {
            rd.question('Please fix errors and provide a correctly formatted and' +
                ' accessible file in filepath.\nScenario filepath:',inputLoop);
          } else {
            resolve(path.resolve(basedir,filepath));
          }
        };
        inputLoop(answer);
      });
    });
  }
  return Promise.resolve(path.resolve(basedir,scenario));
};

const inputLoopAsyncApi = (rd,asyncFile,regex,basedir) => {
  const isFileValid = checkFilepath(asyncFile,regex,basedir);
  if (!isFileValid) {
    return new Promise((resolve) => {
      rd.question('\nPlease provide an existent yaml or json file.It should abide by the asyncApi Spec.\nAsyncApi filepath:',(answer) => {
        const inputLoop = (filepath) => {
          const isFileValid = checkFilepath(filepath,regex,basedir);
          if (!isFileValid) {
            rd.question('Please fix errors and provide a correctly formatted and accessible file in filepath.\nAsyncApi Filepath:',inputLoop);
          } else resolve(path.resolve(basedir,filepath));
        };
        inputLoop(answer);
      });
    });
  }
  return Promise.resolve(path.resolve(basedir,asyncFile));
};

/**
 * Verifies the command line arguments, re-prompts in case of error. Parses AsyncApi File and returns the object representation.
 * @returns {Promise<*|null>}
 * @param rd
 * @param asyncApiFilepath
 * @param scenarioFile
 * @param basedir
 */
const verifyInputGetData =  async (rd, asyncApiFilepath,scenarioFile,basedir) => {
  const yamlJsonRegex = new RegExp(/^.*\.(json|yaml)$/, 'gm');

  console.log(chalk.blueBright(`
  Async api Fluffy-robot
  `));
  console.log('\nWelcome ');

  asyncApiFilepath = await inputLoopAsyncApi(rd,asyncApiFilepath,yamlJsonRegex,basedir);

  scenarioFile = await inputLoopScenario(rd,scenarioFile,yamlJsonRegex,basedir);

  const structuredData = await  scenarioParserAndConnector(asyncApiFilepath,scenarioFile);

  const availableServers = Object.keys(structuredData.servers);

  structuredData.targetedServer = await inputLoopServer(availableServers);

  return structuredData;
};

(async function Main ()  {
  program.version('0.0.1', '-v', 'AsyncApi simulator cli version.');

  program
    .requiredOption('-f, --filepath <type>', 'The filepath of a AsyncAPI document, as either yaml or json file.')
    .requiredOption('-s, --scenario <type>', 'The filepath of a json or yaml file which defines a scenario based on the spec.')
    .option('-b, --basedir <type>', 'The basePath from which relative paths are computed.\nDefaults to the directory where simulator.sh resides.','./');

  program.parse(process.argv);

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
  let asyncApiPath;
  let scenarioPath;
  const options = program.opts();
  if (options.basedir) {
    asyncApiPath = path.resolve(options.basedir,options.filepath);
    scenarioPath = path.resolve(options.basedir,options.scenario);
  } else {
    asyncApiPath = path.resolve(options.filepath);
    scenarioPath = path.resolve(options.scenario);
  }
  const structuredData = await verifyInputGetData(rdInterface, path.resolve(asyncApiPath),path.resolve(scenarioPath),options.basedir);
  const manager = RequestManager();
  await manager.createReqHandler(structuredData);
  await manager.startOperations();
}());

