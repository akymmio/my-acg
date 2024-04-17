<script setup>
import { useUserStore } from '@/stores'
// import { onMounted } from 'vue'
const userStore = useUserStore()
//获取用户信息,存入store
userStore.getUser()
const userInfo = userStore.user
</script>

<template>
  <div>{{ userInfo.username }}</div>
  <div>{{ userInfo.password }}</div>
  <img :src="userInfo.userPic" />
</template>
<style lang="less">
// .content {
//   width: 200px;
//   height: 30px;
//   vertical-align: middle;
// }
// .btn {
//   width: 80px;
//   height: 30px;
//   vertical-align: middle;
//   box-sizing: content-box;
// }
</style>
