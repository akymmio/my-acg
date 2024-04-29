<script setup>
import { ref, watch } from 'vue'
import { Female, Male } from '@element-plus/icons-vue'
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { getUserInfoByIdService } from '@/api/user'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const route = useRoute()
//本地用户信息
const localUser = ref(userStore.user)
const user = ref(userStore.user)
//通过用户名查询账号信息
const getUserInfo = async () => {
  //没有用户信息需要通过id查询
  if (route.params.id !== localUser.value.id) {
    const res = await getUserInfoByIdService(route.params.id)
    user.value = res.data.data
  } else {
    //说明是从另一个用户切回来
    user.value = localUser.value
    console.log(user.value)
  }
}
getUserInfo()

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      getUserInfo() // 当 userId 变化时，重新获取数据
    }
  },
  { immediate: true } // 立即执行一次，以获取初始数据
)
import { getArticleByUserIdService } from '@/api/article'
import { getArticleLikedService } from '@/api/liked'
const notes = ref([])
const fetchData = async (param = 'note') => {
  let res
  if (param === undefined || param == 'note') {
    res = await getArticleByUserIdService(user.value.id)
  } else if (param == 'like') {
    res = await getArticleLikedService(user.value.id)
  }
  notes.value = res.data.data
  console.log(res.data.data)
}
fetchData()
const showUser = ref(true)
const scrolling = async (e) => {
  const scrollTop = e.target.scrollTop
  if (scrollTop == 0) {
    showUser.value = true
  } else {
    showUser.value = false
  }
}
</script>

<template>
  <div style="text-align: center">
    <div class="header" v-show="showUser">
      <div class="element">
        <el-avatar :size="180" :src="user.avatar" :fit="cover" />
      </div>
      <div class="element">
        <el-descriptions class="margin-top" :title="user.nickname" :column="1" :style="blockMargin">
          <el-descriptions-item label="账号">{{ user.username }}</el-descriptions-item>
          <el-descriptions-item>
            <el-icon v-if="user.sex === '0'"><Female /></el-icon>
            <el-icon v-else><Male /></el-icon>
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
      <div class="element" @click="follow" v-if="route.params.id !== localUser.id">
        <button class="unFollowButton" v-if="user.followed">已关注</button>
        <button class="followButton" v-else>关注</button>
      </div>
      <!-- {{ userInfo.username }} -->
    </div>
    <div>
      <button class="button" @click="fetchData('note')">笔记</button>
      <button class="button" @click="fetchData('like')">喜欢</button>
    </div>
  </div>
  <div class="note_style" @scroll="scrolling">
    <Waterfall :list="notes" :hasAroundGutter="false" :width="280" :gutter="20">
      <!-- 底部 -->
      <template #item="{ item }">
        <div>
          <el-image :src="item.cover" class="lazyImg" @click="showContent(item.articleId)" />
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
    <div class="finishLoading"><span>没有更多...</span></div>
  </div>
</template>

<style scoped lang="less">
.finishLoading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: #b7b7b7;
}
.note_style{
  // height: 550px;
  height: calc(100vh - 135px);
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
</style>
