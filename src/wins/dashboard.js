import {app, BrowserWindow, ipcMain,desktopCapturer} from 'electron'
import {createProtocol} from "vue-cli-plugin-electron-builder/lib";

const events = require('events')

const winConfig = {
    show: false,
    frame: false,
    focusable: true,
    resizable: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    }
}

class Dashboard extends events {
    constructor(confInfo) {
        super();
        this.confInfo = confInfo
        this.conf = Object.assign({}, winConfig, confInfo)
        this.windowInstance = new BrowserWindow(this.conf)

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            this.windowInstance.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}#/dashboard`)
        } else {
            createProtocol('app')
            // Load the index.html when not in development
            this.windowInstance.loadURL('app://./index.html/#/dashboard')
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

        this.listenIpc()
    }

    listenIpc() {
        ipcMain.on('move-main',(event,pos)=>{
            this.windowInstance&&this.windowInstance.setPosition(pos.x,pos.y)
        })


        ipcMain.on('mainwin-minimize', () => {
            this.windowInstance.minimize()
        })

        ipcMain.on('mainwin-maximize', () => {
            this.windowInstance.maximize()
        })

        ipcMain.on('mainwin-restore',()=>{
            this.windowInstance.restore()
        })

        ipcMain.on('mainwin-close',()=>{
            app.quit()
        })
    }
}


export default Dashboard
