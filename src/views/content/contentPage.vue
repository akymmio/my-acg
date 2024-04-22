<script setup>
// import { ref } from 'vue'
import { Close } from '@element-plus/icons-vue'

import { requireImg } from '@/utils/requireImg'
import { useUserStore } from '@/stores'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const route = useRouter()
const userStore = useUserStore()
// 创建一个响应式变量 user 来绑定到模板中
const user = ref(userStore.user)
const emit = defineEmits(['toParent'])
const close = () => {
  route.go(-1)

  // emit('toParent', false)
}
setTimeout(() => {
  console.log(route.params)
}, 2000)
// onMounted(() => {
//   console.log(route.params.id)
// })

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
        <div class="title">
          <div class="avatar">
            <el-avatar :size="40" :src="user.avatar" />
            <span style="padding-left: 5px">{{ user.nickname }}</span>
          </div>
          <div class="followButton">
            <span>关注</span>
          </div>
        </div>
        <div><h1>asdf</h1></div>
        <div>test</div>
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
      .title {
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
          height: 35px;
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
