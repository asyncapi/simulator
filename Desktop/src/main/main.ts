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
import { parse, AsyncAPIDocument } from '@asyncapi/parser';
import { readFileSync } from 'fs';



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

function handleSetTitle (_event: any) {
  console.log('hello_form_main')
}

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
      // event.returnValuereturn  =  parseYamlFile(filePath);
      // parseYamlFile(filePath)
      // return filePath;
      // console.log('reply has been sent')
      mainWindow.webContents.send('asynchronous-message', filePath);
    }
  }).catch(err => {
    console.error('Error:', err);
  });

}

// async function parseYamlFile(filePath: string): Promise<AsyncAPIDocument | void> {
//   try {
//     const yamlContent: string = readFileSync(filePath, 'utf8');
//     const parsedAsyncAPI: AsyncAPIDocument = await parse(yamlContent);
//     console.log('Parsed AsyncAPI:', parsedAsyncAPI);
//     console.log(parsedAsyncAPI.info().version())
//     // Process the parsed AsyncAPI object as needed
//     console.log('first sending from here')
//     // return parsedAsyncAPI;
    
//   } catch (error) {
//     console.error('Error parsing YAML file:', error);
//   }
// }

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });

    ipcMain.on('set-title', handleSetTitle)

    ipcMain.handle('fetch-user-data', (_event) => {
      // Perform operations in the main process
      // For example, fetch user data from a database or perform other tasks
      const userData = { name: 'John Doe', age: 30 };
    
      return userData; // Return the data to the renderer process
    });
    //We will handle loading of the file when the button is clicked.
    ipcMain.on('button-click', handleFileLoad)
  })
  .catch(console.log);
