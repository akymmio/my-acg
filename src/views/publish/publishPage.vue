<script setup>
import { ref, watch, nextTick, h } from 'vue'
import { Plus, Close, ChatRound, MagicStick } from '@element-plus/icons-vue'
//文本编辑器quill
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { publishArticleService, queryArticleByIdService, updateArticleService } from '@/api/article'
import { publishModelService } from '@/api/model'
import { getCategoryService } from '@/api/category'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useUserStore } from '@/stores'
import { chatWithAI } from '@/api/ai'
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
  state: 'true', //状态
  channelId: '分类',
  publishTime: '',
  is_collection: 'false'
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
  showImage.value = true
  // console.log(uploadFile.raw)
}

const modelList = ref()
const uploadModel = (file) => {
  showModel.value = true
  showButton.value = true

  modelPath.value = URL.createObjectURL(file.raw)
  modelList.value = file.raw
  console.log(modelPath.value)
}

const form = ref()
const loading = ref(false)

const publish = async () => {
  await form.value.validate()
  const formData = new FormData()

  // 添加其他表单字段到formData中
  formData.append('title', fileList.value.title)
  formData.append('content', fileList.value.content)
  // if (fileList.value.state === 'true') {
  //   formData.append('state', true)
  // } else {
  //   formData.append('state', false)
  // }
  formData.append('state', fileList.value.state)
  formData.append('createTime', fileList.value.publishTime)
  formData.append('channelId', fileList.value.channelId)
  formData.append('userId', user.value.id)
  formData.append('is_collection', fileList.value.is_collection)
  if (modelPath.value) {
    console.log('上传模型')
    // formData.append('model', fileList.value.images[0])
    formData.append('file', modelList.value)
    // console.log(modelList.value)
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value)
    // }
    // await publishModelService(formData)
  }
  console.log('上传图文')
  for (let key in fileList.value.images) {
    formData.append(`images[]`, fileList.value.images[key])
  }
  // //调用发布文章接口
  // loading.value = true
  await publishArticleService(formData)

  // if (modelPath.value) {
  //   console.log('上传模型')
  //   // formData.append('model', fileList.value.images[0])
  //   formData.append('file', modelList.value)
  //   console.log(modelList.value)
  //   for (let [key, value] of formData.entries()) {
  //     console.log(`${key}:`, value)
  //   }
  //   await publishModelService(formData)
  // } else {
  //   console.log('上传图文')
  //   for (let key in fileList.value.images) {
  //     formData.append(`images[]`, fileList.value.images[key])
  //   }
  //   // //调用发布文章接口
  //   // loading.value = true
  //   await publishArticleService(formData)
  // }
  // if (res) {
  //   //显示加载图层
  //   ElMessage({
  //     message: '发布成功',
  //     type: 'success',
  //     duration: 2000
  //   })
  //   fileList.value = {
  //     images: [], // 图片数据清空
  //     title: '', // 标题清空
  //     content: '', // 内容清空
  //     imagesList: [], // 图片url清空
  //     state: 1 //状态
  //   }
  //   imagesList.value.imagesList = [] // 清空imagesList数组
  //   showButton.value = false
  // } else {
  //   //显示加载图层
  //   ElMessage.error('发布失败')
  // }
  // loading.value = false
}
// const publish = async () => {
//   console.log(fileList.value)
// }
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
  formData.append('is_collection', fileList.value.is_collection)
  if (modelPath.value) {
    console.log('上传模型')
    formData.append('file', modelList.value)
  }
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
  try {
    await updateArticleService(formData)
    loading.value = false
    ElMessage({
      message: '更新成功',
      type: 'success',
      duration: 1500
    })
  } catch (err) {
    loading.value = false
    ElMessage.error('更新失败')
  }
}
const quill = ref()
const cancel = () => {
  fileList.value = {
    images: [], // 图片数据清空
    title: '', // 标题清空
    content: '<p></p>', // 内容清空
    imagesList: [], // 图片url清空
    state: 1 //状态
  }

  imagesList.value.imagesList = [] // 清空imagesList数组
  showButton.value = false
  showUpdateButton.value = false

  showModel.value = false
  showExampleModel.value = false
  modelList.value = []
  showImage.value = false
  quill.value.quill.setText('')
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
  // showImage.value = false
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
const showExampleModel = ref(false)
const showImage = ref(false)
const showModel = ref(false)
const modelPath = ref(null)
const lights = ref()
const selectedModelType = ref('模型类型')
const modelTypeOptions = ref([
  // {
  //   type: 'obj',
  //   id: 1
  // },
  {
    type: 'glb',
    id: 1
  }
])

const removeModel = () => {
  // showImage.value = true
  showButton.value = false
  showModel.value = false
  modelPath.value = null
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
const autoPlay = ref(false)
const uploadTest = (file) => {
  console.log(file)
  console.log(1)
}

const chatMessages = ref([])
const chatInput = ref('')
const isChatting = ref(false)

const sendMessage = async () => {
  if (!chatInput.value.trim()) return

  const userMessage = chatInput.value
  chatMessages.value.push({
    role: 'user',
    content: userMessage
  })
  chatInput.value = ''
  isChatting.value = true

  // 添加一个空的助手消息
  const assistantMessage = {
    role: 'assistant',
    content: ''
  }
  chatMessages.value.push(assistantMessage)

  try {
    await chatWithAI(userMessage, (content) => {
      // 更新最后一条消息的内容
      assistantMessage.content += content
    })
  } catch (error) {
    console.error('Chat error:', error)
    ElMessage.error('聊天请求失败')
  } finally {
    isChatting.value = false
  }
}

// 添加自动滚动功能
const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// 监听消息变化,自动滚动到底部
watch(
  () => chatMessages.value,
  () => {
    nextTick(scrollToBottom)
  },
  { deep: true }
)

const showChat = ref(false)
const chatMessagesRef = ref(null)

const optimizeContent = async () => {
  if (!fileList.value.title && !fileList.value.content) {
    ElMessage.warning('请先填写内容再进行优化')
    return
  }

  isChatting.value = true
  const prompt = `请帮我优化以下文章的标题和内容。
标题要求：限制在30个字以内，使其更吸引人、更专业
内容要求：使其更专业、更有逻辑性，同时保持原有主题

当前标题：${fileList.value.title}
当前内容：${fileList.value.content}`

  // 添加一个临时消息显示优化前的内容
  chatMessages.value.push({
    role: 'user',
    content: `正在优化文章...\n标题：${fileList.value.title}\n内容：${fileList.value.content}`
  })

  const optimizedContent = {
    content: ''
  }
  chatMessages.value.push({
    role: 'assistant',
    content: optimizedContent
  })

  try {
    await chatWithAI(prompt, (text) => {
      optimizedContent.content += text
    })

    // 显示应用按钮
    ElMessageBox.confirm(
      h('div', null, [
        h('p', '优化结果:'),
        h('p', { style: 'color: #409EFF; white-space: pre-wrap;' }, optimizedContent.content)
      ]),
      '是否采用优化结果?',
      {
        confirmButtonText: '采用',
        cancelButtonText: '取消'
      }
    )
      .then(() => {
        // 解析优化后的内容
        const result = optimizedContent.content
        // 更新正则表达式以更准确地匹配标题和内容
        const titleMatch = result.match(/(?:标题[：:]\s*\**)([^*\n]+)/)
        const contentMatch = result.match(/(?:内容[：:]\s*)([\s\S]+)$/)
        console.log(titleMatch, contentMatch)
        if (titleMatch && titleMatch[1]) {
          fileList.value.title = titleMatch[1].trim()
        }
        if (contentMatch && contentMatch[1]) {
          fileList.value.content = contentMatch[1].trim()
        }

        ElMessage.success('已应用优化内容')
      })
      .catch(() => {
        ElMessage.info('已取消应用')
      })
  } catch (error) {
    console.error('优化失败:', error)
    ElMessage.error('内容优化失败')
  } finally {
    isChatting.value = false
  }
}
</script>
<template>
  <div class="container">
    <div class="container-left">
      <div>
        <div>
          <p>图片编辑 ({{ imagesList.imagesList.length }})</p>
        </div>
        <div class="upload">
          <el-upload
            multiple="true"
            v-model:file-list="imagesList.imagesList"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="selectFiles"
            :on-remove="removeImage"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </div>
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
                <div class="input-with-button">
                  <el-input
                    show-word-limit
                    maxlength="30"
                    v-model="fileList.title"
                    placeholder="请输入标题"
                  />
                </div>
              </el-form-item>

              <el-form-item>
                <div>
                  <quill-editor
                    ref="quill"
                    class="custom-quill-editor"
                    style="height: 200px; width: 500px"
                    theme="snow"
                    v-model:content="fileList.content"
                    content-type="html"
                  ></quill-editor>
                </div>
                <el-button
                  type="primary"
                  :icon="MagicStick"
                  circle
                  :loading="isChatting"
                  @click="optimizeContent()"
                  title="AI优化文章"
                  style="margin-left: 10px"
                />
              </el-form-item>

              <!-- <el-form-item>
                <el-input
                  placeholder="留下你的想法吧"
                  :rows="7"
                  show-word-limit
                  maxlength="2000"
                  v-model="fileList.content"
                  type="textarea"
                />
              </el-form-item> -->

              <el-form-item label="可见范围">
                <div>
                  <el-radio-group v-model="fileList.state">
                    <el-radio value="true">公开</el-radio>
                    <el-radio value="false">私密</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
              <el-form-item label="文章类型" v-if="user.admin">
                <div>
                  <el-radio-group v-model="fileList.is_collection">
                    <el-radio value="false">普通文章</el-radio>
                    <el-radio value="true">藏品文章</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>

              <el-form-item>
                <el-select v-model="fileList.channelId" placeholder="分类" style="width: 100px">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.channelName"
                    :value="item.id"
                  />
                </el-select>
                <el-select
                  v-model="selectedModelType"
                  placeholder="模型类型"
                  style="width: 100px; padding-left: 20px"
                >
                  <el-option
                    v-for="item in modelTypeOptions"
                    :key="item.id"
                    :label="item.type"
                    :value="item.id"
                  />
                </el-select>
                <div class="block">
                  <el-date-picker
                    style="padding-left: 20px"
                    v-model="fileList.publishTime"
                    type="datetime"
                    placeholder="发布时间"
                    :default-time="defaultTime"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </div>
              </el-form-item>
              <el-form-item> </el-form-item>
              <el-form-item>
                <div class="button-container">
                  <div class="left-container">
                    <button
                      type="button"
                      @click="showExampleModel = !showExampleModel"
                      class="uploadModelButton"
                    >
                      模型示例
                    </button>

                    <el-upload
                      ref="upload"
                      action
                      class="upload-demo"
                      :http-request="uploadTest"
                      :auto-upload="false"
                      :on-change="uploadModel"
                      :on-remove="removeModel"
                      :limit="1"
                    >
                      <template #trigger>
                        <button type="button" class="uploadModelButton">上传模型</button>
                      </template>
                    </el-upload>
                  </div>

                  <div class="right-container">
                    <div v-if="!showUpdateButton">
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
    <div class="container-right" v-if="imagesList.imagesList.length">
      <p>图片展示</p>
      <div class="media-container">
        <el-carousel height="670px" interval="3600" trigger="hover">
          <el-carousel-item v-for="(image, index) in imagesList.imagesList" :key="index">
            <el-image z-index="index" :src="image.url" fit="contain" class="carousel" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <div class="modelCss" v-if="showModel">
      <p>模型展示</p>
      <vue3dLoader
        fileType="obj"
        :filePath="modelPath"
        :lights="lights"
        :height="700"
        :width="400"
        @load="onLoad()"
        :autoPlay="autoPlay"
        :backgroundAlpha="0"
      />
    </div>
    <div class="modelCss" v-if="showExampleModel">
      <p>模型展示</p>
      <vue3dLoader
        filePath="http://localhost:8081/models/20241209/aphrodite_of_milos_a_plaster_cast.glb"
        :lights="lights"
        :height="700"
        :width="400"
        :rotation="rotation"
        @load="onLoad()"
        :autoPlay="autoPlay"
        :backgroundAlpha="0"
      />
    </div>
    <!-- <img src="http://127.0.0.1:8081/models/20241209/png8.png" alt="" /> -->

    <div class="chat-container" v-if="showChat">
      <div class="chat-header">
        <h3>AI助手</h3>
        <el-button type="text" @click="showChat = false">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>

      <div class="chat-messages" ref="chatMessagesRef">
        <div v-for="(msg, index) in chatMessages" :key="index" :class="['message', msg.role]">
          <div class="message-content">{{ msg.content }}</div>
        </div>
      </div>

      <div class="chat-input">
        <el-input
          v-model="chatInput"
          placeholder="输入消息..."
          :disabled="isChatting"
          @keyup.enter="sendMessage"
        >
          <template #append>
            <el-button :loading="isChatting" @click="sendMessage">发送</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <el-button
      class="chat-toggle"
      type="primary"
      circle
      @click="showChat = !showChat"
      v-if="!showChat"
    >
      <el-icon><ChatRound /></el-icon>
    </el-button>
  </div>
</template>

<style lang="less" scoped>
.ql-container {
  height: 400px; /* 设置高度（根据需要调整） */
}
.custom-quill-editor {
  width: 200px; /* 设置宽度为百分比 */
}
.button-container {
  width: 100%;
  // height: 100px;
  display: flex;
  // align-items: center;            /* 垂直居中 */
  justify-content: space-between; /* 子元素之间的间距 */
  .right-container {
    display: flex; /* 让右边的两个 div 并排 */
  }
  .left-container {
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
    background-image: url('/icon/background.png');
    border: 1px solid rgba(0, 0, 0, 0.1);
    p {
      padding: 5px;
      border-radius: 20px;
      // background-color: #f2f2f2;
      // color: #565656;
      font-size: large;
      color: #f2f2f2;
    }
  }
  .container-right {
    width: 30%;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-image: url('/icon/background.png');
    p {
      padding: 5px;
      border-radius: 20px;
      // background-color: #f2f2f2;
      // color: #565656;
      font-size: large;
      color: #f2f2f2;
    }

    .media-container {
      width: 100%;
      align-items: center;
    }
    .carousel {
      width: 100%;
      height: 100%;
      // background: white;
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
    // width: 500px;
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
  margin-right: 10px;
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

.chat-container {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.chat-header {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #f5f7fa;

  .message {
    margin-bottom: 10px;
    max-width: 80%;

    &.user {
      margin-left: auto;
      .message-content {
        background: #409eff;
        color: white;
        border-radius: 10px 10px 0 10px;
      }
    }

    &.assistant {
      margin-right: auto;
      .message-content {
        background: white;
        border-radius: 10px 10px 10px 0;
        border: 1px solid #dcdfe6;
      }
    }

    .message-content {
      padding: 8px 12px;
      word-break: break-word;
    }
  }
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
}

.chat-toggle {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 999;
}

.input-with-button {
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-with-button {
  display: flex;
  align-items: flex-start;
}

.custom-quill-editor {
  flex: 1;
}
</style>
