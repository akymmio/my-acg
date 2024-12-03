<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { require } from '@/utils/require'
import { Plus } from '@element-plus/icons-vue'
import { getArticleService } from '@/api/article'
import { addLikedCount } from '@/api/liked'
import { Like as like } from '@icon-park/vue-next'
const router = useRouter()
const route = useRoute()
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const user = computed(() => userStore.user)
// const user = userStore.user
const imageUrl = require('@/assets/icon/loading.gif')
//分页参数
const page = ref({
  pageNum: 1,
  pageSize: 20,
  channelId: 0,
  keyword: ''
})
//获取文章数据
const cardList = ref([])
//记录总数
const currTotal = ref(0)
const total = ref(page.value.pageSize)
const showLoading = ref(false)

const fetchData = async (channelId) => {
  if (page.value.channelId !== channelId) {
    console.log(page.value.channelId)
    console.log(channelId)
    //   page.value.pageNum = 0
    //   page.value.channelId = channelId
    //   const res = await getArticleService(page.value)
    //   cardList.value = res.data.data.items
    //   currTotal.value = res.data.data.items.length
    //   total.value = res.data.data.total
    //   page.value.pageNum++
    //   console.log(cardList.value)
    //   return
  }
  await getArticleService(page.value).then((newData) => {
    cardList.value = [...cardList.value, ...newData.data.data.items]
    currTotal.value += newData.data.data.items.length
    console.log(cardList.value)
    page.value.pageNum++
    total.value = newData.data.data.total
  })
  console.log(currTotal.value, total.value)
}
fetchData(0)
//监视是否搜索
watch(
  () => route.query.key_word,
  async (newVal, oldVal) => {
    if (newVal !== oldVal && newVal) {
      page.value.keyword = route.query.key_word
      page.value.pageNum = 1
      const res = await getArticleService(page.value)
      cardList.value = res.data.data.items
      currTotal.value = res.data.data.items.length
      total.value = res.data.data.total
      page.value.pageNum++
      page.value.keyword = ''
      console.log('查找')
    }
  }
)
const activeItem = ref(0)
const selectChannel = async (channelId) => {
  page.value.pageNum = 1 // 重置页码
  page.value.channelId = channelId // 切换频道
  cardList.value = [] // 清空列表

  activeItem.value = channelId
  router.push({ path: '/explore', query: { channel_id: channelId } })
  await fetchData(channelId)
  console.log(route.query.channel_id)
}

const push = (param) => {
  console.log('ex', param)
  router.push(`/user/profile/${param}`)
}
const showFinish = ref(false)
const isFetching = ref(false)
const scrolling = async (e) => {
  const clientHeight = e.target.clientHeight
  const scrollHeight = e.target.scrollHeight
  const scrollTop = e.target.scrollTop
  const threshold = 0.4 * scrollHeight
  if (scrollTop + clientHeight >= threshold && currTotal.value < total.value && !isFetching.value) {
    // console.log(currTotal.value, total.value)
    isFetching.value = true // 设置标志，表示正在加载数据
    try {
      await fetchData(page.value.channelId)
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

import ContentPage from '../content/contentPage.vue'
const toLike = (id, index) => {
  if (Object.keys(user.value).length === 0) {
    return
  }
  addLikedCount(id)
  if (cardList.value[index].liked === false) {
    cardList.value[index].likedCount += 1
    cardList.value[index].liked = true
  } else {
    cardList.value[index].likedCount -= 1
    cardList.value[index].liked = false
  }
}
const isModalVisible = ref(false)
const toChild = (param) => {
  isModalVisible.value = param
}
//查看文章详情
const id = ref()
const showContent = (param) => {
  isModalVisible.value = !isModalVisible.value
  id.value = param
  // router.push(`/explore/${param}`)
}
</script>
<template>
  <div class="main" @scroll="scrolling">
    <button @click="selectChannel(0)" class="button" :class="{ active: activeItem === 0 }">
      推荐
    </button>
    <button @click="selectChannel(1)" class="button" :class="{ active: activeItem === 1 }">
      1
    </button>
    <button @click="selectChannel(2)" class="button" :class="{ active: activeItem === 2 }">
      2
    </button>
    <!-- <button @click="selectChannel(1)" class="button">推荐</button> -->
    <!-- <button @click="selectChannel(1)" class="button">推荐</button> -->
    <!-- 首页瀑布流 -->
    <div @scroll="scrolling" ref="myElement">
      <Waterfall
        :list="cardList"
        :hasAroundGutter="false"
        :width="280"
        :gutter="20"
        :lazyload="true"
      >
        <template #item="{ item, index }">
          <div>
            <div>
              <el-image :src="item.cover" class="img" @click="showContent(item.articleId)" />
            </div>
            <div class="item-body">
              <div class="item-desc" @click="showContent(item.articleId)">
                <span>{{ item.title }}</span>
              </div>
              <div class="item-footer">
                <div class="footer-left">
                  <img :src="item.avatar" @click="push(item.userId)" />
                  <div class="name">{{ item.nickname }}</div>
                </div>
                <div class="like">
                  <like
                    v-if="item.liked"
                    theme="two-tone"
                    size="20"
                    :fill="['#ff4242', '#ff4242']"
                    @click="toLike(item.articleId, index)"
                  />
                  <like
                    v-else
                    theme="outline"
                    size="20"
                    fill="#333"
                    @click="toLike(item.articleId, index)"
                  />
                  <!-- {{ item.liked }} -->
                  <!-- <i class="bi bi-heart" @click="toLike(item.articleId, index)"></i> -->
                  <div style="padding-left: 2px">{{ item.likedCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div style="height: 50px; background: black"></div>
      </Waterfall>
      <div v-if="showFinish" class="finishLoading"><span>没有更多...</span></div>
      <div class="loading" v-if="showLoading">
        <img :src="imageUrl" alt="Dynamic Image" style="width: 60px" />
      </div>
      <div v-if="showLoadMore">
        <el-tooltip content="加载更多" effect="light">
          <el-icon @click="loadMore" class="loadButton"><Plus /></el-icon>
        </el-tooltip>
      </div>
    </div>
  </div>
  <transition name="el-zoom-in-bottom">
    <ContentPage v-if="isModalVisible" :id="id" @toParent="toChild" />
  </transition>
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
  height: calc(100vh - 80px); /* 视口高度减去顶部开始的位置 */
}

.main::-webkit-scrollbar {
  display: none;
}

.button {
  border-radius: 40px;
  font-size: 16px;
  background-color: white;
  border: 0;
  width: 100px;
  height: 40px;
  margin-bottom: 15px;
  color: #494949;
}
.button:hover {
  color: #000000;
  background-color: #f6f6f6;
}
.button:focus {
  background-color: #f6f6f6;
  // font-weight: bold;
}
.active {
  background-color: #f6f6f6;
}
.img {
  border-radius: 20px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  // height: auto;
  // transition: filter 0.5s ease-in-out; /* 添加过渡效果 */
}
.img:hover {
  filter: brightness(0.8);
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
