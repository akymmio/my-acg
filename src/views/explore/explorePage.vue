<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { requireImg } from '@/utils/requireImg'
import { Plus } from '@element-plus/icons-vue'
import { getArticleService } from '@/api/article'
const router = useRouter()
const route = useRoute()
const imageUrl = requireImg('@/assets/icon/loading.gif')
//分页参数
const page = ref({
  pageNum: 1,
  pageSize: 10,
  channelId: 0
})
//获取文章数据
const cardList = ref([])
//记录总数
const currTotal = ref(0)
const total = ref(page.value.pageSize)
const showloading = ref(false)
const fetchData = async (channelId) => {
  // if (cardList.value) return
  page.value.channelId = channelId

  await getArticleService(page.value).then((newData) => {
    // console.log(newData.data.data.items)
    cardList.value = [...cardList.value, ...newData.data.data.items]
    currTotal.value += newData.data.data.items.length
    console.log(currTotal.value)
    console.log(total.value)

    page.value.pageNum++
    console.log(newData.data.data.items)
    total.value = newData.data.data.total
  })
}
fetchData()

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
const showFinish = ref(false)
const isFetching = ref(false)
const scrolling = async (e) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  let position = scrollHeight - scrollTop - clientHeight
  if (position < 200 && position > 190 && currTotal.value < total.value) {
    isFetching.value = true // 设置标志，表示正在加载数据
    try {
      await fetchData(0)
      // console.log(1)
    } finally {
      isFetching.value = false // 数据加载完成，清除标志
    }
  } else {
    showFinish.value = true
    showLoadMore.value = false
  }
}
const showLoadMore = ref(true)
const loadMore = async () => {
  await fetchData(0)
}
</script>
<template>
  <div class="main" @scroll="scrolling">
    <button @click="selectChannel(0)" class="button">推荐</button>
    <button @click="selectChannel(1)" class="button">推荐</button>
    <!-- 首页瀑布流 -->
    <div @scroll="scrolling">
      <Waterfall
        :list="cardList"
        :hasAroundGutter="false"
        :width="280"
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
      <div v-if="showFinish" class="finishLoading"><span>没有更多...</span></div>
      <div class="loading" v-if="showloading">
        <img :src="imageUrl" alt="Dynamic Image" style="width: 60px" />
      </div>
      <div>
        <el-icon @click="loadMore" class="loadButton" v-if="showLoadMore"><Plus /></el-icon>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.loadButton {
  float: right;
  position: relative;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  border: 0;
}
.finishLoading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: #b7b7b7;
}
.loadButton:hover {
  background: #f7f7f7;
}
.loading {
  width: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  // background: #000000;
}
.main {
  overflow: scroll;
  height: 100vh; /* 使用视口单位vh设置高度为视口高度的100% */
}

.main::-webkit-scrollbar {
  display: none;
}

.button {
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
