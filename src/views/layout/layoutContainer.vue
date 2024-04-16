<script setup>
import { House, Bell, Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
const showCard = ref(false)
// const input = ref('')
// watch(showCard, () => {
//   showCard.value != showCard.value
// })
</script>

<template>
  <el-container class="layout">
    <el-header class="top-header">
      <input class="inputSearch" v-model="input1" placeholder="搜索" />
      <button class="inputIcon">
        <el-icon size="large" class="searchIcon"><Search /></el-icon>
      </button>
    </el-header>
    <el-container>
      <el-aside class="left-aside">
        <el-menu active-text-color="black" :default-active="$route.path" router>
          <el-menu-item index="/explore">
            <el-icon><House /></el-icon>
            <span>发现</span>
          </el-menu-item>
          <el-menu-item index="/notification">
            <el-icon><Bell /></el-icon>
            <span>通知</span>
          </el-menu-item>
          <el-menu-item index="/publish">
            <el-icon><Bell /></el-icon>
            <span>发布</span>
          </el-menu-item>
          <el-menu-item index="/user/profile">
            <el-icon><Bell /></el-icon>
            <span>我</span>
          </el-menu-item>
          <el-menu-item @click="showCard = !showCard">
            <el-icon><Bell /></el-icon>
            <span>更多</span>
          </el-menu-item>
        </el-menu>
        <el-card style="max-width: 100%" v-if="showCard" @mouseleave="showCard = !showCard">
          <template #header
            ><el-menu>
              <button>
                <el-icon><Bell /></el-icon>退出
              </button>
            </el-menu></template
          >
          <el-menu>
            <button>
              <el-icon><Bell /></el-icon>退出
            </button>
          </el-menu>

          <template #footer>
            <el-menu>
              <button>
                <el-icon><Bell /></el-icon>退出
              </button>
            </el-menu></template
          >
        </el-card>
      </el-aside>
      <div style="width: 100%">
        <router-view></router-view>
      </div>
    </el-container>
  </el-container>
</template>
<style lang="less" scoped>
.layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .el-header {
    height: 100px;
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
.left-aside {
  padding-left: 80px;
  max-width: 50%;
  // el-card {
  //   transition: all 0.5s ease;
  // }
}
.inner-header {
  // vertical-align: middle;
  height: 60px;
  background: rgb(255, 255, 255);
}
.el-menu {
  border-right: 0;
}
.el-menu-item {
  border-radius: 40px;
  margin-bottom: 10px;
  font-size: large;
  font-weight: bold;
}
.el-menu-item.is-active {
  background-color: #f6f6f6 !important;
}
</style>
