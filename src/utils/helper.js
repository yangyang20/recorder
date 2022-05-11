import {VIDEO_PATH} from "@/utils/constant";

const fs = window.require('fs')
const path = window.require('path')



const mkdirDirectory = (pathUrl) => {
    return new Promise((resolve) => {
        if (!fs.existsSync(pathUrl)) {
            const res = fs.mkdirSync(pathUrl, {recursive: true})
            if (res) {
                resolve(true)
            }
        } else {
            resolve(true)
        }
    })
}


export const saveVideo = (blob) => {
    return new Promise((resolve,reject) => {
        const times = new Date().getTime()
        mkdirDirectory(VIDEO_PATH).then(() => {
            const videoPath = path.join(VIDEO_PATH, `${times}.mp4`)
            const reader = new FileReader()
            reader.readAsArrayBuffer(blob)
            reader.onload = () => {
                const buffer = Buffer.from(reader.result)
                fs.writeFile(videoPath, buffer,  {},(err) => {
                    if (err){
                        console.log(err);
                        return
                    }

                })

                reader.onerror = (err) => {
                    console.log(err);
                    reject(err)
                }
                reader.onloadend = () => {
                    resolve(true)
                }
            }
        })
    })
}


export const getMediaFile = () => {
    if (!fs.existsSync(VIDEO_PATH)) {
        return []
    }
    let files = fs.readdirSync(VIDEO_PATH)
    files = files.filter(item => {
        const filepath = path.join(VIDEO_PATH, item)
        return fs.statSync(filepath).isFile()
    })
    return files
}


