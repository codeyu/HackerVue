const Config = require('electron-config')

module.exports = new Config({
    defaults: {
        darkTheme: false,
        lastWindowState: {
            width: 965, // Default window width
            height: 834 // Default window height
        }
    }
})
