const electron = require('electron')
const {
  app,
  BrowserWindow,
  globalShortcut,
  Menu,
  MenuItem,
  ipcMain,
  ipcRenderer
} = require('electron')

const path = require('path')
const url = require('url')

let mainWindow

function createWindow () {
  // TOOD: Restore previous window size
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function addPreferencesMenu () {
  menu = Menu.getApplicationMenu()
  menuItem = new MenuItem({label: 'Preferences', click (menuItem, browserWindow, event) { 
    console.log('Preferences clicked')
    showPreferences()
  }})
  menu.append(menuItem)
  Menu.setApplicationMenu(menu)
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
  console.log(arg)
  loadWebsite(arg.url)
  registerShortcuts(arg.type)
});

function loadWebsite (url) {
  // TODO: Retrieve fav icon from website, cache it locally and set as window icon
  //mainWindow.setIcon(icon)
  mainWindow.loadURL(url)
}

function registerShortcuts (type) {
  console.log('Registering shortcuts for: ' + type)

  globalShortcut.register('MediaPlayPause', function() { 
    console.log('Play Pause')
    mainWindow.webContents.send('space')
  })
  globalShortcut.register('MediaStop', function() { console.log('Stop'); })
  globalShortcut.register('MediaPreviousTrack', function() { console.log('Previous Track'); })
  globalShortcut.register('MediaNextTrack', function() { console.log('Next Track'); })
}