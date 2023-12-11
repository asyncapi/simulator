/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
// @ts-ignore
import yamlParser from 'js-yaml';
import { requestManager, parserAndGenerator } from '@asyncapi/simulator';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
// eslint-disable-next-line import/extensions
import autoSave from './tempScenarioSave';


const aedes = require('aedes')()
const httpServer = require('http').createServer()
const ws = require('websocket-stream')



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
ipcMain.handle('editor/visualizeRequest', (event, scenario, format) => {
  let scenarioParsed = {};
  if (format === 'json') scenarioParsed = JSON.parse(scenario);
  else scenarioParsed = yamlParser.load(scenario);

  console.log(scenarioParsed);
  Object.assign(tempScenarioSave, { ...scenarioParsed });
  parserAndGenerator(
    path.resolve(__dirname, 'save.yaml'),
    path.resolve(__dirname, 'save.json')
  )
    .then((res: any) => {
      dataFromParser = res;
      event.reply('editor/visualizationReady', res);
    })
    .catch((err: any) => {
      console.log('---------ERROR');
      console.log(err);
    });
});

ipcMain.handle('editor/action', async (_event, actionName) => {
  const managerInstance = requestManager();

  await managerInstance.createReqHandler();

  await managerInstance.startScenario(actionName);
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

//------------------------------------------*******---------------------------------

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

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


async function handleFileLoad () {
  const options = {
    title: 'Open File',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'Text Files', extensions: ['yaml'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  };

  let filePath;

  dialog.showOpenDialog(options).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      filePath = result.filePaths[0];
      console.log('Selected File:', filePath);
      mainWindow.webContents.send('asynchronous-message', filePath);
    }
  }).catch(err => {
    console.error('Error:', err);
  });

}

function startServer() {
  
  const port = 1883

  ws.createServer({ server: httpServer }, aedes.handle)

  httpServer.listen(port, function () {
    console.log('websocket server listening on port ', port)
  })

}

function stopServer() {
  httpServer.close(function () {
    console.log('websocket server stopped')
  })
 }


app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });

    ipcMain.on('button-click', handleFileLoad)
    ipcMain.on('start-aedes', startServer)
    ipcMain.on('stop-aedes', stopServer)

  })
  .catch(console.log);
