const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const { channels } = require('../src/shared/constant');
const { changeRedsocksConfig, stopRedsocks, activeRedsocks, runOnStart } = require('../src/shared/active_redsocks_config');
const { readFiles, saveFile, readConfig, updateConfig} = require('../src/shared/read_write_redsocks_config');
const path = require('path');
const url = require('url');
let mainWindow;
let tray;
let contextMenu;
let configFiles;
let appConfig;
let originalMenu = [
  {
    label: 'ADVANCED CONFIG', type: 'normal', click: function () {
      mainWindow.show();
    }
  },

  {
    label: 'EXIT', type: 'normal', click: function () {
      // call the function
      stopRedsocks(appConfig.password, (error) => { console.log('start ' + error) })
      app.quit();
    }
  },
  {
    label: 'INACTIVE', type: 'radio', click: function () {
      appConfig.active = false
      updateConfig(appConfig);
      stopRedsocks(appConfig.password, (error) => { console.log('start ' + error) })
      mainWindow.webContents.send(channels.UPDATE_ACTIVE,false)
    }
  }
];

let itemsMenu = [...originalMenu];

function fillMenu() {
  configFiles.forEach(element => {
    itemsMenu.push({
      label: element.fileName,
      type: "radio",
      checked: element.fileName === appConfig.currentConfig,
      click: function () { 
        let menui = null;
        contextMenu.items.forEach(element => {
          if (element.checked) {
            menui = element;
            appConfig.currentConfig = element.label
            updateConfig(appConfig);
            mainWindow.webContents.send(channels.UPDATE_CURRENT_CONFIG,element.label)
          }
        });
        changeRedsocksConfig(menui.label, appConfig.active, appConfig.password, (error) => { console.log('changing ' + error) })
      }
    })
  });
}

function createTrayMenu() {
  tray = new Tray(path.join(__dirname, 'trayIcon.png'));
  contextMenu = Menu.buildFromTemplate(itemsMenu);
  tray.setContextMenu(contextMenu);

}

function createMainWindow() {
  const startUrl = process.env.ELECTRON_IS_DEV ? 'http://localhost:3000/' : url.format({
    pathname: path.join(__dirname, '../index.html/'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadURL(startUrl);
  mainWindow.on('close', function (e) {
    e.preventDefault();
    mainWindow.hide();
  });
}



app.on('ready', () => {
  readFiles((content) => {
    configFiles = content;
    appConfig = readConfig()
    if(appConfig === ''){
      appConfig = {
        currentConfig:configFiles[0].fileName,
        active:false,
        password:'',
        runOnStart:false
      };
      updateConfig(appConfig);
    }
    fillMenu();
    createTrayMenu();
  });
  createMainWindow();

});

app.on('window-all-closed', function (e) {
  e.preventDefault();
});


ipcMain.on(channels.LOAD_INITIAL_STATE, (event)=>{
  event.sender.send(channels.LOAD_INITIAL_STATE, {
    password:appConfig.password,
    active:appConfig.active,
    currentConfig: appConfig.currentConfig
  })
})

ipcMain.on(channels.LOAD_SIDE_PANE_STATE, (event)=>{
  event.sender.send(channels.LOAD_SIDE_PANE_STATE, {
    runOnStart:appConfig.runOnStart,
    password:appConfig.password
  })
})

ipcMain.on(channels.ACTIVE_REDSOCKS, (event, arg) => {
  activeRedsocks(arg, (error) => { console.log('start ' + error) });
});

ipcMain.on(channels.UPDATE_APP_CONFIG, (event, arg) => {
  appConfig[arg[0]] = arg[1]
  updateConfig(appConfig)
});

ipcMain.on(channels.CHANGE_REDSOCKS_CONFIG, (event, arg) => {
  changeRedsocksConfig(arg[0], arg[1], arg[2], (error) => { console.log('changing ' + error) });
  appConfig.currentConfig = arg[0]
  updateConfig(appConfig);
  itemsMenu = [...originalMenu]
  fillMenu();
  contextMenu = Menu.buildFromTemplate(itemsMenu);
  tray.setContextMenu(contextMenu);
});

ipcMain.on(channels.SAVE_CONFIG, (event, arg) => {
  saveFile(arg[0], arg[1]);
});

ipcMain.on(channels.STOP_REDSOCKS, (event, arg) => {
  stopRedsocks(arg, (error) => { console.log('stop ' + error) })
});

ipcMain.on(channels.READ_FILES, (event) => {
  event.sender.send(channels.READ_FILES, {
    files: configFiles
  });
});

ipcMain.on(channels.RUN_ON_START, (event, arg) => {
  runOnStart(arg[0], arg[1], (error) => { console.log('run on start   ' + error) })
})