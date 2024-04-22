<script setup>
import { House, Bell, Search, Plus, Operation } from '@element-plus/icons-vue'
import loginPage from '@/views/login/loginPage.vue'
// import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// const showCard = ref(false)
import { useUserStore } from '@/stores'
import { ref, h, watch } from 'vue'
const userStore = useUserStore()
// 创建一个响应式变量 user 来绑定到模板中
const user = ref(userStore.user)

//如果用户信息为空,查询用户信息
const logout = () => {
  userStore.removeToken()
  userStore.removeUser()
  ElNotification({
    title: 'Success',
    message: '退出登录成功',
    type: 'success'
  })
  router.go('/')
}
//接收登录页面串参数
const showLoginPage = ref(false)
const toChild = (param) => {
  showLoginPage.value = param
}

watch(
  () => userStore.user,
  (newUser) => {
    user.value = newUser
  }
)
const routeTo = (path) => {
  if (!userStore.token) {
    showLoginPage.value = true
    ElNotification({
      message: h('i', { style: 'color: teal' }, '请先登录')
    })
    return
  }
  if (path == 'publish') {
    router.push('/publish')
  } else if (path === 'notification') {
    router.push('/notification')
  }
}
const push = () => {
  router.push(`/user/profile/${user.value.id}`)
}
</script>

<template>
  <el-container class="layout">
    <el-header>
      <el-row>
        <el-col :span="8" style="padding-left: 100px"></el-col>
        <el-col :span="8" style="display: flex; justify-content: center; align-items: center">
          <input class="inputSearch" v-model="input1" placeholder="搜索" />
          <button class="inputIcon">
            <el-icon size="large" class="searchIcon"><Search /></el-icon>
          </button>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
    </el-header>
    <el-row>
      <el-col :span="1"></el-col>
      <el-col :span="3">
        <div class="side">
          <ui>
            <li class="el-menu-item" @click="router.push('/explore')">
              <el-icon><House /></el-icon>
              <span> 探索</span>
            </li>
            <li class="el-menu-item" @click="routeTo('publish')">
              <el-icon><Plus /></el-icon>
              <span> 发布</span>
            </li>
            <li class="el-menu-item" @click="routeTo('notification')">
              <el-icon><Bell /></el-icon>
              <span>通知</span>
            </li>
            <li class="el-menu-item" v-if="userStore.token" @click="push">
              <el-avatar :size="30" :src="user.avatar" style="margin-left: 0" />
              <span>我</span>
            </li>
            <li v-else class="loginItem" @click="showLoginPage = true" style="color: white">
              <span>登录</span>
            </li>
            <li>
              <el-popover placement="bottom" :width="200" trigger="click">
                <template #reference>
                  <el-button style="margin-right: 16px">
                    <el-icon><Operation /></el-icon>
                    <span> 更多</span>
                  </el-button>
                </template>
                <button @click="logout">exit</button>
              </el-popover>
            </li>
          </ui>
        </div>
      </el-col>
      <!-- <el-col :span="1"></el-col> -->
      <el-col :span="19">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </el-container>
  <loginPage v-show="showLoginPage" @toParent="toChild"></loginPage>
</template>
<style lang="less" scoped>
.layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .el-header {
    height: 80px;
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
.side {
  // padding-right: 20px;
  // margin-right: 20px;
  ul {
    list-style-type: none;
    // padding-left: 100px;
  }
  li {
    padding-left: 20px;
    height: 48px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    span {
      margin-left: 10px;
    }
  }
  .el-menu-item.is-active {
    background-color: rgb(0, 0, 0) !important;
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
    // text-align: center;
  }
  .el-menu-item {
    border-radius: 40px;
    font-size: large;
    font-weight: bold;
    vertical-align: middle;
  }
  .el-menu-item:hover {
    background: rgb(255, 234, 252);
  }
  // .el-menu-item:focus {
  //   background: rgb(16, 16, 16) !important;
  // }
}
/* 响应式布局 - 当屏幕小于 700 像素宽时，让两列堆叠而不是并排 */
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
