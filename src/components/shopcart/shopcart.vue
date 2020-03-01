<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'light-high': totalCount>0}">
              <i class="icon-shopping_cart" :class="{'light-high': totalCount>0}"></i>
              <div class="num" v-show="totalCount>0">{{totalCount}}</div>
            </div>
          </div>
          <div class="price" :class="{'light-high':totalCount>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        // 结算
        <div class="content-right">
          // stop.prevent阻止事件冒泡
          <div class="pay" :class="payClass" @click.stop.prevent="pay">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <template v-for="ball in balls">
          <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter"
                      :key="ball.__ob__.dep.id">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </template>
      </div>
      <transition name="fold">
        <!--      购物车详情页-->
        <div class="shopcart-list" v-show="fold">
          <!--      购物车详情页头部-->
          <div class="list-head">
            <h1 class="list-title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <!--      购物车详情页内容区域-->
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food border-1px" v-for="(food,index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">￥{{food.price * food.count}}</div>
                <div class="cartcontrol-wrapper">
                  <Cartcontrol :food="food"></Cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--  背景遮罩层-->
    <transition name="fade">
      <div class="list-mask" v-show="fold" @click="hideMask"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Cartcontrol from '../cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'

  export default {
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        // 管理小球状态
        dropBalls: [],
        // 折叠状态.初始false表示折叠
        fold: false,
        test: 'test之前'
      }
    },
    props: {
      // goods组件传过来，里面盛放的是被选择的商品的信息
      selectFoods: {
        type: Array,
        default () {
          return [{}]
        }
      },
      deliveryPrice: Number,
      minPrice: Number
    },
    computed: {
      // 选择的商品数量
      totalCount () {
        let count = 0
        this.selectFoods.forEach((foods) => {
          count += foods.count
        })
        return count
      },
      // 商品总价
      totalPrice () {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      // 计算是否可以结算
      payDesc () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}起送`
        } else {
          return `去结算`
        }
      },
      // 控制结算按钮的样式
      payClass () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      }
    },
    watch: {
      // fold的状态跟totalCount密切相关，所以这里监测totalCount
      totalCount: function () {
        // 没有商品就不显示
        if (!this.totalCount) {
          // false表示不显示
          this.fold = false
          return false
        }
      },
      // fold: function (totalCount) {
      fold: function () {
        let show = this.fold
        // 不折叠的时候
        if (show) {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent,
              {
                click: true
              }
            )
          } else {
            this.scroll.refresh()
          }
        }
        return show
      }
    },
    methods: {
      // 结算方法
      pay () {
        if (this.totalPrice < this.minPrice) {
          /*eslint-disable*/
          return
        } else {
          alert(`支付${this.totalPrice}元`)
        }
      },
      // 隐藏遮罩层
      hideMask () {
        this.fold = false
      },
      // 清空购物车
      empty () {
        // 遍历所有已选中的商品，置count为0
        this.selectFoods.forEach((food) => {
          food.count = 0
        })
      },
      toggleList () {
        if (!this.totalCount) {
          return true
        }
        this.fold = !this.fold
      },
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          // 找到不显示的小球，把小球显示出来
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            // 把显示的小球添加到数组管理
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeEnter (el) {
        let count = this.dropBalls.length
        // 找到显示的小球
        while (count--) {
          let ball = this.dropBalls[count]
          if (ball.show) {
            // 拿到当前“+”按钮相对于视口的位置
            let rect = ball.el.getBoundingClientRect()
            // x方向需要移动的距离
            let x = rect.left - 32
            // y方向需要移动的距离
            let y = rect.top - window.innerHeight + 22
            el.style.display = ''
            // 开始设置初始小球所在的位置
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
            el.style.transform = `translate3D(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
            inner.style.transform = `translate3D(${x}px,0,0)`
          }
        }
      },
      enter (el) {
        // 浏览器重绘（即某些元素的样式重新绘制）
        // 让beforeEnter的元素恢复原样
        /* eslint-disable no-unused-vars */
        let ref = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)'
          el.style.transform = 'translate3D(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0, 0, 0)'
          inner.style.transform = 'translate3D(0,0,0)'
        })
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
    },
    components: {
      Cartcontrol
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixins.styl"
  .shopcart
    width: 100%
    height: 48px
    z-index: 50
    position: fixed
    left: 0
    bottom: 0

    .content
      display: flex
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      background: #141d27

      .content-left
        flex: 1

        .logo-wrapper
          margin: 0 18px
          padding: 6px
          display: inline-block
          vertical-align: top
          width: 56px
          height: 56px
          border-radius: 50%
          background: #141d27
          position: relative
          top: -10px
          box-sizing: border-box

          .logo
            width: 100%
            height: 100%
            background: #2b343c
            border-radius: 50%
            text-align: center

            &.light-high
              background-color: rgb(0, 160, 220)

            .num
              position: absolute
              top: 0
              right: 0
              font-size: 9px
              font-weight: 700
              color: #fff
              background-color: rgb(240, 20, 20)
              box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.4)
              line-height: 16px
              width: 24px
              height: 16px
              border-radius: 16px
              text-align: center

              &.light-high
                color: #fff

            .icon-shopping_cart
              color: #80858a
              font-size: 24px
              line-height: 44px

              &.light-high
                color: #fff

        .price
          display: inline-block
          vertical-align: center
          line-height: 24px;
          margin-top: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          padding-right: 12px
          font-size: 16px
          font-weight: 700

          &.light-high
            color: #fff

        .desc
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin: 12px 0 0 12px
          font-size: 10px

      .content-right
        flex: 0 0 105px
        width: 105px

        .pay
          text-align: center
          line-height: 48px
          font-weight: 700
          font-size: 12px

          &.not-enough
            background: #2b333b

          &.enough
            background: #00b43c
            color: #fff

    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200

        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)

        &.drop-enter-active
          transition: all .4s cubic-bezier(.49, -0.29, .75, .41)

          .inner
            transition: all .4s

    .shopcart-list
      position: absolute
      transform: translate3d(0, -100%, 0)
      z-index: -1
      left: 0
      top: 0
      width: 100%

      &.fold-enter, &.fold-leave-to
        transform: translate3d(0, 100%, 0)

      &.fold-enter-to
        transform: translate3d(0, -100%, 0)

      &.fold-enter-active, &.fold-leave-active
        transition: all .5s

      .list-head
        line-height: 40px
        background: #f3f5f7
        padding: 0 18px
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        height: 40px

        .list-title
          float: left
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
          line-height: 40px

        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
          line-height: 40px

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff

        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, .1))

          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)

          .price
            position: absolute
            right: 90px
            bottom: 12px
            font-size: 14px
            color: rgb(240, 20, 20)
            font-weight: 700
            line-height: 24px

          .cartcontrol-wrapper
            position: absolute
            bottom: 6px
            right: 0

  .list-mask
    position: fixed
    left: 0
    top: 0
    z-index: 40
    width: 100%
    height: 100%
    background: rgba(1, 17, 27, 0.6)
    backdrop-filter: blur(1px)

    &.fade-enter, &.fade-leave-to
      opacity: 0

    &.fade-enter-active, &.fade-leave-active
      transition: all .5s

    &.fade-enter-to
      opacity: 1
</style>
