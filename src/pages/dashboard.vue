<template>
  <nav-bar></nav-bar>
  <div style="height: 90%">
    <n-grid :x-gap="10" :cols="2" style="height: 100%">
      <n-grid-item>
        <n-grid :y-gap="16" :x-gap="12" :cols="1" style="height: 100%">
          <n-grid-item >
            <div class="recorder-wrap">
              <div  class="recorder-wrap-button">
                <n-button  @click="sourceStart" :circle="true"
                           size="large"
                           :style="{'background-color': isRecorder?'green':'red'}"
                           style="width: 150px;height: 150px;margin-bottom: 10px">{{ isRecorder ? 'stop' : '录制' }}
                </n-button>
                <div style="text-align: center">{{timeformat}}</div>
              </div>

            </div>


          </n-grid-item>
          <n-grid-item>
            <n-data-table
                :columns="columns"
                :data="data"
                :bordered="false"
                @on-update:filters="updateData"
                :row-key="rowKey"
            />
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item>
        <div class="media-wrap">
          <div class="media" ref="mediaRef">
            <video :src="videoUrl" controls autoplay style="width:100%; height:100%; object-fit: fill"
                    v-show="isPlay"></video>
            <n-image :src="previewImg"  style="width: 100%;height: 100%;" v-if="!isPlay"></n-image>
          </div>
        </div>

      </n-grid-item>
    </n-grid>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import {h, ref, watch,computed} from "vue";
import {getMediaFile, saveVideo} from "@/utils/helper";
import {NButton} from "naive-ui";
const {ipcRenderer} = window.require('electron')


let isPlay = ref(false)
const FileTable = () => {
  let files = ref([])
  const videoUrl = ref('')
  const columns = ref([
    {title: '文件名', align: 'center', key: 'filename'},
    {
      title: '播放', align: 'center', key: 'play', render(row) {
        return h(
            NButton,
            {
              strong: true,
              tertiary: true,
              size: 'small',
              onClick: () => playVideo(row)
            },
            {default: () => '播放'}
        )
      }
    },
    {title: '文件位置', align: 'center', key: 'filepath'}
  ])
  const data = ref([]);

  const playVideo = (row) => {
    isPlay.value = true
    videoUrl.value = `http://localhost:9090/${row.filename}`
  }

  const mediaTable = () => {
    files.value = getMediaFile()
    files.value.map(item => {
      const temp = {
        filename: item,
      }
      data.value.push(temp)
    })
    // console.log(data);
  }

  return {columns, data, playVideo, mediaTable, files, videoUrl}
}

let mediaRef = ref(null)

const MediaShow = () => {
  let recorder = ref(null)
  let source

  let previewImg = ref('')

  let isRecorder = ref(false)

  const getPreview = async () => {
    source = await getSourece()
    previewImg.value = source.thumbnail.toDataURL();
  }
  const getSourece = () => {
    return new Promise(resolve => {
      ipcRenderer.send('recive-desktop')
      ipcRenderer.on('reply-source', (event, data) => {
        resolve(data)
      })
    })
  }

  const recorderStart = (stream) => {
    let blobSlice = []
    recorder.value = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    })
    if (recorder.value) {
      recorder.value.start(1000)
      recorder.value.ondataavailable = (event) => {
        blobSlice.push(event.data)
      }

      recorder.value.stop = async () => {
        isRecorder.value = false
        isPlay.value = false
        const blob = new Blob([...blobSlice], {
          type: 'video/webm'
        })
        saveVideo(blob).then(() => {
          const {mediaTable} = FileTable()
          mediaTable()
        })
      }

      recorder.value.onerror = (err) => {
        console.log(err);
      }
    }
  }

  const sourceStart = async () => {
    if (isRecorder.value) {
      recorder.value && recorder.value.stop()
      return
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: source.id,
          minWidth: 1280,
          maxWidth: 1280,
          minHeight: 720,
          maxHeight: 720
        }
      }
    })
    isRecorder.value = true
    isPlay.value = true
    let video = mediaRef.value.querySelector('video')
    video.srcObject = stream;
    video.onloadedmetadata = function () {
      video.play();
    }
    recorderStart(stream)
  }

  return {recorder, source, previewImg, isRecorder, getPreview, getSourece, recorderStart, sourceStart,mediaRef}
}

let timestamp = ref(0)
let timer
const timerStart = ()=>{
  timer = setInterval(()=>{
    console.log(timestamp.value);
    timestamp.value++
  },1000)
}



export default {
  name: "dashBoard",
  components: {NavBar},
  setup() {

    const {previewImg, isRecorder, sourceStart, getPreview,mediaRef} = MediaShow()
    getPreview()

    const {columns, data, playVideo, mediaTable, videoUrl} = FileTable()

    mediaTable()


    const updateData = (data) => {
      console.log(data);
    }
    // 监听 number 变量，如果有发生变化，自动运行后面的回调函数
    watch(isRecorder, (newVal, oldVal) => {
      console.log(newVal);
      if (newVal)
      {
        timerStart()
      }else {
        timestamp.value = 0
        clearTimeout(timer)
      }
    })
    const timeformat =  computed(()=>{
      const h = Math.floor(timestamp.value/3600)<10?'0'+Math.floor(timestamp.value/3600) : Math.floor(timestamp.value/3600)
      const m = Math.floor((timestamp.value/60)%60) <10 ?'0'+Math.floor((timestamp.value/60)%60):Math.floor((timestamp.value/60)%60)
      const s = Math.floor(timestamp.value%60)<10?'0'+Math.floor(timestamp.value%60):Math.floor(timestamp.value%60)
      return `${h}:${m}:${s}`
    })


    return {
      data,
      columns,
      // pagination: {
      //
      // },
      previewImg,
      sourceStart,
      isRecorder,
      playVideo,
      videoUrl,
      mediaRef,
      updateData,
      rowKey(rowData) {
        console.log(rowData);
        return rowData.column1
      },
      isPlay,
      timeformat
    }
  }
}
</script>

<style scoped>
.recorder-wrap{
  width: 100%;
  height: 100%;
  position: relative;
}

.recorder-wrap-button{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.media-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.media {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 560px;
  height: 450px;
  text-align: center;
  overflow: hidden;
}
</style>
