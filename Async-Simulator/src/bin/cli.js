#!/usr/bin/env node
const {Command} = require('commander');
const program = new Command();
const readline = require('readline');
const chalk = require('chalk');
const filesystem = require('fs');
const path = require('path');
const  {asyncParser} = require('../parser/index');

const filepathHandling = async (interface, file) => {
  let filepath;

  const promtForFilepath = async () => {
    interface.question('\nPlease provide a  filepath for a yaml asyncApiFile', (answr) => {
      if (!String(answr).match(RegExp(/^.*\.(json|yaml)/, 'gm'))) {
        interface.write('\nPlease provide a proper filepath ex:\'./myAsyncApi.json ./myAsyncApi.yaml\':\n');
        promtForFilepath();
      } else {
        filesystem.stat(filepath, (err, stats) => {
          if (err) {
            interface.write('\nFile non Existent');
            promtForFilepath();
          } else {
            return  answr;
          }
        });
      }
    });
  };

  const handleFilepath = async (filepath = '') => {
    const ParserInstance = await  asyncParser(filepath);
    ParserInstance.Parse();
    ParserInstance.mapAsyncApiToHandler();
  };

  console.log(chalk.blueBright(`
  Async api traffic simulator
  `));
  if (!!file) {
    interface.write('\nWelcome to async api stress tester.');
    filesystem.access(file , 1 , (err) => {
      if (err) {
        console.log(`\nError in accessing provided file \nDetails:${err}`);
        file = promtForFilepath();
      }
    });
  } else {
    interface.question('Welcome to async api stress tester\nPlease provide a' +
        ' json or yml file with the api.\n',(path = '') => {
      file = path;
    });
    filesystem.access(file , 1 , (err) => {
      if (err) {
        console.log(`\nError in accessing provided file \nDetails:${err}`);
        file = promtForFilepath();
      }
    });
  }
  await handleFilepath(await file);
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
  filepathHandling(cliInterface, path.resolve(options.filepath));

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
