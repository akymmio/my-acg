<script setup>
import { ref, computed } from 'vue'
import Comment from '@/components/CommentNotify.vue'
import Like from '@/components/LikeNotify.vue'
import Follow from '@/components/FollowNotify.vue'
import Tt from '@/components/TestPage.vue'
// 响应式数据，用于跟踪当前激活的标签
const currentTab = ref('Comment')

// 组件映射
const components = {
  Comment,
  Like,
  Follow,
  Tt
}
const currentComponent = computed(() => {
  return components[currentTab.value]
})
</script>

<template>
  <div class="title">
    <div>
      <button
        class="button"
        @click="currentTab = 'Comment'"
        :class="{ active: currentTab === 'Comment' }"
      >
        评论
      </button>
      <button class="button" @click="currentTab = 'Like'">赞和收藏</button>
      <button class="button" @click="currentTab = 'Follow'">新增关注</button>
      <!-- <button class="button" @click="currentTab = 'Tt'">test</button> -->
      <!-- <button class="button">评论</button>
      <button class="button">赞和收藏</button>
      <button class="button">新增关注</button> -->
    </div>
    <el-divider style="margin: 5px; width: 70%" />
    <!-- <div v-for="(comment, index) in article.comments" :key="index" class="commentStyle"> -->
    <transition name="slide-fade">
      <component :is="currentComponent" v-if="currentComponent"></component>
    </transition>
  </div>
</template>

<style scoped lang="less">
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
// .slide-fade-leave-active {
//   transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
// }
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}

.title {
  // display: flex;
  // justify-content: center;
  padding-left: 20%;
}

// .finishLoading {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-bottom: 20px;
//   color: #b7b7b7;
// }
// .content {
//   width: 60%;
//   height: calc(100vh - 200px);
//   overflow: scroll;
//   // background-color: bisque;
//   .commentStyle {
//     display: flex;
//     justify-content: row;
//     padding: 20px 0;
//   }
//   .comment_container {
//     display: flex;
//     flex-direction: column;
//     padding-left: 10px;
//     .comment_name {
//       // padding-left: 10px;
//       font-size: small;
//       font-weight: bold;
//       flex: 0 0 auto; /* 不增长、不缩小、基础大小为auto */
//     }
//     .comment_content {
//       // padding: 10px;
//       padding-top: 5px;

//       flex: 0 0 auto; /* 不增长、不缩小、基础大小为auto */
//       color: rgba(0, 0, 0, 0.7);
//     }
//     .comment_font {
//       color: rgba(0, 0, 0, 0.5);
//       // padding-left: 10px;
//       font-size: small;
//     }
//   }
// }
// .content::-webkit-scrollbar {
//   display: none;
// }
// .loading {
//   width: 70px;
//   display: flex;
//   justify-content: center; /* 水平居中 */
// }
.button {
  border-radius: 40px;
  font-size: 16px;
  background-color: white;
  border: 0;
  width: 100px;
  height: 40px;
  margin-bottom: 15px;
  color: #3d3d3d;
}
.button:hover {
  color: #000000;
}
.button:focus {
  background-color: #f6f6f6;
  // font-weight: bold;
}
.active {
  background-color: #f6f6f6;
}
</style>
