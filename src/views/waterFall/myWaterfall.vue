<template>
  <div>
    <Waterfall :list="cardList" :hasAroundGutter="false" style="">
      @scroll="scroll">
      <template #item="{ item }">
        <LazyImg
          :url="item.src"
          style="border-radius: 8px"
          @click="dialogTableVisible = true"
        />
        <!-- <div class="item-body">
                    <div class="item-desc">{{ item.title }}</div>
                    <div class="item-footer">
                        <div class="footer-left">
                            <img :src="item.avatar" alt="" srcset="" />
                            <div class="name">{{ item.user }}</div>
                        </div>
                        <div class="like">
                            <div class="like-total">{{ item.vote_num }}</div>
                        </div>
                    </div>
                </div> -->
      </template>
    </Waterfall>
  </div>
  <div class="feeds-loading"></div>
</template>

<script setup>
import { ref } from 'vue'
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
defineProps({
  cardList: {
    type: Array,
    default: () => [] //默认值
  }
})

const dialogTableVisible = ref(false)
</script>

<style lang="less" scoped>
.item-body {
  margin: 9px;

  .item-desc {
    text-align: left;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: #000000;
  }

  .item-footer {
    display: flex;
    justify-content: space-between;

    .footer-left {
      display: flex;
      align-items: center;
      font-family: SF Pro Display;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.6);

      img {
        border-radius: 50%;
        width: 22px;
        height: 22px;
        margin-right: 4px;
      }
    }

    .like {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: SF Pro Display;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
      color: rgba(0, 0, 0, 0.4);

      img {
        margin-right: 4px;
      }
    }
  }
}

.cell-item {
  width: 100%;
  margin-bottom: 6px;
  background: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
}
</style>
