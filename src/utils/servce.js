const http = require('http')
import {VIDEO_PATH} from "@/utils/constant";
const path = require('path')
const fs = require('fs')




export const httpServce = () => {
    const servce = http.createServer((req, res) => {
        const filename = req.url
        const filepath = path.join(VIDEO_PATH, filename)
        fs.readFile(filepath,(err,data)=>{
            if (err){
                console.log(err);
                res.writeHead(404, {'Content-type': 'text/plain;charset=utf-8'})
                res.write('404')
                res.end('error')
            }else {
                res.writeHead(200, {
                    "Content-Length": Buffer.byteLength(data),
                    "Content-Type": "video/mp4"})
                res.write(data)
                res.end('ok')
            }

        })

    })
    servce.listen(9090, () => {
        console.log('servce start')
    })
}
