<script setup>
import {
  House,
  Bell,
  Search,
  Plus,
  Operation,
  ArrowRight,
  MagicStick,
  Star
} from '@element-plus/icons-vue'
import loginPage from '@/views/login/loginPage.vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useUserStore } from '@/stores'
import { userLogoutService } from '@/api/user'
import { ref, watch, onMounted, onActivated, computed } from 'vue'
const router = useRouter()
const userStore = useUserStore()
const user = computed(() => userStore.user)
console.log(user.value)

onMounted(async () => {
  // 检查是否存在用户信息，若不存在则重新获取
  if (!userStore.user.id) {
    await userStore.getUser()
  }
})

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
  console.log(path)
  if (path === 'model') {
    router.push('/model')
  } else if (path === 'collection') {
    console.log('collection')
    router.push('/collection')
  } else if (path === 'activity') {
    router.push('/activity')
  } else if (path == 'explore') {
    router.push('/explore')
  } else {
    if (!userStore.token) {
      showLoginPage.value = true
      ElNotification({
        title: '请先登录',
        type: 'error',
        duration: 1000,
        position: 'top-left'
      })
      return
    }
    if (path == 'publish') {
      router.push('/publish')
    } else if (path === 'notification') {
      router.push('/notification')
    } else if (path === 'activityPublish') {
      router.push('/activityPublish')
    } else if (path === 'me') {
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
const showApplyExpert = ref(false)
</script>

<template>
  <div>
    <el-container class="layout">
      <el-header class="header" height="80px">
        <el-row>
          <el-col :span="8"></el-col>
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
        <div class=""></div>
        <div>
          <el-menu default-active="1" @open="handleOpen" @close="handleClose">
            <el-menu-item
              index="1"
              @click="routeTo('explore')"
              :class="{ active: activeItem === 'explore' }"
            >
              <el-icon><House /></el-icon>
              <span> 探索</span>
            </el-menu-item>

            <el-menu-item
              index="2"
              @click="routeTo('collection')"
              :class="{ active: activeItem === 'collection' }"
            >
              <el-icon><Star /></el-icon>
              <span> 藏品</span>
            </el-menu-item>
            <el-menu-item
              index="3"
              @click="routeTo('model')"
              :class="{ active: activeItem === 'model' }"
            >
              <el-icon><MagicStick /></el-icon>
              <span> 模型</span>
            </el-menu-item>
            <el-menu-item
              index="4"
              @click="routeTo('activity')"
              :class="{ active: activeItem === 'activity' }"
            >
              <el-icon><Star /></el-icon>
              <span> 活动</span>
            </el-menu-item>
            <el-menu-item
              index="5"
              @click="routeTo('notification')"
              :class="{ active: activeItem === 'notification' }"
            >
              <el-icon><Bell /></el-icon>
              <span>通知</span>
            </el-menu-item>
            <el-sub-menu index="6" v-if="user.admin === true">
              <template #title>
                <div class="subMenu">
                  <el-icon><Plus /></el-icon>
                  <span>发布</span>
                </div>
              </template>
              <el-menu-item index="2-1" @click="routeTo('publish')">笔记</el-menu-item>
              <el-menu-item index="2-2" @click="routeTo('activityPublish')">活动</el-menu-item>
            </el-sub-menu>
            <el-menu-item
              v-else
              index="6"
              @click="routeTo('publish')"
              :class="{ active: activeItem === 'publish' }"
            >
              <el-icon><Plus /></el-icon>
              <span> 发布</span>
            </el-menu-item>
            <el-menu-item
              index="7"
              @click="routeTo('me')"
              :class="{ active: activeItem === 'me' }"
              v-if="userStore.token"
            >
              <el-avatar
                v-if="userStore.token"
                :size="30"
                :src="user.avatar"
                style="margin-left: 0"
              />
              <span>个人</span>
            </el-menu-item>
            <el-menu-item v-else class="loginItem" @click="showLoginPage = true">
              <span>登录</span>
            </el-menu-item>
          </el-menu>
          <el-popover placement="bottom" :width="200" trigger="click">
            <template #reference>
              <div class="more" v-if="userStore.token" @click="showCard = !showCard">
                <div class="moreButton">
                  <el-icon><Operation /></el-icon>
                  <span> 更多</span>
                </div>
              </div>
            </template>
            <template #default>
              <div class="popoverContainer">
                <button @click="showApplyExpert = true" class="exitButton">
                  申请成为管理员
                  <el-icon><ArrowRight /></el-icon>
                </button>
                <button @click="showUserInfo = true" class="exitButton">
                  修改用户信息
                  <el-icon><ArrowRight /></el-icon>
                </button>
                <button @click="logout" class="exitButton">
                  退出登录
                  <el-icon><ArrowRight /></el-icon>
                </button>
              </div>
            </template>
          </el-popover>
        </div>
        <div>
          <router-view style="margin-top: 20px"> </router-view>
          <!-- <router-view v-slot="{ Component }">
              <keep-alive exclude="contentPage,userProfile,publishPage,loginPage">
                <component :is="Component" />
              </keep-alive>
            </router-view> -->
        </div>
      </div>
    </el-container>
  </div>
  <el-dialog v-model="showApplyExpert" title="申请成为管理员" width="500">
    <!-- <el-form :model="form">
      <el-form-item label="Promotion name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"> Confirm </el-button>
      </div>
    </template> -->
    test
  </el-dialog>
  <transition name="fade">
    <loginPage v-if="showLoginPage" @toParent="toChild"></loginPage>
  </transition>
  <UpdateUserInfo v-if="showUserInfo" @toParent="toChild"></UpdateUserInfo>
</template>
<style lang="less" scoped>
.grid-container {
  display: grid;
  grid-template-columns: 0.6fr 1.3fr 7.8fr 0.5fr;
  // height: 100vh;
}
/* 当屏幕宽度小于某个值时调整布局 */
@media (max-width: 768px) {
  /* 你可以调整这个断点 */
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: scroll;
  .header {
    height: 80px;
  }
  .el-header {
    // background: rgb(255, 255, 255);
    // background-image: url('/icon/s672da45d46c75.jpg');
    background-image: url('/icon/png8.png');

    .inputSearch {
      color: rgb(154, 75, 15);
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
      color: rgb(154, 75, 15);
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

.popoverContainer {
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
    align-items: center; /* 垂直居中 */

    display: flex;
    justify-content: space-between;
  }
  .exitButton:hover {
    background-color: #f6f6f6;
  }
}

.el-menu {
  padding-top: 20px;
  padding-right: 20px;
  border-right: 0 !important;
}
.el-sub-menu {
  .subMenu {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: large;
    font-weight: bold;
    border-radius: 40px;
    color: rgb(154, 75, 15) !important;
  }
}
.el-menu-item {
  border-radius: 40px;
  font-size: large;
  font-weight: bold;
  color: rgb(154, 75, 15);
  // vertical-align: middle;
  // padding-left: 20px;
  // height: 48px;
  // display: flex;
  // align-items: center;
  margin-bottom: 8px;
}
.el-menu-item:hover {
  background: #f7f7f7;
}
.el-menu-item.active {
  background-color: #f7f7f7;
}
.side {
  letter-spacing: 1px; /* 增加字符间距 */
  // position: relative;
  margin-right: 20px;
  padding-top: 20px;
  // ul {
  // list-style-type: none;
  // }
  li {
    list-style-type: none;
    height: 48px;
    // display: flex;
    // align-items: center;
    // margin-bottom: 8px;
    span {
      margin-left: 10px;
    }
  }
  .active {
    background-color: #f7f7f7;
  }
  .toShowCard {
    // background: lightblue;
    min-height: 200px;
    margin-top: calc(100vh - 590px);
  }
  .card {
    border-radius: 20px;
    // margin-top: calc(100vh - 580px);
    max-width: 480px;
    min-height: 100px;
  }
}
.more {
  // margin-top: calc(25vh );
  width: 10%;
  height: 5vh;
  border-radius: 40px;
  // font-size: large;
  font-weight: bold;
  color: rgb(154, 75, 15);
  // position: fixed;
  position: absolute;
  bottom: 0;
  margin-bottom: 20px;
  // display: flex;

  border: 0;
  display: flex;
  align-items: center;
  padding-left: 20px;

  border-radius: 40px;
}
.more:hover {
  background: #f7f7f7;
  // .moreButton{
  //   background: #f7f7f7;
  // }
}
.loginItem {
  border-radius: 40px;
  // font-size: large;
  // font-weight: bold;
  background: #ff2e4d;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  transition: all 0.5s;
}
.loginItem :hover {
  color: rgb(154, 75, 15);
}
/* 响应式布局 让两列堆叠而不是并排 */
@media screen and (max-width: 800px) {
  .side {
    display: none;
  }
}
.inner-header {
  // vertical-align: middle;
  height: 60px;
  background: rgb(255, 255, 255);
}
</style>
