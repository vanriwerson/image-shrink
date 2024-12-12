const { app, BrowserWindow, Menu, globalShortcut } = require('electron')

// Set env
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false


let mainWindow

function createMainWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`, // utilizar caminho absoluto para o ícone
    resizable: isDev,
    title: 'ImageShrink',
    width: 500
  })

  // mainWindow.loadURL(`file://${__dirname}/app/index.html`) // carrega o index.html mas precisa da informação do protocolo 'file://'
  mainWindow.loadFile(`${__dirname}/app/index.html`) // carrega o index.html diretamente
}

app.on('ready', () => {
  createMainWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
  globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () => mainWindow.toggleDevTools())

  mainWindow.on('closed', () => mainWindow = null)
})

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  }
]

app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
})
