import {BrowserWindow} from "electron";
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'

const events = require('events')


const winConfig = {
    show: false,
    frame: false,
    focusable: true,
    resizable: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
}

class Launch extends events {
    constructor(confInfo) {
        super();
        this.confInfo = confInfo
        this.conf = Object.assign({}, winConfig, confInfo)
        this.windowInstance = new BrowserWindow(this.conf)


        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/launchPage`)
        } else {
            createProtocol('app')
            // Load the index.html when not in development
            this.windowInstance.loadURL('app://./index.html/#/launchPage')
        }
        this.init()
    }

    init() {
        this.windowInstance.once('ready-to-show', () => {
            this.windowInstance.show()
        })

        this.windowInstance.on('show', () => {
            this.emit('show')
        })
    }

    close() {
        if (this.windowInstance && this.windowInstance.isVisible()) {
            this.windowInstance.close()
            this.windowInstance = null
        }
    }
}


export default Launch
