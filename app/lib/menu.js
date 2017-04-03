// Electron
const electron = require('electron')

const app = electron.app
const appName = app.getName()
const appVersion = app.getVersion()
const appMenu = electron.Menu
const appConfig = require('./config')

// File menu for Windows platform
const win32Template = [{
    label: 'File',
    submenu: [{
        label: 'Hide ' + appName,
        accelerator: 'Control+H',
        role: 'hide'
    }, {
        type: 'separator'
    }, {
        label: 'Quit',
        accelerator: 'Control+W',
        role: 'close'
    }]
}]

// Application menu for Windows platform
const macOSTemplate = {
    label: 'Application',
    submenu: [{
        label: 'Hide ' + appName,
        accelerator: 'Command+H',
        role: 'hide'
    }, {
        type: 'separator'
    }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
            app.quit()
        }
    }]
}

// Sets first menu item depending on operating system
function menuSet() {
    if (process.platform === 'darwin') {
        return macOSTemplate
    }
    return win32Template
}

// Base menu template
const menuTemplate = [
    menuSet(),
    {
        label: 'Edit',
        submenu: [{
            label: 'Undo',
            accelerator: 'CommandOrControl+Z',
            role: 'undo'
        }, {
            label: 'Redo',
            accelerator: 'Shift+CommandOrControl+Z',
            role: 'redo'
        }, {
            type: 'separator'
        }, {
            label: 'Cut',
            accelerator: 'CommandOrControl+X',
            role: 'cut'
        }, {
            label: 'Copy',
            accelerator: 'CommandOrControl+C',
            role: 'copy'
        }, {
            label: 'Paste',
            accelerator: 'CommandOrControl+V',
            role: 'paste'
        }, {
            label: 'Select All',
            accelerator: 'CommandOrControl+A',
            role: 'selectall'
        }]
    }, {
        label: 'View',
        submenu: [{
            label: 'Forward',
            accelerator: 'CommandOrControl+Right',
            click(item, focusedWindow) {
                if (focusedWindow && focusedWindow.webContents.canGoForward()) {
                    focusedWindow.webContents.goForward()
                }
            }
        }, {
            label: 'Back',
            accelerator: 'CommandOrControl+Left',
            click(item, focusedWindow) {
                if (focusedWindow && focusedWindow.webContents.canGoBack()) {
                    focusedWindow.webContents.goBack()
                }
            }
        }, {
            label: 'Reload',
            accelerator: 'CommandOrControl+R',
            role: 'reload'
        }, {
            type: 'separator'
        }, {
            label: 'Toggle Theme',
            accelerator: 'CommandOrControl+D',
            click() {
                appConfig.set('darkTheme', !appConfig.get('darkTheme'))
            }
        }, {
            type: 'separator'
        }, {
            label: 'Toggle Fullscreen',
            accelerator: 'Shift+CommandOrControl+F',
            role: 'togglefullscreen'
        }, {
            label: 'Toggle Dev Tools',
            accelerator: 'Shift+CommandOrControl+I',
            role: 'toggledevtools'
        }]
    }, {
        label: 'Window',
        role: 'window',
        submenu: [{
            label: 'Minimize',
            accelerator: 'CommandOrControl+M',
            role: 'minimize'
        }, {
            label: 'Close',
            accelerator: 'CommandOrControl+W',
            role: 'close'
        }]
    }, {
        label: 'Help',
        role: 'help',
        submenu: [{
            label: 'About ' + appName,
            click() {
                electron.shell.openExternal('https://github.com/Meadowcottage/HackerVue/releases/tag/' + appVersion)
            }
        }, {
            label: 'Version ' + appVersion,
            enabled: false
        }, {
            type: 'separator'
        }, {
            label: 'View ' + appName,
            click() {
                electron.shell.openExternal('https://vue-hn.now.sh')
            }
        }, {
            type: 'separator'
        }, {
            label: 'Changelog',
            click() {
                electron.shell.openExternal('https://github.com/Meadowcottage/HackerVue/releases/tag/' + appVersion)
            }
        }]
    }]

// Exports menu
module.exports = appMenu.buildFromTemplate(menuTemplate)
