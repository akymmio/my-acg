<template>
  <div>
    <!-- 文件上传组件 -->
    <el-upload
      ref="upload"
      action=""
      class="upload-demo"
      :on-change="handleChange"
      :auto-upload="false"
      :file-list="fileList"
      :limit="1"
      :on-exceed="handleExceed"
    >
      <template #trigger>
        <button type="button" class="uploadModelButton">选择文件</button>
      </template>
      <button type="button" style="margin-left: 10px" @click="submitUpload">上传文件</button>
    </el-upload>

    <!-- 显示当前文件信息 -->
    <p v-if="selectedFile">已选文件：{{ selectedFile.name }}</p>
    <vue3dLoader
      class="model"
      :filePath="modelPath"
      :lights="lights"
      :height="300"
      :width="250"
      :backgroundAlpha="0"
      @click="showContent(3)"
    />
    <div class="block">
      <el-date-picker
        v-model="publishtime"
        type="datetime"
        placeholder="Select date and time"
        :default-time="defaultTime"
      />
    </div>
    <button @click="publish">打印</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { queryArticleByIdService } from '@/api/model'
// 定义文件列表和选择的文件
const fileList = ref([])
const selectedFile = ref(null)
const publishtime = ref()

const publish = () => {
  console.log(publishtime.value)
}

// 文件变化事件处理函数
const handleChange = (file, fileList) => {
  // 更新文件列表和选择的文件
  fileList.value = fileList
  selectedFile.value = file

  console.log('Selected file:', file)
  console.log('Selected fileList:', fileList)
}

// 当文件超出限制时的处理方法
const handleExceed = (files, fileList) => {
  ElMessage.warning(`当前限制只能选择 1 个文件，请先移除已选文件`)
}

// 提交上传的方法
const submitUpload = () => {
  if (!selectedFile.value) {
    ElMessage.error('请选择一个文件再上传')
    return
  }

  // 模拟上传逻辑
  const formData = new FormData()
  formData.append('file', selectedFile.value.raw)

  // 这里可以替换为实际的上传请求
  // 例如使用 axios 发送 POST 请求
  // axios.post('/api/upload', formData).then(response => {
  //   console.log('Upload success:', response.data);
  // }).catch(error => {
  //   console.error('Upload failed:', error);
  // });

  // 模拟成功上传的消息
  ElMessage.success('文件上传成功！')
}
const modelPath = ref()
const getData = async () => {
  //根据文章id,获取文章信息
  // console.log(route.params.id)
  const res = await queryArticleByIdService(3)
  modelPath.value = res.data.data.modelPath
  console.log(modelPath.value)
}
getData()
</script>
