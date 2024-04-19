<script setup></script>

<template>
  <div>
    <div>
      <button>评论</button>
      <button>赞和收藏</button>
      <button>关注</button>
    </div>
  </div>
</template>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: center; /* 水平居中 */

  .element {
    margin: 30px 40px;
  }
}
.main {
  padding-top: 20px;
}
button {
  border-radius: 40px;
  font-size: 18px;
  background-color: white;
  border: 0;
  min-width: 90px;
  max-width: 180px;
  height: 40px;
  margin-bottom: 15px;
}
button:hover {
  background-color: #f6f6f6;
}
button:focus {
  background-color: #f6f6f6;
}
</style>
