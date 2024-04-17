<template>
  <el-upload
    v-model:file-list="fileList.images"
    :auto-upload="false"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-change="selectFiles"
  >
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" class="showImg" />
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

//图片上传数据
const fileList = ref({
  images: [],
  title: String,
  content: String
})
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview = function (uploadFile) {
  dialogImageUrl.value = uploadFile.url
  //存入对象中
  fileList.value.images.push(uploadFile.raw)
  console.log(fileList.value)
  //显示弹窗
  dialogVisible.value = true
}

const selectFiles = (uploadFiles) => {
  console.log(uploadFiles)
}
</script>
<style lang="less">
.showImg {
  max-width: 600px;
  min-height: 200px;
  max-height: 600px;
  //   height: 100%;
}
</style>
