<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <div class="inner icon-remove_circle_outline"></div>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-increase icon-add_circle" @click.stop.prevent="increaseCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    props: {
      food: Object
    },
    methods: {
      // 加号按钮的方法
      increaseCart (event) {
        if (!this.food.count) {
          // Vue给food增加一个数字类型的属性，初始设置为1
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        // 让根组件下的eventHub分发cart.add事件
        this.$root.eventHub.$emit('cart-add', event.target)
      },
      // 减商品数量的方法
      decreaseCart () {
        //  加个if，防止不存在count时点击出现数量负数
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus">
  .cartcontrol
    font-size: 0

    .cart-decrease
      display: inline-block
      padding: 6px

      .inner
        // 给内容滚动 所以必须把inner设为inline-block
        display: inline-block
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)

      &.move-enter, &.move-leave-to
        opacity: 0
        transform: translate3D(24px, 0, 0)

        .inner
          transform: rotate(180deg)

      &.move-enter-active, &.move-leave-active
        transition: all .5s

        .inner
          transition: all .5s

      &.move-enter-to
        opacity: 1

    .cart-count
      display: inline-block
      line-height: 24px
      vertical-align: top
      color: rgb(147, 153, 159)
      padding-top: 6px
      text-align: center
      width: 12px
      font-size: 10px

    .cart-increase
      display: inline-block
      line-height: 24px
      padding: 6px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>
