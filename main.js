const path = require('path')
const os = require('os')
const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');

// Set env
process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`, // utilizar caminho absoluto para o ícone
    resizable: isDev,
    title: 'ImageShrink',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
    width: isDev ? 1080 : 500,
  });

  if(isDev) mainWindow.webContents.openDevTools()

  // mainWindow.loadURL(`file://${__dirname}/app/index.html`) // carrega o index.html mas precisa da informação do protocolo 'file://'
  mainWindow.loadFile(`${__dirname}/app/index.html`); // carrega o index.html diretamente
}

// Manipulador para abrir o dialog e retornar o caminho do arquivo
ipcMain.handle('open-file-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg', 'gif'] }]
  });

  if (canceled) return null; // Retorna null se o usuário cancelar
  
  const filePath = filePaths[0]; // Caminho completo do arquivo selecionado
  const fileName = path.basename(filePath); // Nome do arquivo (com extensão)

  return { filePath, fileName }
});

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    backgroundColor: 'white',
    height: 300,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`, // utilizar caminho absoluto para o ícone
    resizable: false,
    title: 'About ImageShrink',
    width: 300,
  });

  aboutWindow.loadFile(`${__dirname}/app/about.html`);
}

app.on('ready', () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.on('closed', () => (mainWindow = null));
});

const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              click: createAboutWindow,
              label: 'About',
            },
          ],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },
  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [
            {
              click: createAboutWindow,
              label: 'About',
            },
          ],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
];

ipcMain.on('image:minimize', (e, options) => {
  options.dest = path.join(os.homedir(), 'imageshrink')
  shrinkImage(options);
})

// Uso do import dinâmico para o imagemin e slash
async function shrinkImage({ imgPath, quality, dest }) {
  const imagemin = ((await import('imagemin')).default)
  const imageminMozjpeg = (await import('imagemin-mozjpeg')).default
  const imageminPngquant = (await import('imagemin-pngquant')).default
  const slash = (await import('slash')).default
  
  try {
    const pngQuality = quality / 100

    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({ quality: [pngQuality, pngQuality]})
      ]
    })

    console.log(files)
    
    shell.openPath(dest)

    mainWindow.webContents.send('image:done')
  } catch (error) {
    console.log(error);
  }
}

app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});
