<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import _ from 'lodash'
import { useRouter, useRoute } from 'vue-router'
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { require } from '@/utils/require'
import { Plus, Close, Loading } from '@element-plus/icons-vue'
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
import { vue3dLoader } from 'vue-3d-loader'

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
const total = ref(0)
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
  currTotal.value = 0
  total.value = 0

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
  // 1. 确保获取正确的滚动容器（可能需要指定特定元素）
  const container = e.target // 或 document.documentElement（如果是页面滚动）

  // 2. 计算滚动位置参数
  const { clientHeight, scrollHeight, scrollTop } = container

  // 3. 调整阈值：距离底部 100px 时触发（更符合常见需求）
  const threshold = 100 // 或设置为 clientHeight 的比例（如 0.8 * clientHeight）
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold

  // window.scrollY + window.innerHeight >= container.offsetHeight

  // 4. 添加防抖逻辑（避免频繁触发）
  if (!isFetching.value && isNearBottom && currTotal.value < total.value) {
    console.log(1)
    try {
      isFetching.value = true
      await fetchData(page.value.channelId)

      // 5. 确保页码递增（需在 fetchData 中处理或在此处更新）
      // page.value.current += 1;
    } finally {
      console.log(2)
      isFetching.value = false
    }
  } else if (currTotal.value >= total.value) {
    // 6. 仅在数据全部加载完成时显示结束提示
    showFinish.value = true
    showLoadMore.value = false
  }
}

// 4. 使用稳定引用的防抖函数（确保在组件setup外部定义或使用ref保存）
const debouncedScroll = _.debounce(scrolling, 200)

onMounted(() => {
  window.addEventListener('scroll', debouncedScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', debouncedScroll)
  debouncedScroll.cancel() // 取消可能的 pending 执行
})
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
  if (!param) {
    closeDetail()
  } else {
    isLoading.value = false
  }
}
//查看文章详情
const id = ref()
const detailPage = ref(null)
const detailImage = ref(null)
const overlay = ref(null)
const activeCard = ref(null)

const isLoading = ref(false)

const showContent = async (articleId) => {
  id.value = articleId
  const card = event.currentTarget
  activeCard.value = card
  const rect = card.getBoundingClientRect()

  // 设置详情页的初始位置和大小
  detailPage.value.style.left = `${rect.left}px`
  detailPage.value.style.top = `${rect.top}px`
  detailPage.value.style.width = `${rect.width}px`
  detailPage.value.style.height = `${rect.height}px`
  detailPage.value.style.display = 'block'

  // 显示遮罩层
  overlay.value.style.display = 'block'

  // 先执行展开动画
  gsap.to(detailPage.value, {
    left: '50%',
    top: '50%',
    width: '60%',
    height: '95vh',
    xPercent: -50,
    yPercent: -50,
    duration: 0.5
  })

  gsap.to(overlay.value, {
    opacity: 1,
    duration: 0.5
  })

  // 显示关闭按钮
  gsap.to('.close-btn', {
    opacity: 1,
    duration: 0.1,
    delay: 0.3
  })

  // 显示加载状态
  isLoading.value = true
  isModalVisible.value = true

  // 更新路由
  router.push(`/explore/content/${articleId}`)
}

const closeDetail = () => {
  if (!activeCard.value) return

  const rect = activeCard.value.getBoundingClientRect()

  // 隐藏关闭按钮
  gsap.to('.close-btn', {
    opacity: 0,
    duration: 0
  })

  gsap.to(detailPage.value, {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    xPercent: 0,
    yPercent: 0,
    duration: 0.5,
    onComplete: () => {
      isModalVisible.value = false
      detailPage.value.style.display = 'none'
      activeCard.value = null
    }
  })

  gsap.to(overlay.value, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      overlay.value.style.display = 'none'
    }
  })
  // 返回上一级路由
  setTimeout(() => {
    router.push('/explore')
  }, 500)
}

// 添加点击遮罩层关闭详情页的功能
watch(overlay, (el) => {
  if (el) {
    el.addEventListener('click', closeDetail)
  }
})

import { gsap } from 'gsap'
</script>
<template>
  <div class="main" @scroll="scrolling">
    <div>
      <button @click="selectChannel(0)" class="button" :class="{ active: activeItem === 0 }">
        推荐
      </button>
      <button @click="selectChannel(1)" class="button" :class="{ active: activeItem === 1 }">
        文物珍萃
      </button>
      <button @click="selectChannel(2)" class="button" :class="{ active: activeItem === 2 }">
        书画典籍
      </button>
      <button @click="selectChannel(3)" class="button" :class="{ active: activeItem === 3 }">
        建筑遗址
      </button>
      <button @click="selectChannel(4)" class="button" :class="{ active: activeItem === 4 }">
        非遗技艺
      </button>
      <button @click="selectChannel(5)" class="button" :class="{ active: activeItem === 5 }">
        活态文化
      </button>
      <button @click="selectChannel(6)" class="button" :class="{ active: activeItem === 6 }">
        外国文化
      </button>
      <button @click="selectChannel(20)" class="button" :class="{ active: activeItem === 20 }">
        其他
      </button>
      <!-- <button @click="selectChannel(0)" class="button" :class="{ active: activeItem === 0 }">
        推荐
      </button>
      <button @click="selectChannel(1)" class="button" :class="{ active: activeItem === 1 }">
        陶瓷
      </button>
      <button @click="selectChannel(2)" class="button" :class="{ active: activeItem === 2 }">
        器具
      </button>
      <button @click="selectChannel(3)" class="button" :class="{ active: activeItem === 3 }">
        书画
      </button>
      <button @click="selectChannel(4)" class="button" :class="{ active: activeItem === 4 }">
        雕塑
      </button>
      <button @click="selectChannel(5)" class="button" :class="{ active: activeItem === 5 }">
        工艺品
      </button>
      <button @click="selectChannel(6)" class="button" :class="{ active: activeItem === 6 }">
        外国文物
      </button>
      <button @click="selectChannel(20)" class="button" :class="{ active: activeItem === 20 }">
        其他
      </button> -->
      <!-- <button @click="selectChannel(1)" class="button">推荐</button> -->
      <!-- <button @click="selectChannel(1)" class="button">推荐</button> -->
      <!-- 首页瀑布流 -->
      <div @scroll="scrolling" ref="myElement">
        <Waterfall
          :list="cardList"
          :hasAroundGutter="false"
          :width="276"
          :gutter="20"
          :breakpoints="{
            1400: { rowPerView: 5 },
            1200: { rowPerView: 4 },
            800: { rowPerView: 3 },
            600: { rowPerView: 2 }
          }"
          :lazyload="true"
        >
          <template #default="{ item, index }">
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
                    <div>{{ item.nickname }}</div>
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
          <!-- <div style="height: 50px; background: black"></div> -->
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
    <div class="overlay" ref="overlay"></div>
    <div class="close-btn" @click="closeDetail">
      <el-icon><Close /></el-icon>
    </div>
    <div class="detail-page" ref="detailPage">
      <div v-if="isLoading" class="loading-container">
        <el-icon class="is-loading"><Loading /></el-icon>
      </div>
      <!-- <ContentPage v-if="isModalVisible" :id="id" @toParent="toChild" /> -->
      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
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
  height: calc(100vh - 100px); /* 视口高度减去顶部开始的位置 */
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
  font-weight: bold;
  // color: rgb(154, 75, 15);
}
.button:hover {
  // color: #000000;
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 999;
}

.detail-page {
  position: fixed;
  display: none;
  z-index: 1000;
  background: white;
  border-radius: 20px;
  overflow: hidden;

  .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;

    .el-icon {
      font-size: 30px;
      color: #409eff;
    }
  }

  :deep(.mask) {
    position: relative;
    background: none;
    height: 100%;
    width: 100%;

    .container {
      height: 100%;
      width: 100%;
      margin: 0;
      display: flex;

      .left {
        width: 60%;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
      }

      .right {
        width: 40%;
        overflow: auto;
      }
    }
  }
}

.close-btn {
  position: fixed;
  top: 20px;
  right: calc(20% - 50px); // 根据内容区域右边缘计算位置
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1001;
  opacity: 0;
  transition: all 0.3s ease;

  &:hover {
    background: #f3f3f3;
    transform: rotate(90deg);
  }
}

// 媒体查询优化
@media screen and (max-width: 1200px) {
  .detail-page {
    width: 80% !important; // 覆盖内联样式

    :deep(.mask .container) {
      flex-direction: column;

      .left,
      .right {
        width: 100%;
        height: auto;
      }

      .left {
        border-right: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
    }
  }

  .close-btn {
    right: 20px;
  }
}

@media screen and (max-width: 768px) {
  .detail-page {
    width: 95% !important;
    height: 95vh !important;
    margin: auto;
  }
}

.detail-content {
  width: 100%;
  height: 100%;
  background: white;
  opacity: 0;
}
</style>
