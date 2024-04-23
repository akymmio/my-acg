<script setup>
import { ref } from 'vue'
import { Female, Male } from '@element-plus/icons-vue'
import { getUserInfoByIdService } from '@/api/user'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const route = useRoute()
const user = ref(userStore.user)
//通过用户名查询账号信息
const getUserInfo = async () => {
  //没有用户信息需要通过id查询
  if (route.params.id !== user.value.id) {
    const res = await getUserInfoByIdService(route.params.id)
    user.value = res.data.data
    console.log(user.value)
  }
}
getUserInfo()
</script>

<template>
  <div style="text-align: center">
    <div class="header">
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
            <!-- <el-icon v-else><Male /></el-icon> -->
          </el-descriptions-item>
          <!-- <el-descriptions-item label="昵称">{{ userInfo.nickname }}</el-descriptions-item> -->
          <el-descriptions-item label="简介">{{ user.introduction }}</el-descriptions-item>
          <el-descriptions-item>
            <span style="margin-right: 10px">关注 {{ user.follow }}</span>
            <span>获赞 {{ user.likedCount }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="element">
        <button class="unFollowButton" v-if="user.followed">已关注</button>
        <button class="followButton" v-else>关注</button>
      </div>
      <!-- {{ userInfo.username }} -->
    </div>
    <div>
      <button class="button">笔记</button>
      <button class="button">收藏</button>
      <button class="button">点赞</button>
    </div>
    <div>test</div>
  </div>
</template>

<style scoped lang="less">
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
</style>
