<script setup>
import { ref } from 'vue'
const isRegister = ref(true)
//表单数据
const userform = ref({
  username: '',
  password: '',
  repassword: ''
})
//表单校验规则
const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 2, max: 26, message: '长度大于3', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { pattern: /^\S{8,15}$/, message: '长度大于8', trigger: 'change' }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { pattern: /^\S{8,15}$/, message: '长度大于8', trigger: 'change' },
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
</script>
<template>
  <el-card class="layout">
    <!-- 登录 -->
    <el-form :model="userform" :rules="rules" v-if="isRegister">
      <el-form-item prop="username">
        <el-input v-model="userform.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="userform.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item>
        <button class="button">登录</button>
      </el-form-item>
      <el-link @click="isRegister = false">注册</el-link>
    </el-form>
    <!-- 注册 -->
    <el-form :model="userform" :rules="rules" v-else>
      <el-form-item prop="username">
        <el-input v-model="userform.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="userform.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item prop="repassword">
        <el-input v-model="userform.repassword" type="password" placeholder="确认密码" />
      </el-form-item>
      <el-form-item>
        <button class="button">注册</button>
      </el-form-item>
      <el-link @click="isRegister = !isRegister">返回</el-link>
    </el-form>
  </el-card>

  <!-- <el-col :span="6">test</el-col> -->
</template>
<style lang="less" scoped>
.layout {
  border-radius: 10%; /* 边框半径百分比应保持在合理范围内，通常不超过 50% */
  width: 15%; /* 最大宽度百分比应根据实际需求调整，可能需要更高 */
  padding: 20px;

  /* 使用后代选择器（空格）正确地关联 .layout 和 .button */
  .button {
    margin-top: 10%;
    margin-bottom: 10%;
    width: 100%;
  }
}
</style>
