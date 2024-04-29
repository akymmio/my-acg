<script setup>
import { getLikedNotification } from '@/api/liked'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
//本地用户信息
const user = ref(userStore.user)
const LikedList = ref([])
const showComment = async () => {
  if (LikedList.value.length === 0) {
    const res = await getLikedNotification(user.value.id)
    LikedList.value = res.data.data
    console.log(res.data.data)
  }
}
showComment()
</script>
<template>
  <div class="content">
    <div>
      <div class="commentStyle" v-for="(item, index) in LikedList" :key="index">
        <div><el-avatar :size="50" :src="item.avatar" /></div>
        <div class="comment_container">
          <div class="comment_name">{{ item.nickname }}</div>
          <div class="comment_font">
            <span>点赞了你的文章</span>
            <span style="padding-left: 10px">{{ item.createTime }}</span>
          </div>
          <div class="comment_content">
            <el-divider direction="vertical" />
            <span>{{ item.comment }}</span>
          </div>
        </div>
        <div style="margin-left: auto" @click="showArticle(item.articleId)">
          <el-avatar :size="50" shape="square" :src="item.cover" />
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
      padding-bottom: 10px;
    }
    .comment_content {
      padding-top: 5px;

      flex: 0 0 auto; /* 不增长、不缩小、基础大小为auto */
      color: rgba(0, 0, 0, 0.7);
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
