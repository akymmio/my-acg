<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { getArticleService } from '@/api/article'
const router = useRouter()
const route = useRoute()
//分页参数
const page = ref({
  pageNum: 1,
  pageSize: 15,
  channelId: 0
})
//获取文章数据
const cardList = ref({})
const total = ref(0)
const fetchData = async (channelId) => {
  // if (cardList.value) return
  page.value.channelId = channelId
  const res = await getArticleService(page.value)
  cardList.value = res.data.data.items
  page.value.pageNum++

  console.log(res.data.data.items)
  total.value = res.data.data.total
}
fetchData()
// if (typeof cardList.value === 'object') {
//   fetchData()
// }

const selectChannel = async (channelId) => {
  router.push({ path: '/explore', query: { channel_id: channelId } })
  fetchData(channelId)
  const queryWord = route.query.channel_id
  console.log(queryWord)
}

// const user = ref({})
//查看文章详情
const showContent = (param) => {
  router.push(`/explore/${param}`)
}

const push = (param) => {
  router.push(`/user/profile/${param}`)
}
// const load = async () => {
//   // await getArticleService(page.value).then((newData) => {
//   //   console.log(newData.data.data.items)
//   //   // cardList.value = [...cardList.value, ...newData.data.data.items]
//   // })
//   console.log(cnt.value++)
// }
const cnt = ref(0)
const scrolling = async (e) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  if (scrollHeight - scrollTop - clientHeight <= 0.5) {
    await getArticleService(page.value).then((newData) => {
      console.log(newData.data.data.items)
      cardList.value = [...cardList.value, ...newData.data.data.items]
    })
    console.log(cnt.value)
  }
}
</script>
<template>
  <div class="main" @scroll="scrolling">
    <button @click="selectChannel(0)">推荐</button>
    <button @click="selectChannel(1)">推荐</button>
    <!-- 首页瀑布流 -->

    <div @scroll="scrolling">
      <Waterfall
        :list="cardList"
        :hasAroundGutter="false"
        style="max-width: 1300px"
        :width="240"
        :gutter="20"
        class="waterfall"
      >
        <!-- 底部 -->
        <template #item="{ item }">
          <div>
            <el-image :src="item.images" class="lazyImg" @click="showContent(item.articleId)" />
            <div class="item-body">
              <div class="item-desc" @click="showContent(item.articleId)">
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
</template>
<style scoped lang="less">
.main {
  overflow: scroll;
  height: 100vh; /* 使用视口单位vh设置高度为视口高度的100% */
  // height: 500px;
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
