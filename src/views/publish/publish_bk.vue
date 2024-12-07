<script setup>
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
//文本编辑器quill
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { publishArticleService, queryArticleByIdService, updateArticleService } from '@/api/article'
import { getCategoryService } from '@/api/category'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const user = ref(userStore.user)
// watch(
//   () => userStore.user,
//   (newUser) => {
//     user.value = newUser
//   }
// )
//图片数据对象
const fileList = ref({
  images: [], //图片数据
  title: '',
  content: '',
  imagesList: [], //图片url
  state: 'public', //状态
  channelId: 1
})
//存入照片墙展示的图片
const imagesList = ref({
  imagesList: []
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
//预览
const handlePictureCardPreview = function (uploadFile) {
  dialogImageUrl.value = uploadFile.url
  //显示弹窗
  dialogVisible.value = true
}
//存储图片
const showButton = ref(false)
const selectFiles = (uploadFile) => {
  //展示的图片
  imagesList.value.imagesList.push(URL.createObjectURL(uploadFile.raw))
  console.log(imagesList.value.imagesList)
  //上传的图片
  fileList.value.images.push(uploadFile.raw)
  console.log(fileList.value.images)
  if (showUpdateButton.value === false) showButton.value = true
  // console.log(uploadFile.raw)
}
const form = ref()
const loading = ref(false)
//发布文章
const publish = async () => {
  await form.value.validate()
  const formData = new FormData()
  for (let key in fileList.value.images) {
    formData.append(`images[]`, fileList.value.images[key])
  }
  // fileList.value.images.forEach((file) => {
  //   formData.append(`images[]`, file)
  // })
  // 添加其他表单字段到formData中
  formData.append('title', fileList.value.title)
  formData.append('content', fileList.value.content)
  if (fileList.value.state === 'public') {
    formData.append('state', 1)
  } else {
    formData.append('state', 2)
  }
  formData.append('channelId', fileList.value.channelId)
  formData.append('userId', user.value.id)
  //调用发布文章接口
  loading.value = true
  const res = await publishArticleService(formData)
  if (res) {
    //显示加载图层
    ElMessage({
      message: '发布成功',
      type: 'success',
      duration: 2000
    })
    fileList.value = {
      images: [], // 图片数据清空
      title: '', // 标题清空
      content: '', // 内容清空
      imagesList: [], // 图片url清空
      state: 1 //状态
    }
    imagesList.value.imagesList = [] // 清空imagesList数组
    showButton.value = false
  } else {
    //显示加载图层
    ElMessage.error('发布失败')
  }
  loading.value = false
}

const update = async () => {
  await form.value.validate()
  const formData = new FormData()
  for (let key in fileList.value.images) {
    formData.append(`images[]`, fileList.value.images[key])
  }
  // 添加其他表单字段到formData中
  formData.append('title', fileList.value.title)
  formData.append('content', fileList.value.content)
  formData.append('userId', user.value.id)
  if (fileList.value.state === 'private') {
    formData.append('state', 0)
  } else {
    formData.append('state', 1)
  }
  formData.append('channelId', 0)
  formData.append('imagesList', fileList.value.imagesList)
  //添加文章id
  formData.append('id', route.query.id)
  //调用更新文章接口
  loading.value = true
  await updateArticleService(formData)
  loading.value = false
  ElMessage({
    message: '更新成功',
    type: 'success',
    duration: 1500
  })
}

const cancel = () => {
  fileList.value = {
    images: [], // 图片数据清空
    title: '', // 标题清空
    content: '', // 内容清空
    imagesList: [], // 图片url清空
    state: 1 //状态
  }
  imagesList.value.imagesList = [] // 清空imagesList数组
  showButton.value = false
  showUpdateButton.value = false
  // router.go(0)
}
//删除图片
const removeImage = (uploadFile) => {
  //两种类型，raw类型和url类型
  if (uploadFile.raw) {
    const index = fileList.value.images.indexOf(uploadFile.raw)
    if (index !== -1) {
      fileList.value.images.splice(index, 1)
      console.log(fileList.value.images)
    }
  }
  if (uploadFile.url) {
    const index = fileList.value.imagesList.indexOf(uploadFile.url)
    if (index !== -1) {
      fileList.value.imagesList.splice(index, 1)
      console.log(fileList.value.imagesList)
    }
  }
}
//校验规则
const rules = ref({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
})
//获取文章数据
const showUpdateButton = ref(false)

const queryArticle = async () => {
  if (route.query.id && route.query.id !== '') {
    // 当 route.query.id 存在且不为空字符串时执行代码
    showUpdateButton.value = true
    const result = await queryArticleByIdService(route.query.id)
    const res = result.data.data
    fileList.value.title = res.title
    fileList.value.content = res.content
    fileList.value.imagesList = res.images
    //展示数据需要的是array对象数组，转换一下!!
    console.log(res.images)
    imagesList.value.imagesList = res.images.map((url) => {
      return { url }
    })
    console.log(imagesList.value.imagesList)
    // showImage.value.images = res.images
  } else {
    // 没有参数或参数为空字符串时执行代码
    return
  }
}
queryArticle()

// const value = ref('')

const options = ref()

const getCategory = async () => {
  const result = await getCategoryService()
  options.value = result.data.data
  console.log(options.value)
}
getCategory()

// const showImage = ref({
//   images: [
//     // 'https://test-web-1.oss-cn-shenzhen.aliyuncs.com/5f6f0d6e-a371-4fea-be55-5c4fc211aec0.webp',
//     // 'https://test-web-1.oss-cn-shenzhen.aliyuncs.com/1292bd1a-be9d-4384-accf-d6dc8ecf69eb.png'
//   ]
// })
const showModel = ref(false)
const modelPath = ref(null)
const lights = ref()
const selectedModelType = ref(null)
const modelTypeOptions = ref([
  {
    type: 'obj',
    id: 1
  },
  {
    type: 'glb',
    id: 2
  }
])
const selectModel = async () => {
  showModel.value = true
  showButton.value = true
}
const modelList = ref([])
const uploadModel = async (file, fileList) => {
  modelList.value = fileList
  console.log(modelList.value)
  const url = URL.createObjectURL(file.raw)
  // await new Promise((resolve) => setTimeout(resolve, 1000))
  modelPath.value = url

  console.log(modelPath.value)
  // 延迟一小段时间以确保 URL 已经创建好
  // showModel.value = true
}

lights.value = [
  {
    type: 'AmbientLight',
    color: 'white',

    intensity: 1.4
  },
  {
    type: 'PointLight',
    color: 'white',

    intensity: 1
  }
]
const list = ref([
  {
    src: 'aphrodite_of_milos_a_plaster_cast.glb',
    title: '测试1'
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

// import { onUnmounted } from 'vue'

// 在组件卸载时清理 URL
// onUnmounted(() => {
//   if (modelPath.value) {
//     URL.revokeObjectURL(modelPath.value)
//   }
// })
// import  { UploadInstance } from 'element-plus'
// const uploadRef = ref<UploadInstance>()
</script>
<template>
  <div class="container">
    <div class="container-left">
      <div>
        <p>图片编辑 ({{ imagesList.imagesList.length }})</p>
      </div>
      <div class="upload">
        <el-upload
          multiple="true"
          :file-list="imagesList.imagesList"
          :auto-upload="false"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-change="selectFiles"
          :on-remove="removeImage"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </div>
      <div>
        <p>内容编辑</p>
        <el-row>
          <el-col>
            <el-form
              :rules="rules"
              :model="fileList"
              label-width="auto"
              size="default"
              label-position="left"
            >
              <el-form-item prop="title" ref="form">
                <el-input
                  show-word-limit
                  maxlength="20"
                  v-model="fileList.title"
                  placeholder="请输入标题"
                />
              </el-form-item>

              <!-- <el-form-item>
                <div>
                  <quill-editor
                    ref="quill"
                    style="height: 200px; width: 500px"
                    theme="snow"
                    v-model:content="fileList.content"
                    content-type="html"
                  ></quill-editor>
                </div>
              </el-form-item> -->
              <!-- <el-form-item >
                
                
                <textarea
                  class="input"
                  v-model="fileList.content"
                  placeholder="留下你的想法吧"
                ></textarea>
              </el-form-item> -->
              <el-form-item>
                <el-input
                  placeholder="留下你的想法吧"
                  :rows="10"
                  show-word-limit
                  maxlength="2000"
                  v-model="fileList.content"
                  type="textarea"
                />
              </el-form-item>

              <el-form-item label="可见范围">
                <div>
                  <el-radio-group v-model="fileList.state">
                    <el-radio value="public">公开</el-radio>
                    <el-radio value="private">私密</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>

              <el-form-item>
                <el-select v-model="fileList.channelId" placeholder="分类" style="width: 240px">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.channelName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <!-- <el-form-item>
                <el-select v-model="selectedModelType" placeholder="模型类型" style="width: 240px">
                  <el-option
                    v-for="item in modelTypeOptions"
                    :key="item.id"
                    :label="item.type"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item> -->
              <el-form-item>
                <div class="button-container">
                  <div>
                    <el-upload
                      ref="upload"
                      action
                      class="upload-demo"
                      :file-list="modelList"
                      :auto-upload="false"
                      @change="uploadModel"
                      :limit="1"
                    >
                      <template #trigger>
                        <button type="button" @click="selectModel" class="uploadModelButton">
                          上传模型
                        </button>
                      </template>
                    </el-upload>
                  </div>
                  <div class="right-container">
                    <div v-if="showButton">
                      <button type="button" @click="cancel" class="button">取消</button>
                      <button
                        v-loading.fullscreen.lock="loading"
                        element-loading-text="发布中"
                        type="button"
                        @click="publish()"
                        class="button"
                      >
                        发布
                      </button>
                    </div>
                    <div v-if="showUpdateButton">
                      <button type="button" @click="cancel" class="button">取消</button>
                      <button
                        v-loading.fullscreen.lock="loading"
                        element-loading-text="发布中"
                        type="button"
                        class="button"
                        @click="update()"
                      >
                        更新
                      </button>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="container-right">
      <p>图片展示</p>
      <div class="media-container">
        <el-carousel height="700px" interval="3600" trigger="hover">
          <el-carousel-item v-for="(image, index) in imagesList.imagesList" :key="index">
            <el-image z-index="index" :src="image.url" fit="contain" class="carousel" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <!-- <div class="modelCss" v-if="modelPath">
      <p>模型展示</p>
      <vue3dLoader
        fileType="glb"
        :filePath="modelPath"
        :lights="lights"
        :height="700"
        :width="400"
        :rotation="rotation"
        @load="onLoad()"
        :autoPlay="autoPlay"
        backgroundColor="white"
      />
    </div> -->
  </div>
</template>

<style lang="less" scoped>
.button-container {
  width: 500px;
  // height: 100px;
  display: flex;
  // align-items: center;            /* 垂直居中 */
  justify-content: space-between; /* 子元素之间的间距 */
  .right-container {
    display: flex; /* 让右边的两个 div 并排 */
  }
}
.container {
  // background-color: #f2f2f2;
  display: flex;
  .container-left {
    width: 50%;
    // height: 100%;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-right: 10px;
    padding: 15px;
  }
  .modelCss {
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    margin-left: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    p {
      padding: 5px;
      border-radius: 20px;
      background-color: #f2f2f2;
    }
  }
  .container-right {
    width: 30%;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);

    p {
      padding: 5px;
      border-radius: 20px;
      background-color: #f2f2f2;
    }

    .media-container {
      width: 100%;
      align-items: center;
    }
    .carousel {
      width: 100%;
      height: 100%;
      background: white;
    }
    // .el-carousel__item:nth-child(2n) {
    //   background-color: #99a9bf;
    // }

    // .el-carousel__item:nth-child(2n + 1) {
    //   background-color: #d3dce6;
    // }
  }
  // .container-right {
  //     width: 60%;
  //     display: flex;

  //     .media-container {
  //       width: 100%;
  //       // height: auto;
  //       overflow: hidden;
  //       // border-radius: 20px 0 0 20px;
  //       object-fit: contain;
  //       background-color: chartreuse;
  //     }

  //     .el-carousel__item:nth-child(2n) {
  //       background-color: #99a9bf;
  //     }

  //     .el-carousel__item:nth-child(2n + 1) {
  //       background-color: #d3dce6;
  //     }
  //   }
}
// @media screen and (min-width: 1300px) {
//   .container {
//     // padding-left: 25%;
//   }
// }
.upload {
  width: 100%;
  height: 150px;
  overflow-y: scroll !important;
  // background: #f6f6f6
}

.showImg img {
  max-width: 100%; /* 图片最大宽度为容器宽度 */
  // height: auto; /* 高度自动调整，保持原始宽高比 */
  // display: block; /* 消除图片下方的空白间隙（如果图片是行内元素的话） */
}
.el-row {
  padding-top: 10px;
  width: 100%;
  // background-color: aqua;
  .el-form {
    width: 500px;
  }
}
.uploadModelButton {
  border-radius: 5px;
  font-size: large;
  // background-color: #f6f6f6;
  color: rgb(255, 255, 255);
  background: rgb(255, 48, 89);
  border: 0;
  width: 100px;
  height: 40px;
  // margin-right: 10px;
}
.button {
  border-radius: 10px;
  font-size: large;
  // background-color: #f6f6f6;
  color: rgb(255, 255, 255);
  background: rgb(255, 48, 89);
  border: 0;
  width: 80px;
  height: 40px;
  // margin-bottom: 15px;
  margin-left: 10px;
}
// button:hover {
//   background-color: #f6f6f6;
// }
// button:focus {
//   background-color: #f6f6f6;
//   font-weight: bold;
// }
</style>
