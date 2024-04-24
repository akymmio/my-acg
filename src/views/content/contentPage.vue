<script setup>
import { Close, ChatRound, ArrowUp, Star } from '@element-plus/icons-vue'
import { requireImg } from '@/utils/requireImg'
import { ref } from 'vue'
import { getArticleByIdService, addComment } from '@/api/article'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
import { useUserStore } from '@/stores'
const userStore = useUserStore()
// 创建一个响应式变量 user 来绑定到模板中
const localUser = ref(userStore.user)
// 创建一个响应式变量 user 来绑定到模板中
//用户
const user = ref({})
//文章
const article = ref({})
//评论
const comments = ref([])
//评论
const textarea = ref()
const close = () => {
  //路由返回
  router.go(-1)
}
//加载数据
const getData = async () => {
  //根据文章id,获取文章信息
  const res = await getArticleByIdService(route.params.id)
  article.value = res.data.data
  user.value = res.data.data.userInfo
  comments.value = res.data.data.comments
  console.log(article.value)
}
getData()
const sendComment = async () => {
  let commentData = {
    comment: textarea.value,
    userId: localUser.value.id,
    articleId: article.value.id
  }
  await addComment(commentData)
  textarea.value = ''
  comments.value.push({
    comment: commentData.comment,
    nickname: localUser.value.nickname,
    avatar: localUser.value.avatar,
    createTime: new Date().toLocaleString()
  })
}
</script>
<template>
  <div class="mask" v-show="true">
    <div class="login-container">
      <div @click="close" class="close">
        <el-icon><Close /></el-icon>
      </div>
      <div class="left">
        <div class="media-container">
          <el-carousel height="90vh" interval="3600" trigger="hover">
            <el-carousel-item v-for="(image, index) in article.images" :key="index">
              <el-image style="width: 100%; height: 100%" :src="image" fit="cover" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="right">
        <div class="header">
          <div class="avatar">
            <el-avatar :size="40" :src="user.avatar" />
            <span class="username">{{ user.nickname }}</span>
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
            <!-- <el-text size="large" v-html></el-text> -->
            <p v-html="article.content"></p>
            <!-- <div class="time" style="padding-top: 0">{{ article.createTime }}</div> -->
            <div class="text_bottom">
              <div>{{ article.createTime }}</div>
              <div>共{{ article.commentCount }}条评论</div>
            </div>
            <el-divider style="margin: 0" />
            <div v-for="(comment, index) in article.comments" :key="index" class="commentStyle">
              <div><el-avatar :size="38" :src="comment.avatar" /></div>
              <div class="comment_container">
                <div class="comment_name">{{ comment.nickname }}</div>
                <div class="comment_content">{{ comment.comment }}</div>
                <div class="time" style="">{{ comment.createTime }}</div>
              </div>
            </div>
          </div>
        </div>
        <el-divider style="margin: 0" />
        <div class="footer">
          <div class="footer_icon">
            <el-icon class="icon" size="large"><Star /></el-icon>{{ article.likedCount }}
            <el-icon class="icon" size="large"><ChatRound /></el-icon>{{ article.commentCount }}
          </div>
          <div class="footer_input">
            <textarea
              class="input"
              v-model="textarea"
              placeholder="说点什么..."
              rows="2"
              cols="50"
            ></textarea>

            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              title="确认发送评论?"
              hide-icon="true"
              @confirm="sendComment"
            >
              <template #reference>
                <el-icon size="large" class="iconPublish"><ArrowUp /></el-icon> </template
            ></el-popconfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.media-container {
  width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 20px 0 0 20px;
  object-fit: contain;
}
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
      // .left img {
      //   width: 100%;
      //   height: 100%;
      //   object-fit: cover;
      // }
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
      width: 40%;
      overflow: hidden;
      .header {
        // height: 10%;
        margin: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .username {
          color: rgba(0, 0, 0, 0.5);
          padding-left: 10px;
        }
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
        height: 70%;
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
          .text_bottom {
            display: flex;
            justify-content: space-between;
            font-size: small;
            color: rgb(153, 153, 153);
            padding-top: 10px;
            padding-bottom: 10px;
          }
          .commentStyle {
            display: flex;
            flex-direction: row;
            padding-top: 15px;
            .comment_container {
              display: flex;
              flex-direction: column;
              padding-left: 10px;
              .comment_name {
                color: rgba(0, 0, 0, 0.6);
                // padding-left: 10px;
                font-size: small;
              }
              .comment_content {
                // padding: 10px;
                padding-top: 5px;
                font-size: small;
              }
            }
          }
        }
        .time {
          font-size: x-small;
          color: rgb(153, 153, 153);
          padding-top: 5px;
          padding-bottom: 10px;
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
        // height: 15vh; /* 使用视窗单位 */
        // height: 20%;
        padding-top: 5px;
        display: flex;
        flex-direction: column;
        // align-items: center; /* 垂直居中子元素 */
        // justify-content: center; /* 如果需要，也可以水平居中子元素 */
        .footer_icon {
          display: flex;
          align-items: center;
        }
        .footer_icon > div {
          padding-right: 5px;
        }
        .footer_input {
          padding-top: 5px;
          display: flex;
          align-items: center;
          .iconPublish {
            // vertical-align: middle;
            // box-sizing: content-box;
            // background: aqua;
            height: 42px;
            width: 41px;
          }
          .input {
            width: 85%;
            font-size: larger;
            overflow: auto;
            border: 0;
            border-radius: 20px;
            background-color: #f6f6f6;
            padding-top: 10px;
            padding-left: 10px;
            resize: none;
          }
          .input:focus {
            outline: none;
          }
          .input::-webkit-scrollbar {
            display: none; /* 隐藏滚动条 */
          }
        }

        .icon {
          // flex-grow: 0.5;
          // border-radius: 20px;
          font-size: small;
          padding-left: 10px;
        }
      }
    }
  }
  @media screen and (min-width: 1000px) {
    .login-container {
      .right {
        width: 50%;
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
