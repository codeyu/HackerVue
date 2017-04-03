// System paths
const path = require('path')
const fs = require('fs')

// Electron
const electron = require('electron')

const menu = electron.Menu

// App Info
const app = electron.app
const appTitle = app.getName()
const appIsDev = require('electron-is-dev')
const appConfig = require('./lib/config.js')

// Right Click/Context menu
require('electron-context-menu')()

// Main App Window
let mainWindow

// If the application is quitting
let isQuitting = false

// Main Window
function createMainWindow() {
    const lastWindowState = appConfig.get('lastWindowState')

    const appView = new electron.BrowserWindow({
        title: appTitle,
        width: lastWindowState.width,
        height: lastWindowState.height,

        minWidth: 299, // Window minimum width
        minHeight: 328, // Window minimum height
        backgroundColor: '#ff6600', // Background Color
        titleBarStyle: 'hidden', // Titlebar style (MacOS Only)
        center: true, // Center app window?
        movable: true, // Is window movable?
        resizable: true, // Is window resizable?
        autoHideMenuBar: true // Hide menubar in window on launch
    })
    appView.loadURL('https://vue-hn.now.sh')

    // When window is closed, hide window
    appView.on('close', e => {
        if (!isQuitting) {
            e.preventDefault()
            if (process.platform === 'darwin') {
                app.hide()
            } else {
                app.quit()
            }
        }
    })
    return appView
}

app.on('ready', () => {
    mainWindow = createMainWindow()

    // Setting App menu
    menu.setApplicationMenu(require('./lib/menu.js'))

    // If running in developer environment = Open developer tools
    if (appIsDev) {
        mainWindow.openDevTools()
    }

    const appPage = mainWindow.webContents

    appPage.on('dom-ready', () => {
        // MacOS navbar border
        if (process.platform === 'darwin') {
            appPage.insertCSS(fs.readFileSync(path.join(__dirname, 'app.css'), 'utf8'))
        }

        // Show the Main Window
        mainWindow.show()

        // Open external links in browser
        appPage.on('new-window', (e, url) => {
            e.preventDefault()
            electron.shell.openExternal(url)
        })

        // Navigate the window back when the user hits their mouse back button
        mainWindow.on('app-command', (e, cmd) => {
            if (cmd === 'browser-backward' && mainWindow.webContents.canGoBack()) {
                mainWindow.webContents.goBack()
            }
        })
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    mainWindow.show()
})

app.on('before-quit', () => {
    isQuitting = true

    // Saves the current window position and window size to the config file.
    if (!mainWindow.isFullScreen()) {
        appConfig.set('lastWindowState', mainWindow.getBounds())
    }
})
