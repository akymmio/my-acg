<script setup>
import { ref, watch } from 'vue'
import { Waterfall } from 'vue-waterfall-plugin-next'

import 'vue-waterfall-plugin-next/dist/style.css'
import { getUserInfoByIdService } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { Like as like } from '@icon-park/vue-next'
// import '@icon-park/vue/styles/index.css'
import { Delete } from '@icon-park/vue-next'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
//本地用户信息
const localUser = ref(userStore.user)
const user = ref(userStore.user)

import { getArticleByUserIdService } from '@/api/article'
import { getArticleLikedService } from '@/api/liked'
const notes = ref([])
const getUserInfo = async () => {
  //没有用户信息需要通过id查询//
  console.log(localUser.value.id, route.params.id)
  if (route.params.id !== localUser.value.id) {
    const res = await getUserInfoByIdService(route.params.id)
    user.value = res.data.data
    console.log(res.data.data)
  } else {
    user.value = localUser.value
  }
}
getUserInfo()
// const fetchData = async (param = 'note') => {
//   let res
//   if (param === undefined || param == 'note') {
//     console.log(user.value.id)
//     res = await getArticleByUserIdService(route.params.id)
//   } else if (param == 'like') {
//     console.log(user.value.id)
//     res = await getArticleLikedService(route.params.id)
//   }
//   notes.value = res.data.data
//   console.log(res.data.data)
// }
// fetchData()

//通过用户名查询账号信息
const param = ref('')
watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      getUserInfo() // 当 userId 变化时，重新获取数据
      // fetchData()
      param.value = 'note'
      console.log(param.value)
    }
  },
  { immediate: true } // 立即执行一次，以获取初始数据
)

const showUser = ref(true)
const isFixed = ref(false)
const scrolling = async (e) => {
  const scrollTop = e.target.scrollTop
  // console.log(scrollTop)
  if (scrollTop > 262) {
    isFixed.value = true
  } else {
    isFixed.value = false
  }
}
import { Male as male, Female as female } from '@icon-park/vue-next'
const showContent = (param) => {
  router.push(`/explore/${param}`)
}
import { addLikedCount } from '@/api/liked'
const toLike = (id, index) => {
  if (Object.keys(user.value).length === 0) {
    return
  }
  // console.log(id, index)
  addLikedCount(id)
  console.log(notes.value[index])
  if (notes.value[index].liked === false) {
    notes.value[index].likedCount += 1
    notes.value[index].liked = true
  } else {
    notes.value[index].likedCount -= 1
    notes.value[index].liked = false
  }
}
import { deleteArticleService } from '@/api/article'
const deleteArticle = (articleId, index) => {
  console.log(index)
  notes.value.splice(index, 1)
  deleteArticleService(articleId)
}

import { computed } from 'vue'
import Comment from '@/components/CommentNotify.vue'
import Like from '@/components/LikeNotify.vue'
import Notes from '@/components/WaterFall.vue'
// 响应式数据，用于跟踪当前激活的标签
const currentTab = ref('Comment')

// 组件映射
const components = {
  Notes
}
const currentComponent = computed(() => {
  return components[currentTab.value]
})

const handleButtonClick = (value) => {
  // 设置当前激活的标签和 param 的值
  param.value = value
  activeTab.value = value
  console.log(param.value)
}
const activeTab = ref('note')
</script>

<template>
  <div class="note_style" @scroll="scrolling">
    <div>
      <transition name="fade">
        <div class="header" v-show="showUser">
          <div class="element">
            <el-avatar :size="180" :src="user.avatar" :fit="cover" />
          </div>
          <div class="element">
            <el-descriptions
              class="margin-top"
              :title="user.nickname"
              :column="1"
              :style="blockMargin"
            >
              <el-descriptions-item>
                <div class="title">
                  <span class="title-expert">专家</span>
                  <span class="title-user">用户</span>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="账号">
                <span style="padding-right: 5px">{{ user.username }}</span>
                <span>
                  <female
                    v-if="user.sex === '0'"
                    theme="two-tone"
                    size="16"
                    :fill="['#18aaff', '#ffffff']"
                  />
                  <!-- <el-icon v-if="user.sex === '0'"><Female /></el-icon> -->
                  <male theme="two-tone" size="16" :fill="['#18aaff', '#ffffff']" v-else />
                  <!-- <el-icon v-else><Male /></el-icon> -->
                  <!-- 当 sex 为 1 时显示 Male 图标 -->
                </span>
              </el-descriptions-item>
              <!-- <el-descriptions-item> </el-descriptions-item> -->
              <!-- <el-descriptions-item label="昵称">{{ userInfo.nickname }}</el-descriptions-item> -->
              <el-descriptions-item label="简介">{{ user.introduction }}</el-descriptions-item>
              <el-descriptions-item>
                <span style="margin-right: 10px">关注 {{ user.follow }}</span>
                <span>获赞 {{ user.likedCount }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div
            class="element"
            @click="follow"
            v-if="route.params.id !== localUser.id"
            :style="{ position: isSticky ? 'fixed' : 'relative', top: isSticky ? '0' : '' }"
          >
            <button class="unFollowButton" v-if="user.followed">已关注</button>
            <button class="followButton" v-else>关注</button>
          </div>
          <!-- {{ userInfo.username }} -->
        </div>
      </transition>

      <div
        class="fix"
        :style="{
          position: isFixed ? 'fixed' : 'static',
          top: isFixed ? '80px' : '',
          width: isFixed ? '78%' : '100%'
        }"
      >
        <!-- <button class="button" @click="fetchData('note')">笔记</button>
        <button class="button" @click="fetchData('like')">喜欢</button> -->
        <button
          class="button"
          @click="handleButtonClick('note')"
          :class="{ active: activeTab === 'note' }"
        >
          笔记
        </button>
        <button
          class="button"
          @click="handleButtonClick('like')"
          :class="{ active: activeTab === 'like' }"
        >
          喜欢
        </button>
        <button
          class="button"
          @click="handleButtonClick('model')"
          :class="{ active: activeTab === 'model' }"
        >
          模型
        </button>
        <!-- <el-divider style="margin: 3px; width: 100%" /> -->
      </div>
    </div>
    <keep-alive>
      <WaterFall :param="param"></WaterFall>
    </keep-alive>
  </div>
</template>

<style scoped lang="less">

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
// .slide-fade-leave-active {
//   transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
// }
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fix{
  // position: fixed;
  z-index: 1; /* 确保在其他内容之上 */
  // top: 80px;
  background-color: white;
  // width: 80%;
  text-align: center;
  // left: 50%;
  // background-color: yellow;
  // padding-left: 50%;
  // transition: top 1s ease;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-leave-to {
  opacity: 0;
}

.finishLoading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: #b7b7b7;
}
.note_style{
  height: calc(100vh - 100px);
  overflow: auto;
}
.note_style::-webkit-scrollbar{
  display: none;
}
.header {
  display: flex;
  justify-content: center; /* 水平居中 */
  .element {
    margin: 30px 40px;

  }
 .title{
    color: white;

  .title-expert {
    margin-right: 5px;
    background: rgb(255, 48, 89);
    border-radius: 5px;
    padding: 5px;

  }
  .title-user {
    background: rgb(57, 209, 40);
    border-radius: 5px;
    padding: 5px;
  }
 }
}
.main {
  padding-top: 20px;
}

.button {
  border-radius: 40px;
  font-size: 18px;
  background-color: rgb(255, 255, 255);
  border: 0;
  width: 80px;
  height: 40px;
  margin-bottom: 15px;
}.active {
  background-color:  #f6f6f6;
}
// .button:hover {
//   background-color: #f6f6f6;
// }
// .button:focus {
//   background-color: #f6f6f6;
//   // font-weight: bold;
// }
.followButton {
  color: rgb(255, 255, 255);
  border: 0;
  border-radius: 40px;
  font-size: large;
  font-weight: bold;
  background: rgb(255, 48, 89);
  width: 80px;
  height: 40px;
  margin-left: 150px
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.unFollowButton {
  border:solid 1px;
  border-radius: 40px;
  font-size: large;
  font-weight: bold;
  background: rgb(255, 255, 255);
  width: 80px;
  height: 40px;
  margin-left: 150px
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.unFollowButton:hover{
  background: #f6f6f6;
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
</style>
