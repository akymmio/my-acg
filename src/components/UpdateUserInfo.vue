<script setup>
import { ref, watch } from 'vue'
import { getUserInfoByIdService, updateUserInfoService } from '@/api/user'
import { Close } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const route = useRoute()
//本地用户信息
const localUser = ref(userStore.user)
const form = ref(userStore.user)
const avatar = ref('')

watch(
  () => userStore.user,
  (newUser) => {
    form.value = newUser
    // avatar.value = newUser.avatar
  }
)
const passwordForm = ref({
  oldPassword: '',
  password: ''
})

const getUserInfo = async () => {
  //没有用户信息需要通过id查询
  if (route.params.id !== localUser.value.id) {
    const res = await getUserInfoByIdService(localUser.value.id)
    form.value = res.data.data
    console.log(form)
  }
}
getUserInfo()
//传递父组件
const emit = defineEmits(['toParent'])
const close = () => {
  emit('toParent', false)
}
//提交修改
const submitForm = async () => {
  const formData = new FormData()
  // 添加文件到 FormData
  // formData.append('avatar_raw', avatar.value) // 假设 avatar.value 是你的文件对象

  // 将 form.value 中的数据添加到 FormData
  Object.keys(form.value).forEach((key) => {
    formData.append(key, form.value[key])
  })

  // 将 passwordForm.value 中的数据添加到 FormData
  Object.keys(passwordForm.value).forEach((key) => {
    formData.append(key, passwordForm.value[key])
  })
  const res = await updateUserInfoService(formData)
  // await updateUserAvatarService(formData)
  console.log(res.data.data)
  passwordForm.value.oldPassword = ''
  passwordForm.value.password = ''

  if (res) ElMessage.success('修改成功')
}

//存储图片
const selectFiles = (uploadFile) => {
  console.log(uploadFile)
  //实现本地预览
  // form.value.avatar = URL.createObjectURL(uploadFile.raw)
  // avatar.value = uploadFile.raw
}
//删除图片
const removeImage = (uploadFile) => {
  console.log(uploadFile)
  avatar.value = ''
}
// const uploadAvatar = async () => {
//   const formData = new FormData()
//   // 添加文件到 FormData
//   formData.append('avatar', avatar.value) // 假设 avatar.value 是你的文件对象
//   await updateUserAvatarService(formData)
// }
//成功回调函数
const uploadSuccess = (res) => {
  form.value.avatar = res.data
  console.log(res.data)
}

//表单校验规则
const rules = ref({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'change' },
    { min: 3, max: 26, message: '长度大于3,小于26', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{5,16}$/, message: '长度大于5,小于16', trigger: 'blur' }
  ]
  // repassword: [
  //   { required: true, message: '请输入密码', trigger: 'blur' },
  //   { pattern: /^\S{5,16}$/, message: '长度大于8,小于16', trigger: 'blur' },
  //   //自定义校验队则
  //   {
  //     validator: (rule, value, callback) => {
  //       if (value !== form.value.password) {
  //         callback(new Error('两次密码不一致'))
  //       } else {
  //         callback()
  //       }
  //     },
  //     trigger: 'blur'
  //   }
  // ]
})
</script>
<template>
  <div class="mask">
    <div class="login-container">
      <div @click="close" class="close">
        <el-icon><Close /></el-icon>
      </div>
      <div class="login-form">
        <div class="element">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-change="selectFiles"
            :on-remove="removeImage"
            :auto-upload="true"
            name="avatar"
            action="/api/user/updateAvatar"
            :headers="{ Authorization: userStore.token }"
            :on-success="uploadSuccess"
          >
            <el-avatar :size="200" :fit="cover" :src="form.avatar" />
            <!-- <el-icon class="avatar-uploader-icon"><Plus /></el-icon> -->
          </el-upload>
          <!-- <button @click="uploadAvatar">上传头像</button> -->
        </div>
        <div class="element">
          <el-form :label-position="labelPosition" label-width="auto" :model="form" :rules="rules">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="form.nickname" />
            </el-form-item>
            <el-form-item label="账号">
              <el-input disabled v-model="form.username" />
            </el-form-item>
            <el-form-item label="旧密码">
              <el-input type="password" v-model="passwordForm.oldPassword" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input type="password" v-model="passwordForm.password" />
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.sex">
                <el-radio value="1">男</el-radio>
                <el-radio value="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="简介">
              <el-input type="textarea" v-model="form.introduction" class="textarea" />
            </el-form-item>
          </el-form>
          <el-form-item>
            <el-button type="primary" @click="submitForm()"> 提交 </el-button>
            <!-- <el-button @click="resetForm()">重置</el-button> -->
          </el-form-item>
        </div>
      </div>
    </div>
  </div>

  <!-- <el-col :span="6">test</el-col> -->
</template>
<style lang="less" scoped>
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
    width: 700px;
    height: 480px;
    border-radius: 20px;
    justify-content: center;
    position: relative; //?
    .close {
      position: absolute;
      right: 20px;
      top: 20px;
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
    }
    .login-form {
      display: flex;
      align-items: center;
      justify-content: center;
      .element {
        margin: 20px;
        .textarea {
          overflow: auto;
          // height: 100px;
          resize: none;
        }
        .textarea::-webkit-scrollbar {
          display: none;
        }
      }
      // .avatar {
      //   width: 50%;
      // }
      // .form {
      //   width: 50%;
      // }
    }
    .button {
      border-radius: 40px;
      // font-size: small;
      background-color: #f6f6f6;
      border: 0;
      width: 80px;
      height: 40px;
      // margin-bottom: 15px;
    }
    .avatar-uploader .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>
