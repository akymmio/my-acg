<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { getArticleService } from '@/api/article'
const router = useRouter()
const route = useRoute()
//获取文章数据
const cardList = ref({})
const fetchData = async (channelId) => {
  // let pageParam = {
  //   pageNum: 1,
  //   pageSize: 10,
  //   channelId: 0
  // }
  const res = await getArticleService({
    pageNum: 1,
    pageSize: 20,
    channelId: channelId
  })
  cardList.value = res.data.data.items
  console.log(res.data.data.items)
  console.log(cardList.value)
}
fetchData()
// const cardList = ref([
//   {
//     src: requireImg('@/assets/icon/1.jpg'),
//     avatar: requireImg('@/assets/icon/1.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/2.jpg'),
//     avatar: requireImg('@/assets/icon/2.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/3.jpg'),
//     avatar: requireImg('@/assets/icon/3.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/4.jpg'),
//     avatar: requireImg('@/assets/icon/4.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/5.jpg'),
//     avatar: requireImg('@/assets/icon/5.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/6.jpg'),
//     avatar: requireImg('@/assets/icon/6.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/2.jpg'),
//     avatar: requireImg('@/assets/icon/2.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/1.jpg'),
//     avatar: requireImg('@/assets/icon/1.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/4.jpg'),
//     avatar: requireImg('@/assets/icon/4.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/1.jpg'),
//     avatar: requireImg('@/assets/icon/1.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/6.jpg'),
//     avatar: requireImg('@/assets/icon/6.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/5.jpg'),
//     avatar: requireImg('@/assets/icon/5.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/2.jpg'),
//     avatar: requireImg('@/assets/icon/2.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/3.jpg'),
//     avatar: requireImg('@/assets/icon/3.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/4.jpg'),
//     avatar: requireImg('@/assets/icon/4.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   },
//   {
//     src: requireImg('@/assets/icon/1.jpg'),
//     avatar: requireImg('@/assets/icon/1.jpg'),
//     user: 'Lewis',
//     vote_num: 999,
//     title: 'Noice cancelling is a secret weapon'
//   }

//   // ... 其他卡片数据
// ])
const selectChannel = async (channelId) => {
  router.push({ path: '/explore', query: { channel_id: channelId } })
  fetchData(channelId)
  const queryWord = route.query.channel_id
  console.log(queryWord)
}

const show = ref(false)
// const user = ref({})
//查看文章详情
const showContent = (param) => {
  router.push(`/explore/${param}`)
}

const push = (param) => {
  router.push(`/user/profile/${param}`)
}
</script>
<template>
  <div class="main">
    <button @click="selectChannel(0)">推荐</button>
    <button @click="selectChannel(1)">推荐</button>
    <!-- 首页瀑布流 -->
    <!-- <my-waterfall :cardList="cardList" style="overflow-y: hidden"></my-waterfall> -->

    <div class="waterfall">
      <Waterfall
        :list="cardList"
        :hasAroundGutter="false"
        style="max-width: 1300px"
        :width="240"
        :gutter="20"
        class="waterfall"
      >
        <template #item="{ item }">
          <div>
            <el-image
              :src="item.images"
              :fit="cover"
              class="lazyImg"
              @click="showContent(item.id)"
            />
            <!-- <LazyImg :url="item.images" class="lazyImg" @click="showContent(id)" /> -->
            <div class="item-body">
              <div class="item-desc" @click="showContent(item.id)">
                <span>{{ item.title }}</span>
              </div>
              <div class="item-footer">
                <div class="footer-left">
                  <img :src="item.avatar" alt="" srcset="" @click="push(item.userId)" />
                  <div class="name">{{ item.nickname }}</div>
                </div>
                <div class="like">
                  <i class="bi bi-heart" @click="like"></i>
                  <div style="padding-left: 5px">{{ item.likedCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Waterfall>
    </div>
  </div>
  <!-- <contentPage v-if="show" @toParent="toChild"></contentPage> -->
</template>
<style scoped lang="less">
.main {
  overflow: auto;
  height: 100vh; /* 使用视口单位vh设置高度为视口高度的100% */
  // position: relative;
}

.main::-webkit-scrollbar {
  display: none;
}

.main button {
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
    padding-top: 10px;

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
      // font-style: normal;
      // font-weight: bold;
      font-size: 12px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.7);

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
