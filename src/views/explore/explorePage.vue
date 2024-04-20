<template>
  <div class="main">
    <button @click="selectChannel(0)" :class="{ active: channelId == 0 }">推荐</button>
    <button @click="selectChannel(1)">推荐</button>
    <!-- 首页瀑布流 -->
    <!-- <my-waterfall :cardList="cardList" style="overflow-y: hidden"></my-waterfall> -->
    <Waterfall
      :list="cardList"
      :hasAroundGutter="false"
      style="max-width: 1300px"
      @click="detail"
      @scroll="scroll"
      :align="left"
      :width="240"
      :gutter="20"
    >
      <template #item="{ item }">
        <div>
          <LazyImg :url="item.src" class="lazyImg" @click="dialogTableVisible = true" />
          <div class="item-body">
            <div class="item-desc">{{ item.title }}</div>
            <div class="item-footer">
              <div class="footer-left">
                <img :src="item.avatar" alt="" srcset="" />
                <div class="name">{{ item.user }}</div>
              </div>
              <div class="like">
                <div class="like-total">{{ item.vote_num }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Waterfall>
  </div>
</template>
<script setup>
import { ref } from 'vue'
// import myWaterfall from '@/views/waterFall/myWaterfall.vue'
import { requireImg } from '@/utils/requireImg'
import { getArticleService } from '@/api/article'
import { useRouter, useRoute } from 'vue-router'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
const router = useRouter()
const route = useRoute()
import { useUserStore } from '@/stores'
const userStore = useUserStore()
//user信息要更新确保其为响应式对象
const getUserService = () => {
  if (userStore.token && !!userStore.user) {
    //如果有登录就且没有获取用户信息
    userStore.getUser()
  }
}
getUserService()

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
.lazyImg {
  border-radius: 20px;
}
.item-body {
  margin: 10px;

  .item-desc {
    text-align: left;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #000000;
  }

  .item-footer {
    display: flex;
    justify-content: space-between;

    .footer-left {
      display: flex;
      align-items: center;
      font-family: SF Pro Display;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.6);

      img {
        border-radius: 50%;
        width: 22px;
        height: 22px;
        margin-right: 4px;
      }
    }

    .like {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: SF Pro Display;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.4);

      img {
        margin-right: 4px;
      }
    }
  }
}
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
