const { app, BrowserWindow } = require('electron')

let mainWindow

function createMainWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    title: 'ImageShrink',
    width: 500
  })

  // mainWindow.loadURL(`file://${__dirname}/app/index.html`) // carrega o index.html mas precisa da informação do protocolo 'file://'
  mainWindow.loadFile('./app/index.html') // carrega o index.html diretamente
}

app.on('ready', createMainWindow)
