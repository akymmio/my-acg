<script setup>
import { ref } from 'vue'
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
const user = ref({})

import { getArticleByUserIdService } from '@/api/article'
import { getArticleLikedService } from '@/api/liked'
const notes = ref([])
const getUserInfo = async () => {
  //没有用户信息需要通过id查询
  if (route.params.id !== localUser.value.id) {
    // console.log('route_id', route.params.id)
    const res = await getUserInfoByIdService(route.params.id)
    user.value = res.data.data
  } else {
    user.value = localUser.value
  }
}
getUserInfo()
const fetchData = async (param = 'note') => {
  let res
  if (param === undefined || param == 'note') {
    console.log(user.value.id)
    res = await getArticleByUserIdService(route.params.id)
  } else if (param == 'like') {
    console.log(user.value.id)
    res = await getArticleLikedService(route.params.id)
  }
  notes.value = res.data.data
  console.log(res.data.data)
}
fetchData()

//通过用户名查询账号信息

// watch(
//   () => route.params.id,
//   (newId, oldId) => {
//     if (newId !== oldId) {
//       getUserInfo() // 当 userId 变化时，重新获取数据
//     }
//   },
//   { immediate: true } // 立即执行一次，以获取初始数据
// )

const showUser = ref(true)
const isFixed = ref(false)
const scrolling = async (e) => {
  console.log(1)
  const scrollTop = e.target.scrollTop
  if (scrollTop > 190) {
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
              <el-descriptions-item label="账号">{{ user.username }}</el-descriptions-item>
              <el-descriptions-item>
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
              </el-descriptions-item>
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
          width: isFixed ? '79%' : '100%'
        }"
      >
        <button class="button" @click="fetchData('note')">笔记</button>
        <button class="button" @click="fetchData('like')">喜欢</button>
      </div>
    </div>
    <div>
      <Waterfall :list="notes" :hasAroundGutter="false" :align="center" :width="280" :gutter="20">
        <!-- 底部 -->
        <template #item="{ item, index }">
          <div>
            <el-image :src="item.cover" class="img" @click="showContent(item.articleId)" />
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
                  <div style="padding-left: 2px">{{ item.likedCount }}</div>
                  <!-- <div>
                  <el-icon><Delete /></el-icon>
                </div> -->
                  <!-- <div style="padding-left: 5px">
                  <delete theme="two-tone" size="17" :fill="['#18aaff', '#ffffff']" />
                </div> -->

                  <div style="padding-left: 5px">
                    <el-popconfirm
                      confirm-button-text="是"
                      cancel-button-text="否"
                      title="删除笔记"
                      @confirm="deleteArticle(item.articleId, index)"
                    >
                      <template #reference>
                        <delete theme="filled" size="16" fill="#ff6262" />
                      </template>
                    </el-popconfirm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Waterfall>
      <div class="finishLoading"><span>没有更多...</span></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.fix{
  // position: fixed;
  z-index: 1000; /* 确保在其他内容之上 */
  // top: 80px;
  background-color: white;
  // width: 80%;
  text-align: center;
  // left: 50%;
  // background-color: yellow;
  // padding-left: 50%;
  transition: top 0.3s ease;
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
  height: calc(100vh - 80px);
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
}
.main {
  padding-top: 20px;
}
.button {
  border-radius: 40px;
  font-size: 18px;
  background-color: white;
  border: 0;
  width: 80px;
  height: 40px;
  margin-bottom: 15px;
}
.button:hover {
  background-color: #f6f6f6;
}
.button:focus {
  background-color: #f6f6f6;
  // font-weight: bold;

}
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
