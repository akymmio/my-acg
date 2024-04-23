<script setup>
import { Close, ChatRound, ArrowUp } from '@element-plus/icons-vue'
import { requireImg } from '@/utils/requireImg'
import { ref } from 'vue'
import { getUserInfoByIdService } from '@/api/user'
import { getArticleContentService } from '@/api/article'
import { useRoute, useRouter } from 'vue-router'
import { Star } from '@element-plus/icons-vue'
const route = useRoute()
const router = useRouter()
// 创建一个响应式变量 user 来绑定到模板中
//用户
const user = ref({})
//文章
const article = ref({})
//评论
const comments = ref({})
const textarea = ref()
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
        <el-divider style="margin: 0" />
        <div class="content">
          <div class="text">
            <p style="font-size: 25px; font-weight: bold; margin: 10px 0">{{ article.title }}</p>
            <el-text size="large">{{ article.content }}</el-text>
            <div class="time">{{ article.createTime }}</div>
          </div>
        </div>
        <el-divider style="margin: 0" />
        <div class="footer">
          <textarea
            class="input"
            v-model="textarea"
            placeholder="Please input"
            rows="2"
            cols="50"
          ></textarea>
          <!-- <el-input
            class="input"
            v-model="textarea"
            autosize
            type="textarea"
            placeholder="Please input"
          /> -->

          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            title="确认发送评论?"
            hide-icon="true"
          >
            <template #reference>
              <!-- <el-button></el-button> -->
              <el-icon size="large" class="inconPublish"><ArrowUp /></el-icon> </template
          ></el-popconfirm>

          <el-icon size="large" class="icon"><Star />{{ article.liked }}test</el-icon>
          <el-icon size="large" class="icon"><ChatRound />{{ comments.comment }}test</el-icon>
        </div>
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
      width: 50%;
      overflow: hidden;
      .header {
        // height: 10%;

        margin: 20px;
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
        height: 75%;
        padding: 20px;
        padding-top: 0;
        padding-bottom: 0;
        // padding: 0, 20px, 0, 20px;
        display: flex;
        flex-direction: column;

        // background: aqua;
        .text {
          width: 100%;
          height: 100%;
          overflow: auto; /* 允许内容滚动 */
          position: relative; /* 为了定位伪元素 */
        }

        .time {
          font-size: smaller;
          color: rgb(153, 153, 153);
          padding-top: 10px;
        }
      }
      @media (min-height: 800px) {
        .content {
          height: 80%;
        }
      }
      .text::-webkit-scrollbar {
        display: none; /* 隐藏滚动条 */
      }
      .footer {
        width: 100%;
        height: 10vh; /* 使用视窗单位 */
        display: flex;
        align-items: center; /* 垂直居中子元素 */
        // justify-content: center; /* 如果需要，也可以水平居中子元素 */
        .input {
          width: 50%;
          transition:
            width 0.3s ease,
            height 0.3s ease; /* 添加过渡效果到宽度和高度 */
          flex-grow: 1;
          font-size: larger;
          overflow: auto;
          border: 0;
          border-radius: 20px;
          background-color: #f6f6f6;
          padding-left: 10px;
          resize: none;
        }
        .input:focus {
          outline: none;
        }
        .input::-webkit-scrollbar {
          display: none; /* 隐藏滚动条 */
        }

        .icon {
          flex-grow: 1;
          border-radius: 20px;
        }
        // .inconPublish:hover {
        //   background-color: #f6f6f6;
        // }

        // .input:focus {
        //   width: 100%; /* 当输入框获得焦点时，宽度变为100% */
        // }
      }
    }
  }
  @media screen and (max-width: 1000px) {
    .login-container {
      flex-direction: column;
      .left {
        width: 100%;
        overflow: scroll;
        height: 100%;
      }
      .left::-webkit-scrollbar {
        display: none; /* 隐藏滚动条 */
      }
      .right {
        width: 100%;
        padding-right: 10px;
      }
      .close {
        right: 14%;
      }
    }
  }
}
</style>
