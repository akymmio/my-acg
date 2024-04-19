<script setup>
// import { ref } from 'vue'
// const count = ref(0)
// const load = () => {
//   count.value += 2
// }
</script>

<template>
  <div>
    <div>
      <button>评论</button>
      <button>赞和收藏</button>
      <button>新增关注</button>
    </div>
    <!-- <div>
      <ul v-infinite-scroll="load" class="infinite-list" style="overflow: auto">
        <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li>
      </ul>
    </div> -->
  </div>
</template>

<style scoped lang="less">
button {
  border-radius: 40px;
  font-size: 18px;
  background-color: white;
  border: 0;
  min-width: 90px;
  max-width: 180px;
  height: 40px;
  margin-bottom: 15px;
  margin-right: 10px;
}
button:hover {
  background-color: #f6f6f6;
}
button:focus {
  background-color: #f6f6f6;
}

.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
