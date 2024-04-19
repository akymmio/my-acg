<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
//文本编辑器quill
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { publishArticleService } from '@/api/article'
import { useRouter } from 'vue-router'
const router = useRouter()
//图片数据对象
const fileList = ref({
  //存储多张图片
  coverImg: [],
  title: '',
  content: '',
  state: ''
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview = function (uploadFile) {
  dialogImageUrl.value = uploadFile.url
  //显示弹窗
  dialogVisible.value = true
}
const selectFiles = (uploadFile) => {
  fileList.value.coverImg.push(uploadFile.raw)
  console.log(uploadFile.raw)
}
const publish = async (state) => {
  fileList.value.state = state
  const formData = new FormData()
  for (let key in fileList.value.coverImg) {
    formData.append(`images[]`, fileList.value.coverImg[key])
  }

  // 添加其他表单字段到formData中
  formData.append('title', fileList.value.title)
  formData.append('content', fileList.value.content)
  formData.append('state', fileList.value.state)
  //调用发布文章接口
  const res = await publishArticleService(formData)
  // console.log(res)
  ElMessage({
    message: res.data.message || '发布成功',
    type: 'success'
  })
  //刷新页面，清除数据
  setTimeout(() => {
    router.go('/publish')
  }, 1000)
}
//删除图片
const removeImage = () => {
  console.log('removeImage')
}

const sizeForm = ref({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})
</script>
<template>
  <div class="container">
    <div style="background: #f6f6f6">
      <el-upload
        multiple="true"
        v-model:file-list="fileList.images"
        :auto-upload="false"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-change="selectFiles"
        :on-remove="removeImage"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
    </div>

    <el-row>
      <el-col :span="12">
        <el-form
          ref="form"
          style="max-width: 600px"
          :model="sizeForm"
          label-width="auto"
          size="default"
          label-position="left"
        >
          <el-form-item></el-form-item>
          <el-form-item>
            <el-input v-model="sizeForm.name" placeholder="请输入标题" />
          </el-form-item>

          <quill-editor
            style="height: 200px"
            theme="snow"
            v-model:content="fileList.content"
            content-type="html"
          ></quill-editor>

          <el-form-item label="权限">
            <input type="radio" name="exampleGroup" value="option1" />公开
            <input type="radio" name="exampleGroup" value="option1" />私人
          </el-form-item>
          <el-form-item>
            <button @click="publish('草稿')">编辑</button>
            <button @click="publish('发布')">发布</button>
          </el-form-item>
        </el-form></el-col
      >
      <el-col :span="12"></el-col>
    </el-row>
  </div>
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" class="showImg" />
  </el-dialog>
</template>

<style lang="less" scoped>
.showImg {
  max-width: 600px;
  min-height: 200px;
  max-height: 600px;
  //   height: 100%;
}
.container {
  // background: #f6f6f6;
}
.el-form-item {
  padding-bottom: 5px;
  padding-top: 5px;
}
.el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.el-upload-list--picture-card .el-upload-list__item-actions {
}
</style>
