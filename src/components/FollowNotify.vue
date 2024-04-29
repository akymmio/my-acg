<script setup>
import { ref } from 'vue'
import { getFollowMeService } from '@/api/follow'
const LikedList = ref([])
const showComment = async () => {
  const res = await getFollowMeService()
  LikedList.value = res.data.data
  console.log(res.data.data)
}
showComment()
</script>
<template>
  <div class="content">
    <div class="commentStyle" v-for="(t, index) in LikedList" :key="index">
      <div><el-avatar :size="50" :src="t.avatar" /></div>
      <div class="comment_container">
        <div class="comment_name">{{ t.nickname }}</div>
        <div class="comment_font">
          <span>关注着你</span>
          <span style="padding-left: 10px">{{ t.createTime }}</span>
        </div>
      </div>
    </div>
    <div class="finishLoading"><span>没有更多...</span></div>
  </div>
</template>
<style lang="less" scoped>
.content {
  width: 60%;
  height: calc(100vh - 200px);
  overflow: scroll;
  .commentStyle {
    display: flex;
    justify-content: row;
    padding: 20px 0;
  }
  .comment_container {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    .comment_name {
      font-size: small;
      font-weight: bold;
      flex: 0 0 auto; /* 不增长、不缩小、基础大小为auto */
      padding-bottom: 5px;
    }
    .comment_font {
      color: rgba(0, 0, 0, 0.5);
      font-size: small;
    }
  }
}
.content::-webkit-scrollbar {
  display: none;
}
.finishLoading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: #b7b7b7;
}
</style>
