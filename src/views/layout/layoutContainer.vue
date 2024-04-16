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
    <el-header>
      <el-row>
        <el-col :span="8" style="padding-left: 100px">test</el-col>
        <el-col :span="8" style="display: flex; justify-content: center; align-items: center">
          <input class="inputSearch" v-model="input1" placeholder="搜索" />
          <button class="inputIcon">
            <el-icon size="large" class="searchIcon"><Search /></el-icon></button
        ></el-col>
        <el-col :span="8">test</el-col></el-row
      >
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
          <el-menu-item @click="showCard = !showCard" class="card">
            <el-icon><Bell /></el-icon>
            <span>更多</span>
          </el-menu-item>
        </el-menu>
        <el-card v-if="showCard" @mouseleave="showCard = !showCard">
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
      <div style="width: 100%"><router-view></router-view></div>
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
  width: 20%;
  .card {
    position: relative;
    bottom: 0;
  }
  .el-menu {
    float: right;
    border-right: 0;
    padding-right: 20px;
  }
  .el-menu-item {
    min-width: 250px;

    border-radius: 40px;
    margin-bottom: 10px;
    font-size: large;
    font-weight: bold;
  }
  .el-menu-item:hover {
    background: rgb(255, 234, 252);
  }
  .el-menu-item.is-active {
    background-color: #f6f6f6 !important;
  }
}
.inner-header {
  // vertical-align: middle;
  height: 60px;
  background: rgb(255, 255, 255);
}
</style>
