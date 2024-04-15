<script lang="ts" setup>
// import dashBoard from '@/components/DashBoard.vue'
// import { useRouter } from 'vue-router'
// const router = useRouter()
// // const route = useRoute()

// import { useUserStore } from './stores'
// const userStore = useUserStore()
// import { ref } from 'vue'
// const show = ref(false)
</script>
<template>
  <router-view></router-view>
  <!-- <button @click="show = true"></button>
  <el-card v-if="show">tesa</el-card> -->
  <!-- <el-dialog v-model="show">
    <el-row>
      <el-col>test </el-col>
      <e-col>tasdfa</e-col>
    </el-row>
  </el-dialog> -->
</template>

<style lang="less">
.container {
  width: 100px;
  .left {
    float: left;
  }

  .right {
    float: right;
  }
}
</style>
