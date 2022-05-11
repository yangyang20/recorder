<template>
  <!--  <div class="headle" v-mouse-drag="handleDrag"></div>-->

  <div class="headle" v-mouse-drag="handleDrag">

    <div class="menu-wrap">
      <div>
        <n-space justify="space-around" size="large" item-style="align-items:center">
          <n-icon size="40">
            <emergency-recording-round></emergency-recording-round>
          </n-icon>
          <div style="line-height: 3">
            录屏客户端
          </div>
        </n-space>
      </div>

      <div>
        <n-grid x-gap="12" :cols="3">
          <n-gi>
            <n-icon size="40" @click="mainwinMinimize">
              一
            </n-icon>
          </n-gi>
          <n-gi>
            <n-icon size="40" @click="changeMainWin">
              <arrows-maximize v-if="isMax"></arrows-maximize>
              <check-box-outline-blank-outlined v-else></check-box-outline-blank-outlined>
            </n-icon>
          </n-gi>
          <n-gi>
            <n-icon size="40" @click="quitWin">
              <close-sharp></close-sharp>
            </n-icon>
          </n-gi>
        </n-grid>
      </div>
    </div>
  </div>


</template>

<script>
import {ArrowsMaximize} from "@vicons/tabler";
import {CloseSharp} from "@vicons/ionicons5";
import {CheckBoxOutlineBlankOutlined,EmergencyRecordingRound} from "@vicons/material";
import {ref} from "vue";
const {ipcRenderer} = window.require('electron')

export default {
  name: "NavBar",
  components: {
    ArrowsMaximize,
    CloseSharp,
    CheckBoxOutlineBlankOutlined,
    EmergencyRecordingRound
  },


  setup() {
    let isMax = ref(false)
    const handleDrag = (pos) => {
      ipcRenderer.send('move-main', {
        x: pos.x,
        y: pos.y,
      })
    }
    const mainwinMinimize = ()=>{
      ipcRenderer.send('mainwin-minimize')
    }
    const changeMainWin = ()=>{
      if (isMax.value){
        ipcRenderer.send('mainwin-restore')
      }else {
        ipcRenderer.send('mainwin-maximize')
      }
      isMax.value = !isMax.value
    }
    const quitWin = () => {
      ipcRenderer.send('mainwin-close')
    }

    return {
      isMax,
      handleDrag,
      mainwinMinimize,
      changeMainWin,
      quitWin
    }
  }
}
</script>

<style scoped>
.headle {
  /*height: 300px;*/
  width: 100%;
  background-color: #00000026;
}
.menu-wrap{
  display: flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
}
</style>
