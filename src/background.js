'use strict'

import {app, desktopCapturer, ipcMain, screen} from 'electron'
import Launch from "@/wins/launch";
import {
    BASE_WIN_WIDTH,
    BASE_WIN_HEIGHT,
    DESINGE_LAUNCH_WIDTH,
    DESINGE_LAUNCH_HEIGHT,
    DESINGE_DASHBOARD_WIDTH, DESINGE_DASHBOARD_HEIGHT
} from '@/utils/constant'
import Dashboard from "@/wins/dashboard";
import {httpServce} from "@/utils/servce";





const getSize = ()=>{
    const {size,scaleFactor} = screen.getPrimaryDisplay()
    return {
        width : size.width * scaleFactor,
        height : size.height * scaleFactor,
    }
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {

    const rect = screen.getPrimaryDisplay().bounds

    const launahW = (rect.width / BASE_WIN_WIDTH) * DESINGE_LAUNCH_WIDTH
    const launchH = (rect.height / BASE_WIN_HEIGHT) * DESINGE_LAUNCH_HEIGHT

    const LaunchPage = new Launch({
        width: launahW,
        height: launchH,
    })

    LaunchPage.on('show',()=>{
        console.log('page start');
        httpServce()
        const dashboardW = (rect.width / BASE_WIN_WIDTH) * DESINGE_DASHBOARD_WIDTH
        const dashboardH = (rect.height / BASE_WIN_HEIGHT) * DESINGE_DASHBOARD_HEIGHT

        const DashboardPage = new Dashboard({
            width:dashboardW,
            height:dashboardH,
        })

        DashboardPage.on('show',()=>{
            LaunchPage.close()
        })
    })
})


ipcMain.on('recive-desktop',async (event)=>{
    const sizeInfo = getSize()
    const source = await desktopCapturer.getSources({ types: ['window', 'screen'] ,thumbnailSize:sizeInfo})
    event.reply('reply-source',source[0])
})
