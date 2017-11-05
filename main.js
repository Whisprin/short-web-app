#!/usr/bin/env electron

const electron = require('electron')
const {
  app,
  BrowserWindow,
  globalShortcut,
  Menu,
  MenuItem,
  ipcMain
} = require('electron')
const argv = require('minimist')(process.argv.slice(2));

const path = require('path')
const url = require('url')
const types = {
  airsonic: {
    name: 'Airsonic',
    bindings: {
      MediaPlayPause: 'Space',
      MediaStop: 'Space',
      MediaPreviousTrack: 'Left',
      MediaNextTrack: 'Right'
    }
  },
  qobuz: {
    name: 'Qobuz',
    url: 'http://play.qobuz.com/',
    bindings: {
      MediaPlayPause: 'Space',
      MediaStop: 'Space',
      MediaPreviousTrack: 'control Left',
      MediaNextTrack: 'control Right'
    }
  }
}

let mainWindow

function createWindow () {
  // TOOD: Restore previous window size
  mainWindow = new BrowserWindow({width: 1920, height: 1080})

  //mainWindow.webContents.openDevTools()

  siteType = argv.type
  siteUrl = argv.url

  // remove the menu altogether
  Menu.setApplicationMenu(null)

  // if the user didn't specifiy a type or a type which doesn't have a url
  if (!siteType || (!('url' in types[siteType]) && !siteUrl)) {
    showPreferences()
  } else {
    if (!siteUrl) {
      siteUrl = types[siteType].url
    }
    loadWebsite(siteUrl, siteType)
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}


function showPreferences () {
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'preferences.html'),
    protocol: 'file:',
    slashes: true
  }))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('set-website', function (event, arg) {
  loadWebsite(arg.url, arg.type)
});

function loadWebsite (url, type) {
  // TODO: Retrieve fav icon from website, cache it locally and set as window icon
  //mainWindow.setIcon(icon)
  mainWindow.loadURL(url)
  registerShortcuts(type)
}

function registerShortcuts (type) {
  console.log('Registering shortcuts for: ' + type)

  var bindings = types[type].bindings
  for (var binding in bindings) {
    !function outer(b) {
      globalShortcut.register(binding, () => {
        pressWebsiteKeys(b.split(' '))
      })
    }(bindings[binding])
  }
}

function pressWebsiteKeys (keys) {
  keyCode = keys.pop()
  console.log(keyCode, keys)
  mainWindow.webContents.sendInputEvent({type: 'keyDown', keyCode: keyCode, modifieres: keys})
  mainWindow.webContents.sendInputEvent({type: 'keyUp', keyCode: keyCode, modifieres: keys})
}
