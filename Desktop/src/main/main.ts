/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import yamlParser from 'js-yaml';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { requestManager, parserAndGenerator } from '@asyncapi/simulator';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import autoSave from './tempScenarioSave';

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
// @ts-ignore

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore
const tempScenarioSave = autoSave('temp.json');

let mainWindow: BrowserWindow | null = null;

let dataFromParser = {};

console.log('---------------------------');
console.log(path.resolve(__dirname, 'test.yaml'));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
ipcMain.on('editor/visualizeRequest', (event, scenario, format) => {
  let scenarioParsed = {};
  if (format === 'json') scenarioParsed = JSON.parse(scenario);
  else scenarioParsed = yamlParser.load(scenario);

  console.log(scenarioParsed);
  Object.assign(tempScenarioSave, { ...scenario });
  parserAndGenerator(
    path.resolve(__dirname, 'test.yaml'),
    path.resolve(__dirname, 'temp.json')
  )
    .then((res: any) => {
      dataFromParser = res;
      event.reply('editor/visualizationReady', res);
    })
    .catch((err: any) => {
      console.log('---------ERROR');
      console.log(err);
    });
  // console.log(Object.assign(tempScenarioSave, { ...scenario.parsedJSON }));

  // parserAndGenerator(
  //   path.resolve(__dirname, 'test.yaml'),
  //   path.resolve(__dirname, 'temp.json')
  // )
  //   .then((dataFromParser: any) => {
  //     console.log(dataFromParser);
  //     event.reply('editor/visualizationReady', 'dataFromParser');
  //   })
  //   .catch((err: any) => {
  //     console.log(err);
  //   });
  // console.log(`--------------${dataFromParser}`);
  // event.reply('editor/visualizationReady', dataFromParser);
});

ipcMain.on('editor/action', (_event, actionName) => {
  const managerInstance = requestManager();
  managerInstance
    .createReqHandler(dataFromParser)
    .then(() => {
      managerInstance.startScenario(actionName);
    })
    .catch((err: any) => {
      console.log(err);
    });
  console.log('Sending to manager');
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const { initialize } = require('./setup');
  initialize();

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    frame: false,
    icon: getAssetPath('asyncapi-logo-only-color.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
