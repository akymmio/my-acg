<template>
  <div class="main">
    <button @click="selectChannel(0)">推荐</button>
    <button @click="selectChannel(1)">推荐</button>
    <!-- 首页瀑布流 -->
    <!-- <my-waterfall :cardList="cardList" style="overflow-y: hidden"></my-waterfall> -->
    <Waterfall
      :list="cardList"
      :hasAroundGutter="false"
      style="max-width: 1300px"
      @click="detail"
      @scroll="scroll"
      :align="left"
      :width="240"
      :gutter="20"
    >
      <template #item="{ item }">
        <div>
          <LazyImg :url="item.src" class="lazyImg" @click="showContent(id)" />
          <div class="item-body">
            <div class="item-desc">{{ item.title }}</div>
            <div class="item-footer">
              <div class="footer-left">
                <img :src="item.avatar" alt="" srcset="" />
                <div class="name">{{ item.user }}</div>
              </div>
              <div class="like">
                <div class="like-total">{{ item.vote_num }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Waterfall>
  </div>
  <div class="mask" v-show="show">
    <div class="login-container">
      <div @click="show = false" class="close">
        <el-icon><Close /></el-icon>
      </div>
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
// import myWaterfall from '@/views/waterFall/myWaterfall.vue'
import { requireImg } from '@/utils/requireImg'
// import { getArticleService } from '@/api/article'
import { useRouter, useRoute } from 'vue-router'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import { Close } from '@element-plus/icons-vue'
import 'vue-waterfall-plugin-next/dist/style.css'
const router = useRouter()
const route = useRoute()

const cardList = ref([
  {
    src: requireImg('@/assets/icon/1.jpg'),
    avatar: requireImg('@/assets/icon/1.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/2.jpg'),
    avatar: requireImg('@/assets/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/3.jpg'),
    avatar: requireImg('@/assets/icon/3.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/4.jpg'),
    avatar: requireImg('@/assets/icon/4.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/5.jpg'),
    avatar: requireImg('@/assets/icon/5.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/6.jpg'),
    avatar: requireImg('@/assets/icon/6.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/2.jpg'),
    avatar: requireImg('@/assets/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/1.jpg'),
    avatar: requireImg('@/assets/icon/1.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/4.jpg'),
    avatar: requireImg('@/assets/icon/4.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/1.jpg'),
    avatar: requireImg('@/assets/icon/1.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/6.jpg'),
    avatar: requireImg('@/assets/icon/6.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/5.jpg'),
    avatar: requireImg('@/assets/icon/5.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/2.jpg'),
    avatar: requireImg('@/assets/icon/2.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/3.jpg'),
    avatar: requireImg('@/assets/icon/3.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/4.jpg'),
    avatar: requireImg('@/assets/icon/4.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  },
  {
    src: requireImg('@/assets/icon/1.jpg'),
    avatar: requireImg('@/assets/icon/1.jpg'),
    user: 'Lewis',
    vote_num: 999,
    title: 'Noice cancelling is a secret weapon'
  }

  // ... 其他卡片数据
])
const selectChannel = async (channelId) => {
  router.push({ path: '/explore', query: { channel_id: channelId } })
  const queryWord = route.query.channel_id
  console.log(queryWord)
  // await getArticleService(channelId)
}

const show = ref(false)
const showContent = () => {
  // router.push({ name: '/explore', params: { id: 1 } })
  router.push(`/explore/1`)
  show.value = true
}
</script>
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
  // @media (max-width: 599px) {
  //   .login-container {
  //     // width: 60%;
  //     // height: 80%;
  //   }
  // }

  /* 当窗口宽度在600px到900px之间时应用的样式 */
  // @media (min-width: 600px) and (max-width: 899px) {
  //   .login-container {
  //     width: 60%;
  //     height: 80%;
  //   }
  // }

  // /* 当窗口宽度大于900px时应用的样式 */
  // @media (min-width: 900px) {
  //   .login-container {
  //     width: 60%;
  //     height: 80%;
  //   }
  // }
  .login-container {
    display: flex;
    background-color: #fff;
    border-radius: 20px;
    // position: relative; //?
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
      width: 70%;
      display: flex;
      align-items: center;
      flex-direction: column;
      border-right: 1px solid rgba(0, 0, 0, 0.1);
    }
    .right {
      width: 400px;
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-top: 48px;
    }
  }
}
button {
  border-radius: 40px;
  font-size: large;
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
  font-weight: bold;
}
.lazyImg {
  border-radius: 20px;
}
.item-body {
  margin: 10px;

  .item-desc {
    text-align: left;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #000000;
  }

  .item-footer {
    display: flex;
    justify-content: space-between;

    .footer-left {
      display: flex;
      align-items: center;
      font-family: SF Pro Display;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.6);

      img {
        border-radius: 50%;
        width: 22px;
        height: 22px;
        margin-right: 4px;
      }
    }

    .like {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: SF Pro Display;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.4);

      img {
        margin-right: 4px;
      }
    }
  }
}
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
