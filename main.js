const { app, BrowserWindow, Menu, globalShortcut } = require('electron');

// Set enviroment
process.env.NODE_ENV = 'developement';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;

// darwin -> macOS, win32 -> Windows, linux -> Linux
// console.log(process.platform)
const isMac = process.platform === 'darwin' ? true : false;

let mainWindow;

function createMainWindow () {
    mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        backgroundColor: 'white',
        width: isDev ? 800 : 500,
        height: 600,
        webPreferences: { worldSafeExecuteJavaScript: true },
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        // resizable in dev to allow for devTools.
        resizable: isDev ? true : false
    });

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(`./app/index.html`);
};

function createAboutWindow () {
    aboutWindow = new BrowserWindow({
        title: 'About ImageShrink',
        backgroundColor: 'white',
        width: 300,
        height: 300,
        webPreferences: { worldSafeExecuteJavaScript: true },
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        // resizable in dev to allow for devTools.
        resizable: false,
    });

    aboutWindow.loadFile(`./app/about.html`);
};
app.on('ready', () => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => mainWindow = null );
});

const menu = [

    ...(isMac ? [ { 
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow,
            }
        ]
    } ] : []), 
    {
        role: 'fileMenu',
    },
    ...(isDev ? 
        [
            {
                label: 'Developer',
                submenu: [
                    { role: 'reload' },
                    { role: 'forceReload' },
                    { type: 'separator' },
                    { role: 'toggleDevTools' },
                ]
            },
        ] : []),
        ...(!isMac ? [ { 
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: createAboutWindow,
                }
            ]
        } ] : []), 
]

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (!isMac) {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })