<script setup>
import { inject, ref, watch } from 'vue'
import { Waterfall } from 'vue-waterfall-plugin-next'

import 'vue-waterfall-plugin-next/dist/style.css'
import { getUserInfoByIdService } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { Like as like } from '@icon-park/vue-next'
// import '@icon-park/vue/styles/index.css'
import { Delete } from '@icon-park/vue-next'
import { getFollowService } from '@/api/follow'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
//本地用户信息
const localUser = ref(userStore.user)
const user = ref({})

import { getArticleByUserIdService, getModelArticleByUserIdService } from '@/api/article'
import { getArticleLikedService } from '@/api/liked'
const notes = ref([])
const getUserInfo = async () => {
  //没有用户信息需要通过id查询
  if (route.params.id !== localUser.value.id) {
    // console.log('route_id', route.params.id)
    const res = await getUserInfoByIdService(route.params.id)
    user.value = res.data.data
  } else {
    user.value = localUser.value
  }
}
getUserInfo()

const props = defineProps({
  param: String
})

const fetchData = async () => {
  let res
  const c = props.param || 'note'
  if (c === undefined || c === 'note') {
    console.log(user.value.id)
    console.log(route.params.id)
    res = await getArticleByUserIdService(route.params.id)
  } else if (c == 'like') {
    console.log(user.value.id)
    res = await getArticleLikedService(route.params.id)
  } else if (c == 'follow') {
    console.log(user.value.id)
    res = await getFollowService(route.params.id)
  } else if (c == 'model') {
    console.log(user.value.id)
    res = await getModelArticleByUserIdService(route.params.id)
  }
  notes.value = res.data.data
  console.log(res.data.data)
  // console.log(notes.value[0].id)
}
fetchData()

watch(
  () => props.param,
  (newValue) => {
    console.log('Parent data changed:', newValue)
    fetchData()
  }
)
//通过用户名查询账号信息

watch(
  () => route.params.id,
  (newId, oldId) => {
    if (newId !== oldId) {
      getUserInfo() // 当 userId 变化时，重新获取数据
      fetchData() // 当 userId 变化时，重新获取数据
    }
  },
  { immediate: true } // 立即执行一次，以获取初始数据
)

const showUser = ref(true)
const isFixed = ref(false)

import { Male as male, Female as female } from '@icon-park/vue-next'
// const showContent = (param) => {
//   router.push(`/explore/${param}`)
// }

const isModalVisible = ref(false)
const toChild = (param) => {
  isModalVisible.value = param
}
//查看文章详情
const id = ref()
const showContent = (param) => {
  isModalVisible.value = !isModalVisible.value
  id.value = param
  // router.push(`/explore/${param}`)
}
import ContentPage from '@/views/content/contentPage.vue'

import { addLikedCount } from '@/api/liked'
const toLike = (id, index) => {
  if (Object.keys(user.value).length === 0) {
    return
  }
  // console.log(id, index)
  addLikedCount(id)
  console.log(notes.value[index])
  if (notes.value[index].liked === false) {
    notes.value[index].likedCount += 1
    notes.value[index].liked = true
  } else {
    notes.value[index].likedCount -= 1
    notes.value[index].liked = false
  }
}
import { deleteArticleService } from '@/api/article'
const deleteArticle = (articleId, index) => {
  console.log(index)
  notes.value.splice(index, 1)
  deleteArticleService(articleId)
}
import { followService } from '@/api/follow'
const toFollow = async (follow_user_id, index) => {
  notes.value.splice(index, 1)
  await followService(follow_user_id, false)
}
const lights = ref()

lights.value = [
  {
    type: 'AmbientLight',
    color: 'white',
    intensity: 2
  },
  {
    type: 'PointLight',
    color: 'white',
    intensity: 2
  }
]
</script>

<template>
  <el-empty v-if="!notes" description="空空如也" />
  <Waterfall
    :list="notes"
    :hasAroundGutter="false"
    :align="center"
    :width="276"
    :gutter="20"
    :breakpoints="{
      1400: { rowPerView: 5 },
      1200: { rowPerView: 4 },
      800: { rowPerView: 3 },
      600: { rowPerView: 2 }
    }"
  >
    <!-- 底部 -->
    <template #default="{ item, index }">
      <div v-if="props.param === 'follow'">
        <div class="focus-body">
          <div class="focus-footer">
            <div class="footer-left">
              <img :src="item.avatar" alt="" srcset="" @click="push(item.userId)" />
              <div>{{ item.nickname }}</div>
            </div>
            <div @click="toFollow(item.id, index)" class="followButton">
              <span>取关</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else @click="showContent(item.articleId)">
        <vue3dLoader
          v-if="props.param === 'model'"
          class="model"
          :filePath="item.modelPath"
          :lights="lights"
          :height="300"
          :width="250"
          :controlsOptions="{
            enablePan: true,
            enableZoom: false,
            enableRotate: true
          }"
          :backgroundAlpha="0"
          :cameraPosition="{ x: 0, y: 0, z: 0 }"
        />
        <el-image v-else :src="item.cover" class="img" />
        <div class="item-body">
          <div class="item-desc">
            <span>{{ item.title }}</span>
          </div>
          <div class="item-footer">
            <div class="footer-left">
              <img :src="item.avatar" alt="" srcset="" @click="push(item.userId)" />
              <div class="name">{{ item.nickname }}</div>
            </div>
            <div class="like">
              <like
                v-if="item.liked"
                theme="two-tone"
                size="20"
                :fill="['#ff4242', '#ff4242']"
                @click="toLike(item.articleId, index)"
              />
              <like
                v-else
                theme="outline"
                size="20"
                fill="#333"
                @click="toLike(item.articleId, index)"
              />
              <div style="padding-left: 2px">{{ item.likedCount }}</div>

              <div style="padding-left: 5px">
                <el-popconfirm
                  confirm-button-text="是"
                  cancel-button-text="否"
                  title="删除笔记"
                  @confirm="deleteArticle(item.articleId, index)"
                >
                  <template #reference>
                    <delete theme="filled" size="16" fill="#ff6262" />
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="focus-container">
        <div class="focus">
          <img :src="item.avatar" alt="" srcset="" @click="push(item.userId)" />
          <div class="name">{{ item.nickname }}</div>
        </div>
        <div>test</div>
      </div> -->
    </template>
  </Waterfall>
  <ContentPage v-if="isModalVisible" :id="id" @toParent="toChild" style="z-index: 10" />
  <!-- <div class="finishLoading"><span>没有更多...</span></div> -->
</template>

<style scoped lang="less">
.focus-body {
  padding: 10px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 100px;
  // .focus-desc {
  //   text-align: left;
  //   font-family: Roboto;
  //   font-style: normal;
  //   font-weight: normal;
  //   font-size: 14px;
  //   line-height: 16px;
  //   color: #000000;
  // }

  .focus-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    // padding-top: 10px;

    .footer-left {
      display: flex;
      align-items: center;
      font-family: SF Pro Display;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.6);

      img {
        border-radius: 50%;
        width: 35px;
        height: 35px;
        margin-right: 4px;
      }
    }



  }
}

.finishLoading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: #b7b7b7;
}



.button {
  border-radius: 40px;
  font-size: 18px;
  background-color: white;
  border: 0;
  width: 80px;
  height: 40px;
  margin-bottom: 15px;
}
.button:hover {
  background-color: #f6f6f6;
}
.button:focus {
  background-color: #f6f6f6;
  // font-weight: bold;

}
.followButton {

  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(255, 255, 255);
  border: 0;
  border-radius: 40px;
  font-size: large;
  font-weight: bold;
  background: rgb(255, 48, 89);
  width: 80px;
  height: 40px;
  // height: 40px;
  // margin-left: 150px
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.followButton:hover{
  background: rgb(198, 39, 71);
}
.unFollowButton {
  border:solid 1px;
  border-radius: 40px;
  font-size: large;
  font-weight: bold;
  background: rgb(255, 255, 255);
  width: 80px;
  height: 40px;
  margin-left: 150px
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.unFollowButton:hover{
  background: #f6f6f6;
}


.img {
  border-radius: 20px;
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  // height: auto;
  // transition: filter 0.5s ease-in-out; /* 添加过渡效果 */
}
.img:hover {
  filter: brightness(0.8);
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
    padding-top: 10px;

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
      // font-style: normal;
      // font-weight: bold;
      font-size: 12px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.7);

      img {
        margin-right: 4px;
      }
    }
  }
}
</style>
