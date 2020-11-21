const { app, BrowserWindow, ipcMain } = require('electron');
const { channels } = require('../src/shared/constant');
const { changeRedsocksConfig, stopRedsocks, activeRedsocks } = require('../src/shared/active_redsocks_config');
const { readFiles, saveFile } = require('../src/shared/read_write_redsocks_config');
const path = require('path');
const url = require('url');
let mainWindow;
function createWindow() {
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on(channels.ACTIVE_REDSOCKS, () => {
  activeRedsocks((error) => { console.log(error) });
});

ipcMain.on(channels.CHANGE_REDSOCKS_CONFIG, (event, arg) => {
  changeRedsocksConfig(arg[0], arg[1], () => { console.log('error') });
});

ipcMain.on(channels.SAVE_CONFIG, (event, arg) => {
  saveFile(arg[0],arg[1]);
});

ipcMain.on(channels.STOP_REDSOCKS, () => {
  stopRedsocks((error) => { console.log('error stopeeando ' + error) })
});

ipcMain.on(channels.READ_FILES, (event) => {
  readFiles('/home/alejandrorh/.redsocksui/configFiles/', (content) => {
    event.sender.send(channels.READ_FILES, {
      files: content,
      currentConfig: content[0].fileName
    });
  });

});