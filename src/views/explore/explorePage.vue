<template>
  <div>
    <button>推荐</button>
    <button>推荐</button>
    <button>推荐</button>
    <button>推荐</button>
    <button>推荐</button>
    <button>推荐</button>
    <my-waterfall :cardList="cardList"></my-waterfall>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import myWaterfall from '@/views/waterFall/myWaterfall.vue'
import { requireImg } from '@/utils/requireImg'
const cardList = ref([
  {
    src: requireImg('@/components/icon/1.png'),
    avatar: requireImg('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/components/icon/2.jpg'),
    avatar: requireImg('@/components/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/components/icon/3.jpg'),
    avatar: requireImg('@/components/icon/3.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/components/icon/2.jpg'),
    avatar: requireImg('@/components/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/components/icon/1.png'),
    avatar: requireImg('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/components/icon/1.png'),
    avatar: requireImg('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/components/icon/2.jpg'),
    avatar: requireImg('@/components/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/components/icon/1.png'),
    avatar: requireImg('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/components/icon/1.png'),
    avatar: requireImg('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/components/icon/1.png'),
    avatar: requireImg('@/components/icon/1.png'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/components/icon/2.jpg'),
    avatar: requireImg('@/components/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  }

  // ... 其他卡片数据
])
</script>

<style scoped lang="less">
button {
  border-radius: 40px;
  font-size: large;
  background-color: white;
  border: 0;
  width: 80px; /* 指定宽度，单位可以是像素、百分比等 */
  height: 40px; /* 指定高度，单位可以是像素、百分比等 */
  margin-bottom: 15px;
}
button:hover {
  background-color: #f6f6f6;
}
button:focus {
  background-color: #f6f6f6;
  font-weight: bold;
}
</style>
