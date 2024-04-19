<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/index'
import { Female, Male } from '@element-plus/icons-vue'
const userStore = useUserStore()
const userInfo = userStore.user
</script>

<template>
  <div style="text-align: center">
    <div class="header">
      <div class="element">
        <el-avatar :size="180" :src="userInfo.userPic" :fit="cover" />
      </div>
      <div class="element">
        <el-descriptions
          class="margin-top"
          :title="userInfo.nickname"
          :column="1"
          :style="blockMargin"
        >
          <el-descriptions-item label="账号">{{ userInfo.username }}</el-descriptions-item>
          <el-descriptions-item>
            <e-slot v-if="userInfo.sex === '0'">
              <el-icon><Female /></el-icon>
            </e-slot>
            <e-slot v-else>
              <el-icon><Male /></el-icon>
            </e-slot>

            <!-- 当 sex 为 1 时显示 Male 图标 -->
            <!-- <el-icon v-else><Male /></el-icon> -->
          </el-descriptions-item>
          <!-- <el-descriptions-item label="昵称">{{ userInfo.nickname }}</el-descriptions-item> -->
          <el-descriptions-item label="简介">{{ userInfo.introduction }}</el-descriptions-item>
          <el-descriptions-item>
            <span style="margin-right: 10px">关注{{ userInfo.follow }}</span>
            <span>获赞{{ userInfo.liked }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- {{ userInfo.username }} -->
    </div>
    <div>
      <button class="button">笔记</button>
      <button>收藏</button>
      <button>点赞</button>
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
button {
  border-radius: 40px;
  font-size: 18px;
  background-color: white;
  border: 0;
  width: 80px;
  height: 40px;
  margin-bottom: 15px;
}
button:hover {
  background-color: #f6f6f6;
}
button:focus {
  background-color: #f6f6f6;
  // font-weight: bold;
  font-size: 19px;
}
</style>
