<template>
  <my-waterfall :cardList="cardList"></my-waterfall>
</template>
<script setup>
import { ref } from 'vue'
import myWaterfall from '@/components/myWaterfall.vue'
import { require } from '@/utils/require'
const cardList = ref([
  {
    src: require('@/components/icon/1.png'),
    avatar: require('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: require('@/components/icon/2.jpg'),
    avatar: require('@/components/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: require('@/components/icon/3.jpg'),
    avatar: require('@/components/icon/3.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: require('@/components/icon/2.jpg'),
    avatar: require('@/components/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: require('@/components/icon/1.png'),
    avatar: require('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: require('@/components/icon/1.png'),
    avatar: require('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: require('@/components/icon/2.jpg'),
    avatar: require('@/components/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: require('@/components/icon/1.png'),
    avatar: require('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: require('@/components/icon/1.png'),
    avatar: require('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: require('@/components/icon/1.png'),
    avatar: require('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: require('@/components/icon/2.jpg'),
    avatar: require('@/components/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  }

  // ... 其他卡片数据
])
</script>

<style scoped>
.el-aside {
  background: rgb(109, 245, 255);
}

.el-main {
  background: rgb(255, 188, 255);
}

.common-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
