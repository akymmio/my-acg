<script setup>
import { Close } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import { getArticleByIdService, addComment } from '@/api/article'
import { addLikedCount } from '@/api/liked'
import { followService } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import { Like as like, Comment as comment } from '@icon-park/vue-next'
const route = useRoute()
const router = useRouter()
import { useUserStore } from '@/stores'
const userStore = useUserStore()
// 创建一个响应式变量 user 来绑定到模板中
// const localUser = computed(() => userStore.user)
const localUser = ref(userStore.user)
//用户
const user = ref({})
//文章
const article = ref({})
//评论
const comments = ref([])
//评论
const textarea = ref('')

const close = () => {
  //路由返回
  if (props.id) {
    console.log(1)
    emit('toParent', false)
    return
  }
  router.go(-1)
}

//传递父组件
const emit = defineEmits(['toParent'])

//是否关注
const follow = ref(false)
//是否点赞
const liked = ref(false)
//加载数据
const getData = async () => {
  //根据文章id,获取文章信息
  // console.log(route.params.id)
  const res = await getArticleByIdService(props.id || route.params.id)
  article.value = res.data.data
  liked.value = res.data.data.liked
  follow.value = res.data.data.follow
  user.value = res.data.data.userInfo
  comments.value = res.data.data.comments
  console.log(article.value)
}
const props = defineProps({
  id: String
})
getData()

const sendComment = async () => {
  if (!check()) return
  if (textarea.value === '') return
  let commentData = {
    comment: textarea.value,
    userId: localUser.value.id,
    articleId: article.value.articleId
  }
  await addComment(commentData)
  article.value.commentCount += 1
  comments.value.unshift({
    comment: textarea.value,
    nickname: localUser.value.nickname,
    avatar: localUser.value.avatar,
    createTime: new Date().toLocaleString()
  })
  textarea.value = ''
}
//点赞
const toLike = () => {
  if (!check()) return
  addLikedCount(article.value.articleId)
  liked.value = !liked.value
  if (liked.value === true) article.value.likedCount += 1
  else article.value.likedCount -= 1
}
//关注或取关
const toFollow = async () => {
  if (!check()) return
  await followService(user.value.id, !follow.value)
  follow.value = !follow.value
}

//登录检查
const showLoginPage = ref(false)
const check = () => {
  if (Object.keys(localUser.value).length === 0) {
    showLoginPage.value = true
    return false
  } else return true
}
import loginPage from '../login/loginPage.vue'
const toChild = (param) => {
  showLoginPage.value = param
}
import { deleteCommentService } from '@/api/comment'
const deleteComment = (commentId, index) => {
  console.log(commentId)
  comments.value.splice(index, 1)
  deleteCommentService(commentId)
}

const lights = ref([
  {
    type: 'AmbientLight',
    color: 'white',
    intensity: 2
  },
  {
    type: 'PointLight',
    color: 'white',
    position: { x: 0, y: 0, z: 0 },
    intensity: 0.3
  }
])
const rotation = ref()
rotation.value = {
  x: 0,
  y: 0,
  z: 0
}
function onLoad() {
  rotate()
}
function rotate() {
  requestAnimationFrame(rotate)
  rotation.value.y -= 0.005
}
const controlRotate = () => {
  requestAnimationFrame(rotate)
  rotation.value.y += 0.005
}
</script>
<template>
  <loginPage v-if="showLoginPage" @toParent="toChild" style="z-index: 2"></loginPage>
  <div class="mask">
    <div class="container">
      <div @click="close" class="close">
        <el-icon><Close /></el-icon>
      </div>
      <!-- <div>
        <vue3dLoader
          v-if="article.modelPath"
          class="modelCss"
          :filePath="article.modelPath"
          :lights="lights"
          :height="650"
          :width="500"
        />
      </div> -->
      <div class="left">
        <div class="media-container">
          <!-- <el-carousel v-if="article.modelPath" height="30vh" interval="3600" trigger="hover">
            <el-carousel-item v-for="(image, index) in article.images" :key="index">
              <el-image
                :preview-src-list="article.images"
                z-index="index"
                :src="image"
                fit="contain"
                class="carousel"
              />
            </el-carousel-item>
          </el-carousel> -->
          <el-carousel v-if="!article.modelPath" height="95vh" interval="3600" trigger="hover">
            <el-carousel-item v-for="(image, index) in article.images" :key="index">
              <el-image
                :preview-src-list="article.images"
                z-index="index"
                :src="image"
                fit="contain"
                class="carousel"
              />
            </el-carousel-item>
          </el-carousel>
        </div>

        <div>
          <!-- <vue3dLoader
            v-if="article.modelPath"
            :filePath="article.modelPath"
            :lights="lights"
            :height="600"
            :width="500"
            :backgroundAlpha="0"
            class="modelCss"
            :pointLightFollowCamera="true"
          /> -->
          <vue3dLoader
            v-if="article.modelPath"
            :filePath="article.modelPath"
            :lights="lights"
            :height="850"
            :width="500"
            :backgroundAlpha="0"
            :rotation="rotation"
            @load="onLoad()"
            class="modelCss"
            :pointLightFollowCamera="true"
          />
        </div>
        <button class="" @click="controlRotate">test</button>
      </div>

      <div class="right">
        <div class="header">
          <div class="avatar">
            <el-avatar :size="40" :src="user.avatar" />
            <span class="username">{{ user.nickname }}</span>
          </div>
          <div v-if="user.id === localUser.id" class="editButton">
            <span @click="router.push({ path: '/publish', query: { id: article.articleId } })">
              编辑
            </span>
          </div>
          <div
            v-else-if="user.id !== localUser.id"
            @click="toFollow()"
            :class="{ active: follow }"
            class="followButton"
          >
            <span v-show="follow">已关注</span> <span v-show="!follow">关注</span>
          </div>
        </div>
        <el-divider style="margin: 0" />
        <div class="content">
          <div class="text">
            <p style="font-size: 20px; font-weight: bold; margin: 10px 0">{{ article.title }}</p>
            <!-- <el-text size="large" v-html></el-text> -->
            <div v-html="article.content" class="text_font"></div>
            <!-- <div class="time" style="padding-top: 0">{{ article.createTime }}</div> -->
            <div class="text_bottom">
              <div>{{ article.createTime }}</div>
              <div>共{{ article.commentCount }}条评论</div>
            </div>
            <el-divider style="margin: 0" />
            <el-empty v-if="article.commentCount == 0" description="空空如也" />
            <!-- 评论 -->
            <div
              v-else
              v-for="(comment, index) in article.comments"
              :key="index"
              class="commentStyle"
            >
              <div><el-avatar :size="38" :src="comment.avatar" /></div>
              <div class="comment_container">
                <div class="comment_name">{{ comment.nickname }}</div>
                <div class="comment_content" v-html="comment.comment"></div>
                <div class="time" style="">{{ comment.createTime }}</div>
              </div>
              <div
                class="comment-actions"
                v-if="localUser.id === comment.userId"
                @click="deleteComment(comment.commentId, index)"
              >
                <el-icon><Close style="opacity: 0.3" /></el-icon>
              </div>
            </div>
          </div>
        </div>
        <el-divider style="margin: 0" />
        <div class="footer">
          <div class="footer_icon">
            <like
              theme="two-tone"
              size="20"
              :fill="['#ff4242', '#ff4242']"
              @click="toLike"
              v-if="liked"
            />
            <like theme="outline" size="20" fill="#333" @click="toLike" v-else />

            <span style="padding-left: 5px">{{ article.likedCount }} </span>
            <!-- <el-icon class="icon" size="large"><ChatRound /></el-icon> -->
            <comment theme="filled" size="20" fill="#4f83ff" style="padding-left: 10px" />
            <span style="padding-left: 5px">{{ article.commentCount }}</span>
          </div>
          <div class="footer_input">
            <textarea
              class="input"
              v-model="textarea"
              placeholder="留下你的想法吧"
              rows="2"
              cols="50"
            ></textarea>
            <span class="iconPublish" @click="sendComment">发送</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
// .carousel {
//   background: white !important;
// }
.media-container {
  width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 20px 0 0 20px;
  object-fit: contain;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  // display: flex;
  // justify-content: center; /* 水平居中 */
}

.mask {
  // z-index: 9999; /* 高的 z-index 值 */
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

  .container {
    display: flex;
    background-color: #fff;
    border-radius: 20px;
    box-sizing: border-box;
    width: 60%;
    height: 95%;

    .close {
      position: absolute;
      top: 3%;
      right: 3%;
      width: 40px;
      height: 40px;
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
      .modelCss {
        // border-radius: 10px;
        // margin-left: 10px;
        // margin-top: 10px;
        // border: 2px solid rgba(0, 0, 0, 0.1);
      }
      .imageList {
        height: 90vh;
      }
      .carousel {
        width: 100%;
        height: 100%;
        background: white;
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
        margin: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .username {
          color: #494949;
          padding-left: 10px;
        }
        .avatar {
          display: flex; /* 使得avatar和文本可以在同一行上 */
          align-items: center; /* 垂直居中文本和avatar */
        }
        .editButton {
          display: flex; /* 使得关注文本可以垂直居中 */
          align-items: center; /* 垂直居中关注文本 */
          justify-content: center; /* 水平居中关注文本 */
          color: rgba(0, 0, 0, 0.7);
          border: 0;
          border-radius: 40px;
          font-size: large;
          font-weight: bold;
          background-color: #f6f6f6;
          width: 80px;
          height: 40px;
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
        .followButton.active {
          background-color: #f6f6f6;
          border: 2px, solid;
          color: rgba(0, 0, 0, 0.7);
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
          // position: relative; /* 为了定位伪元素 */
          .text_font {
            font-size: 15px;
            color: #494949;
          }
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
            // flex-direction: row;
            align-items: flex-start; /* 如果有需要的话，对齐项目 */
            padding-top: 15px;
            .comment_container {
              flex: 1; /* 占据剩余空间，使得 Close 图标可以靠右 */
              padding-left: 10px; /* 根据需要设置内边距 */
              // background-color: aqua;
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
              .comment-actions {
                margin-left: auto; /* 这将使元素靠右 */
              }
            }
          }
        }
        .comment-actions:hover {
          background-color: #e1e1e1;
          // border-radius: 50%;
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
        // bottom: 10px;
        position: relative;
        width: 100%;
        margin-top: 5px;
        display: flex;
        flex-direction: column;
        .footer_icon {
          display: flex;
          align-items: center;
          font-size: small;
          padding-left: 10px;
        }
        .footer_icon > div {
          padding-right: 5px;
        }
        .footer_input {
          padding-left: 10px;
          padding-top: 5px;
          display: flex;
          align-items: center;
          // justify-content: center;
          .iconPublish {
            // width: 100px;
            cursor: pointer;
            border: 0;
            // border-radius: 20px;
            border-radius: 0 20px 20px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            // padding-left: 10px;
            // background-color: #fd6b6b;
            // width: 10%;
            // height: 50px;
            // padding-left: 10px;
            // background-color: #98c7fd;
            background-color: rgb(255, 48, 89);
            height: 45px;
            width: 10%;
            color: white;
          }
          .input {
            width: 85%;
            font-size: larger;
            overflow: auto;
            border: 0;
            // border-radius: 10px;
            border-radius: 20px 0 0 20px;
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
          .button {
            cursor: pointer;
            border-radius: 40px;
            font-size: large;
            // background-color: rgb(95, 194, 255);
            border: 0;
            // width: 80px;
            // height: 40px;
            margin-bottom: 15px;
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
  @media screen and (max-width: 1500px) {
    .container {
      width: 70%;
      // background-color: aqua;
    }
  }

  @media screen and (max-width: 1000px) {
    .container {
      width: 100%; /* 变为全屏宽度 */
      height: 100%; /* 使用视口高度，如果你想让容器占据整个视口高度 */
      overflow-y: auto; /* 允许垂直滚动 */
      flex-direction: column; /* 变为垂直排列 */
      // border-radius: 0;
      .left {
        height: 40%;
        width: 100%;

        .media-container {
          overflow: scroll;
        }
        .media-container::-webkit-scrollbar {
          display: none;
        }
      }
      .close {
        z-index: 2;
        // background: rgb(0, 0, 0);
        top: 10px;
        left: 0;
      }

      .right {
        width: 100%;
        .header {
          position: fixed;
          // top: 0;
          top: 0; /* 固定在顶部 */
          left: 0; /* 可选，如果需要固定在左侧 */
          margin: 0;
          padding: 10px 0 10px 10px;
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
          // height: 10%;
          background-color: white;
        }

        // padding-right: 10px;
        .content {
          // height: 75%;
          // height: calc(100vh - 55vh);
        }
        .footer {
          height: 40%;
        }
      }
    }
    .container::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
