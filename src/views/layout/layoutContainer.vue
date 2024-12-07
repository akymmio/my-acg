<script setup>
import { House, Bell, Search, Plus, Operation, ArrowRight,MagicStick } from '@element-plus/icons-vue'
import loginPage from '@/views/login/loginPage.vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useUserStore } from '@/stores'
import { userLogoutService } from '@/api/user'
import { ref, watch, onActivated, computed } from 'vue'
const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.user)
console.log(user.value)
//如果用户信息为空,查询用户信息
const logout = async () => {
  await userLogoutService()
  userStore.removeToken()
  userStore.removeUser()
  // ElNotification({
  //   title: 'Success',
  //   message: '退出登录成功',
  //   type: 'success'
  // })

  router.go('/')
}
//接收登录页面串参数
const showLoginPage = ref(false)
const toChild = (param) => {
  showLoginPage.value = param
  showUserInfo.value = param
}

// watch(
//   () => userStore.user,
//   (newUser) => {
//     user.value = newUser
//   }
// )
const activeItem = ref()
const routeTo = (path) => {
  activeItem.value = path
  if (path == 'explore') {
    router.push('/explore')
  } else {
    if (!userStore.token) {
      showLoginPage.value = true
      ElNotification({
        title: '请先登录',
        type: 'error',
        duration: 1500
      })
      return
    }
    if (path == 'publish') {
      router.push('/publish')
    } else if (path === 'notification') {
      router.push('/notification')
    } else if (path === 'model') {
      router.push('/model')
    } else {
      router.push(`/user/profile/${user.value.id}`)
    }
  }
}
// const push = () => {
//   router.push(`/user/profile/${user.value.id}`)
// }
const showUserInfo = ref(false)
const searchData = ref()
const search = () => {
  console.log(searchData.value)
  router.push({ path: '/explore', query: { key_word: searchData.value } })
  searchData.value = ''
}

//定义变量
const placeScroll = ref()
onBeforeRouteLeave((to, from, next) => {
  //在路由跳转之前，对当前浏览位置进行保存
  placeScroll.value = document.documentElement.scrollTop
  console.log(placeScroll.value)
  next()
})
//组件激活
onActivated(() => {
  if (placeScroll.value != null && placeScroll.value > 0) {
    //组件激活后进行浏览位置的赋值
    document.documentElement.scrollTop = placeScroll.value
    document.body.scrollTop = placeScroll.value
    console.log(placeScroll.value)
  }
})
const showCard = ref(false)
</script>

<template>
  <div class="main">
    <el-container class="layout">
      <el-header height="80px">
        <el-row>
          <el-col :span="9"></el-col>
          <el-col
            :span="8"
            style="display: flex; justify-content: center; align-items: center"
            @keyup.enter="search"
          >
            <input class="inputSearch" placeholder="搜索" v-model="searchData" />
            <button class="inputIcon" @click="search">
              <el-icon size="large" class="searchIcon"><Search /></el-icon>
            </button>
          </el-col>
          <!-- <el-col :span="8"></el-col> -->
        </el-row>
      </el-header>
      <div class="grid-container">
        <div class="grid-item item-1"></div>
        <div class="grid-item item-2">
          <el-col class="side">
            <div>
              <ui>
                <li
                  class="el-menu-item"
                  @click="routeTo('explore')"
                  :class="{ active: activeItem === 'explore' }"
                >
                  <el-icon><House /></el-icon>
                  <span> 探索</span>
                </li>
                <li
                  class="el-menu-item"
                  @click="routeTo('model')"
                  :class="{ active: activeItem === 'model' }"
                >
                <el-icon><MagicStick /></el-icon>
                  <span> 展示</span>
                </li>
                <li
                  class="el-menu-item"
                  @click="routeTo('publish')"
                  :class="{ active: activeItem === 'publish' }"
                >
                  <el-icon><Plus /></el-icon>
                  <span> 发布</span>
                </li>
                <li
                  class="el-menu-item"
                  @click="routeTo('notification')"
                  :class="{ active: activeItem === 'notification' }"
                >
                  <el-icon><Bell /></el-icon>
                  <span>通知</span>
                </li>
                <li
                  class="el-menu-item"
                  v-if="userStore.token"
                  @click="routeTo('me')"
                  :class="{ active: activeItem === 'me' }"
                >
                  <el-avatar :size="30" :src="user.avatar" style="margin-left: 0" />
                  <span>我</span>
                </li>
                <li v-else class="loginItem" @click="showLoginPage = true">
                  <span>登录</span>
                </li>

                <div>
                  <!-- <el-card v-if="showCard" class="card">
                  <div class="popoverContainer">
                    <button @click="showUserInfo = true" class="exitButton">修改信息</button>
                    <button @click="logout" class="exitButton">退出登录</button>
                  </div>
                </el-card> -->
                </div>
                <el-popover placement="bottom" :width="200" trigger="click">
                  <template #reference>
                    <li class="more" v-if="userStore.token" @click="showCard = !showCard">
                      <div class="moreButton">
                        <el-icon><Operation /></el-icon>
                        <span>更多</span>
                      </div>
                    </li>
                  </template>
                  <template #default>
                    <div class="popoverContainer">
                      <button @click="showUserInfo = true" class="exitButton">
                        修改信息
                        <el-icon><ArrowRight /></el-icon>
                      </button>
                      <button @click="logout" class="exitButton">
                        退出登录
                        <el-icon><ArrowRight /></el-icon>
                      </button>
                    </div>
                  </template>
                </el-popover>
              </ui>
            </div>
          </el-col>
        </div>
        <div class="grid-item item-8">
          <el-col>
            <router-view></router-view>
            <!-- <router-view v-slot="{ Component }">
              <keep-alive exclude="contentPage,userProfile,publishPage,loginPage">
                <component :is="Component" />
              </keep-alive>
            </router-view> -->
          </el-col>
        </div>
      </div>
    </el-container>
  </div>
  <transition name="fade">
    <loginPage v-if="showLoginPage" @toParent="toChild"></loginPage>
  </transition>
  <UpdateUserInfo v-if="showUserInfo" @toParent="toChild"></UpdateUserInfo>
</template>
<style lang="less" scoped>
.grid-container {
  display: grid;
  grid-template-columns: 0.5fr 1.2fr  7.8fr 0.5fr;
  height: 100vh;
}
/* 当屏幕宽度小于某个值时调整布局 */
@media (max-width: 768px) { /* 你可以调整这个断点 */
  .grid-horizontal-split {
    grid-template-columns: 1fr; /* 只有一列 */
  }

  .item-2 {
    display: none; /* 隐藏20%的部分 */
  }

  .item-8 {
    grid-column: 1 / -1; /* 让80%的部分占据全部空间 */
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to{
  opacity: 0;
}

.layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  .el-header {
    background: rgb(255, 255, 255);

    .inputSearch {
      margin-top: 20px;
      width: 400px;
      height: 40px;
      border: 0;
      border-radius: 30px 0 0 30px;
      font-size: large;
      background-color: #f6f6f6;
      padding-left: 15px;
      vertical-align: middle;
    }
    .inputSearch:focus {
      outline: none;
    }
    .inputIcon {
      margin-top: 20px;
      height: 40px;
      width: 50px;
      border: 0;
      padding-left: 10px;
      border-radius: 0 30px 30px 0;
      background-color: #f6f6f6;
      vertical-align: middle;
      box-sizing: content-box;
    }
  }
}
.layout::-webkit-scrollbar {
  display: none;
}

.popoverContainer{
  display: flex;
  // justify-content:center;
  flex-direction: column;
  // align-items: center;
  border-radius: 30px;
    .exitButton {
      margin: 10px 0 0 0;
      height: 40px;
      // width: 70px;
      // padding: 5px;
      border: 0;
      border-radius: 10px;
      background-color: white;
      text-align: left;
      align-items: center;     /* 垂直居中 */

      display: flex;
      justify-content: space-between;

    }
    .exitButton:hover {
      background-color: #f6f6f6;
    }

}
.side {

  letter-spacing: 1px; /* 增加字符间距 */

  position: relative;
  margin-right: 20px;
  ul {
    list-style-type: none;
  }
  li {
    height: 48px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    span {
      margin-left: 10px;
    }
  }
  .el-menu-item {
    border-radius: 40px;
    font-size: large;
    font-weight: bold;
    vertical-align: middle;
    padding-left: 20px;
    height: 48px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .el-menu-item:hover {
    background: #f7f7f7;
  }
  .el-menu-item.active{
    background-color: #f7f7f7 ;
  }
  .active{
    background-color: #f7f7f7 ;
  }
  .toShowCard{
    // background: lightblue;
    min-height: 200px;
    margin-top: calc(100vh - 590px);
  }
  .card{
    border-radius: 20px;
    // margin-top: calc(100vh - 580px);
    max-width: 480px;
    min-height: 100px;
  }
  .more {
    // margin-top: calc(100vh - 580px);
    border-radius: 40px;
    .moreButton{
      border: 0;
      display: flex;
      padding-left: 20px;
      align-items: center;
      border-radius: 40px;
    }

  }
  .more:hover{
    background: #f7f7f7;
    // .moreButton{
    //   background: #f7f7f7;
    // }
  }
  .loginItem {
    padding-left: 0;
    border-radius: 40px;
    font-size: large;
    font-weight: bold;
    background: #ff2e4d;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white
    // text-align: center;
  }

}
/* 响应式布局 让两列堆叠而不是并排 */
@media screen and (max-width: 800px) {
  .side {
    display:none
  }
}
.inner-header {
  // vertical-align: middle;
  height: 60px;
  background: rgb(255, 255, 255);
}
</style>
