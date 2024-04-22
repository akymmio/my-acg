<script setup>
import { Close } from '@element-plus/icons-vue'
import { requireImg } from '@/utils/requireImg'
import { ref } from 'vue'
import { getUserInfoByIdService } from '@/api/user'
import { getArticleContentService } from '@/api/article'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
// 创建一个响应式变量 user 来绑定到模板中
const user = ref({})
const article = ref({})
const close = () => {
  //路由返回
  router.go(-1)
}
//加载数据
const getUserInfo = async () => {
  //根据文章id,获取文章信息
  const res = await getArticleContentService(route.params.id)
  article.value = res.data.data
  //获取用户信息
  const res1 = await getUserInfoByIdService(article.value.userId)
  user.value = res1.data.data
  console.log(res1)
  console.log(res)
}
getUserInfo()

const url = requireImg('@/assets/icon/2.jpg')
const srcList = [requireImg('@/assets/icon/2.jpg')]
</script>
<template>
  <div class="mask" v-show="true">
    <div class="login-container">
      <div @click="close" class="close">
        <el-icon><Close /></el-icon>
      </div>
      <div class="left">
        <el-image
          :preview-src-list="srcList"
          style="width: 100%; height: 100%; border-radius: 20px 0 0 20px"
          :src="url"
        />
      </div>
      <div class="right">
        <div class="header">
          <div class="avatar">
            <el-avatar :size="40" :src="user.avatar" />
            <span style="padding-left: 5px">{{ user.nickname }}</span>
          </div>
          <div class="followButton">
            <span v-if="false">关注</span>
            <span v-else>取关</span>
          </div>
        </div>

        <div class="content">
          <h1>{{ article.title }}</h1>
          <el-text class="text" size="large">{{ article.content }}</el-text>
          <span class="time">{{ article.createTime }}</span>
        </div>
        <div class="footer"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.mask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  overflow-y: hidden;

  .login-container {
    display: flex;
    background-color: #fff;
    border-radius: 20px;
    box-sizing: border-box;
    /* 当窗口宽度小于600px时应用的样式 */
    width: 60%;
    height: 90%;
    .close {
      position: absolute;
      top: 5%;
      right: 17%;
      width: 30px;
      height: 30px;
      background: rgb(255, 255, 255);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close:hover {
      background-color: #f9f7f7;
      border-radius: 50%;
      // background-color: #f6f6f6;
    }
    .left {
      width: 60%;
      display: flex;
      align-items: center;
      flex-direction: column;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      .left img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .carousel {
        width: 100%;
        height: 100%;
        background: aqua;
      }
      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
      }

      .el-carousel__item:nth-child(2n + 1) {
        background-color: #d3dce6;
      }
    }
    .right {
      padding: 20px;
      width: 50%;
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .avatar {
          display: flex; /* 使得avatar和文本可以在同一行上 */
          align-items: center; /* 垂直居中文本和avatar */
        }
        .followButton {
          display: flex; /* 使得关注文本可以垂直居中 */
          align-items: center; /* 垂直居中关注文本 */
          justify-content: center; /* 水平居中关注文本 */
          color: rgb(255, 255, 255);
          border: 0;
          border-radius: 40px;
          font-size: large;
          font-weight: bold;
          background: rgb(255, 48, 89);
          width: 80px;
          height: 40px;
        }
      }
      .content {
        display: flex;
        flex-direction: column;
        .text {
          width: 100%;
        }
        .time {
          font-size: smaller;
          color: rgb(153, 153, 153);
          padding-top: 10px;
        }
      }
    }
  }
  @media screen and (max-width: 1000px) {
    .login-container {
      flex-direction: column;
      .left {
        width: 100%;
        border-radius: 0;
      }
      .right {
        width: 100%;
        padding-right: 10px;
      }
    }
  }
}
</style>
