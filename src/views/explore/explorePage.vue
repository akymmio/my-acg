<template>
  <div>
    <button @click="selectChannel(0)" :class="{ active: channelId == 0 }">推荐</button>
    <button @click="selectChannel(1)">推荐</button>
    <!-- 首页瀑布流 -->
    <my-waterfall :cardList="cardList"></my-waterfall>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import myWaterfall from '@/views/waterFall/myWaterfall.vue'
import { requireImg } from '@/utils/requireImg'
import { getArticleService } from '@/api/article'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useUserStore } from '@/stores'
const userStore = useUserStore()
userStore.getUser()
//瀑布流数据
const cardList = ref([
  {
    src: requireImg('@/assets/icon/1.jpg'),
    avatar: requireImg('@/assets/icon/1.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/2.jpg'),
    avatar: requireImg('@/assets/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/3.jpg'),
    avatar: requireImg('@/assets/icon/3.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/4.jpg'),
    avatar: requireImg('@/assets/icon/4.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/5.jpg'),
    avatar: requireImg('@/assets/icon/5.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/6.jpg'),
    avatar: requireImg('@/assets/icon/6.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/2.jpg'),
    avatar: requireImg('@/assets/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/1.jpg'),
    avatar: requireImg('@/assets/icon/1.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/4.jpg'),
    avatar: requireImg('@/assets/icon/4.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/1.jpg'),
    avatar: requireImg('@/assets/icon/1.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/6.jpg'),
    avatar: requireImg('@/assets/icon/6.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/5.jpg'),
    avatar: requireImg('@/assets/icon/5.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/2.jpg'),
    avatar: requireImg('@/assets/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/3.jpg'),
    avatar: requireImg('@/assets/icon/3.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/4.jpg'),
    avatar: requireImg('@/assets/icon/4.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/1.jpg'),
    avatar: requireImg('@/assets/icon/1.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  }

  // ... 其他卡片数据
])
const selectChannel = async (channelId) => {
  router.push({ path: '/explore', query: { channel_id: channelId } })
  const queryWord = route.query.channel_id
  console.log(queryWord)
  await getArticleService(channelId)
}
</script>

<style scoped lang="less">
button {
  border-radius: 40px;
  font-size: large;
  background-color: white;
  border: 0;
  width: 80px;
  height: 40px;
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
