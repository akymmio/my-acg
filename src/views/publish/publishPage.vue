<script setup>
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
//文本编辑器quill
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { publishArticleService, queryArticleByIdService, updateArticleService } from '@/api/article'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const user = ref(userStore.user)
watch(
  () => userStore.user,
  (newUser) => {
    user.value = newUser
  }
)
//图片数据对象
const fileList = ref({
  images: [], //图片数据
  title: '',
  content: '',
  imagesList: [] //图片url
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
  formData.append('state', fileList.value.state)
  formData.append('channelId', 0)
  formData.append('userId', user.value.id)
  //调用发布文章接口
  loading.value = true
  await publishArticleService(formData)
  loading.value = false
  //显示加载图层
  ElMessage({
    message: '发布成功',
    type: 'success',
    duration: 2000
  })
  // 清空fileList的数据
  fileList.value = {
    images: [], // 图片数据清空
    title: '', // 标题清空
    content: '', // 内容清空
    imagesList: [] // 图片url清空
  }
  // 清空imagesList的数据
  imagesList.value.imagesList = [] // 清空imagesList数组
  showButton.value = false
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
  formData.append('state', fileList.value.state)
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
  router.go(0)
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
    imagesList.value.imagesList = res.images.map((url) => {
      return { url }
    })
  } else {
    // 没有参数或参数为空字符串时执行代码
    return
  }
}
queryArticle()
</script>
<template>
  <div>
    <div>
      <div style="background: #f6f6f6" class="upload">
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
      <div class="container">
        <el-row>
          <el-col :span="10">
            <el-form
              :rules="rules"
              :model="fileList"
              label-width="auto"
              size="default"
              label-position="left"
            >
              <el-form-item prop="title" ref="form">
                <el-input v-model="fileList.title" placeholder="请输入标题" />
              </el-form-item>

              <el-form-item>
                <div>
                  <quill-editor
                    ref="quill"
                    style="height: 200px; width: 500px"
                    theme="snow"
                    v-model:content="fileList.content"
                    content-type="html"
                  ></quill-editor>
                </div>
              </el-form-item>
              <el-form-item v-if="showButton">
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
              </el-form-item>
              <el-form-item v-if="showUpdateButton">
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
              </el-form-item>
            </el-form></el-col
          >
          <el-col :span="14"></el-col>
        </el-row>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" class="showImg">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<style lang="less" scoped>
.container {
  padding-left: 20%;
}
@media screen and (min-width: 1300px) {
  .container {
    padding-left: 25%;
  }
}
.upload {
  width: 100%;
  height: 150px;
  overflow-y: scroll;
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

.button {
  border-radius: 40px;
  font-size: large;
  background-color: #f6f6f6;
  border: 0;
  width: 80px;
  height: 40px;
  margin-bottom: 15px;
  margin-right: 10px;
}
// button:hover {
//   background-color: #f6f6f6;
// }
// button:focus {
//   background-color: #f6f6f6;
//   font-weight: bold;
// }
</style>
