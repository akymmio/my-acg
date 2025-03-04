<template>
  <Waterfall
    :list="list"
    :hasAroundGutter="false"
    :width="276"
    :gutter="20"
    :breakpoints="{
      800: { rowPerView: 3 },
      600: { rowPerView: 2 },
      500: { rowPerView: 1 }
    }"
  >
    <!-- 底部 -->
    <template #default="{ item }">
      <vue3dLoader
        :filePath="item.src"
        :lights="lights"
        :height="350"
        :width="290"
        backgroundColor="#F2F2F2"
      />
    </template>
  </Waterfall>
</template>
<script setup>
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { ref } from 'vue'
// import { vue3dLoader } from 'vue-3d-loader'

const lights = ref()
const list = ref()
list.value = [
  {
    src: 'aphrodite_of_milos_a_plaster_cast.glb',
    title: '测试1'
  },
  {
    src: 'tmpwoiwueq7.obj',
    title: '测试1'
  },

  {
    src: 'ding_censer_with_an_openwork_cover.glb',
    title: '测试1'
  },

  {
    src: 'chinese_kneeling_archer_qin_dynasty_raw_scan.glb',
    title: '测试1'
  }
]
lights.value = [
  {
    type: 'AmbientLight',
    color: 'white',
    intensity: 2
  },
  {
    type: 'PointLight',
    color: 'white',
    intensity: 2
  }
]
</script>
