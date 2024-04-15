<script setup>
import { House, Bell, Search } from '@element-plus/icons-vue'
</script>

<template>
  <el-container class="layout">
    <el-header class="top-header">
      <input class="inputSearch" v-model="input1" placeholder="搜索" :suffix-icon="Search" />
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
        </el-menu>
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
    background: rgb(255, 254, 176);
  }
  .inputSearch {
    margin-top: 20px;
    width: 400px;
    height: 30px;
    border: 0;
    border-radius: 40px;
  }
  .inputSearch:focus {
    outline: none;
  }
}
// .top-header {
//   height: 100px;
//   background: rgb(255, 254, 176);
// }
.left-aside {
  padding-left: 80px;
  max-width: 50%;
  max-width: 40%;
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
