const { app, BrowserWindow } = require('electron')

let mainWindow

function createMainWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`, // utilizar caminho absoluto para o ícone
    title: 'ImageShrink',
    width: 500
  })

  // mainWindow.loadURL(`file://${__dirname}/app/index.html`) // carrega o index.html mas precisa da informação do protocolo 'file://'
  mainWindow.loadFile(`${__dirname}/app/index.html`) // carrega o index.html diretamente
}

app.on('ready', createMainWindow)
