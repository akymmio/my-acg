<script setup>
import { ref, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { Close } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/index'
const router = useRouter()
const isRegister = ref(true)
//表单数据
const userform = ref({
  username: '',
  password: '',
  repassword: ''
})
//注册
const form = ref()
const register = async () => {
  await form.value.validate()
  await userRegisterService(userform.value)
  ElNotification({
    title: 'Success',
    message: '注册成功',
    type: 'success'
  })
  //切换登录页面
  isRegister.value = true
}
//监视登录和注册的切换
watch(isRegister, () => {
  userform.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

//用户pinia数据
const userStore = useUserStore()
//登录
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(userform.value)
  ElNotification({
    title: 'Success',
    message: '登录成功',
    type: 'success'
  })
  //存储token
  userStore.setToken(res.data.data)
  //跳转首页
  router.push('/')
}

//表单校验规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 2, max: 26, message: '长度大于3', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{8,15}$/, message: '长度大于8', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{8,15}$/, message: '长度大于8', trigger: 'blur' },
    //自定义校验队则
    {
      validator: (rule, value, callback) => {
        if (value !== userform.value.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

//传递父组件

const emit = defineEmits(['toParent'])
const close = () => {
  console.log(1)
  emit('toParent', false)
}
</script>
<template>
  <div class="mask">
    <div class="login-container">
      <div @click="close" class="close">
        <el-icon><Close /></el-icon>
      </div>
      <div class="left"></div>
      <div class="right">
        <!-- 登录 -->
        <span style="margin-bottom: 30px; font-weight: bold"> 用户登录</span>
        <el-form :model="userform" :rules="rules" ref="form" v-if="isRegister">
          <el-form-item prop="username">
            <input v-model="userform.username" placeholder="用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <input v-model="userform.password" type="password" placeholder="密码" />
          </el-form-item>
          <el-form-item>
            <button class="loginButton" @click="login">登录</button>
          </el-form-item>
          <el-link @click="isRegister = false">注册</el-link>
        </el-form>
        <!-- 注册 -->
        <el-form :model="userform" :rules="rules" ref="form" v-else>
          <el-form-item prop="username">
            <input v-model="userform.username" size="large" placeholder="用户名" />
          </el-form-item>
          <el-form-item prop="password">
            <input v-model="userform.password" size="large" type="password" placeholder="密码" />
          </el-form-item>
          <el-form-item prop="repassword">
            <input
              v-model="userform.repassword"
              size="large"
              type="password"
              placeholder="确认密码"
            />
          </el-form-item>
          <el-form-item>
            <button
              class="loginButton"
              @click="register"
              size="large"
              color="#626aef"
              :dark="isDark"
            >
              注册
            </button>
          </el-form-item>
          <el-link @click="isRegister = !isRegister">返回</el-link>
        </el-form>
        <div style="position: absolute; bottom: 30px">asdfa</div>
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
    width: 800px;
    height: 480px;
    border-radius: 20px;
    position: relative; //?
    .close {
      // position: absolute; //
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
      // background-color: #f6f6f6;
    }
    .left {
      width: 400px;
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
      input {
        padding-left: 10px;
        width: 240px;
        height: 40px;
        border-radius: 20px;
        border: 0;
        background-color: #f6f6f6;
      }
      input:focus {
        outline: none;
      }
      .loginButton {
        height: 40px;
        width: 100%;
        border: 0;
        border-radius: 40px;
        margin-top: 30px;
        // font-size: large;
        font-weight: bold;
        color: #fff;
        background: #ff2e4d;
        // text-align: center;
      }
    }
  }
  // .el-card {
  //   padding: 20px;
  //   border-radius: 10%; /* 边框半径百分比应保持在合理范围内，通常不超过 50% */
  //   width: 15%; /* 最大宽度百分比应根据实际需求调整，可能需要更高 */
  //   min-height: 30%;
  //   max-height: 40%;
  // }

  /* 使用后代选择器（空格）正确地关联 .layout 和 .button */
  // .button {
  //   width: 100%;
  // }
  // .el-form-item {
  //   margin-top: 10%;
  //   margin-bottom: 10%;
  // }
}
</style>
