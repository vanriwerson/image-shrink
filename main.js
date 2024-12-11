const { app, BrowserWindow } = require('electron')

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    height: 600,
    title: 'ImageShrink',
    width: 500
  })
}

app.on('ready', createMainWindow)
