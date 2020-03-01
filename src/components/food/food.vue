<template>
  <div v-show="showFlag" class="food" ref="food">
    <div class="food-content">
      <div class="image-header">
        <img :src="food.image" alt="">
        <div class="back" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="new">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
        </div>
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food"></cartcontrol>
        </div>
        <!--        加入购物车-->
        <div class="buy" v-show="!food.count||food.count===0" @click="addFirst">加入购物车</div>
      </div>
      <split></split>
      <div class="info" v-show="food.info">
        <h1 class="title">商品介绍</h1>
        <div class="text">{{food.info}}</div>
      </div>
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc"
                      :ratings="food.ratings"></ratingselect>
      </div>
      <div class="rating-wrapper">
        <ul v-show="food.ratings && food.ratings.length">
          <!--           此处显示根据选项卡的选择来显示;-->
          <li v-for="rating in food.ratings" v-show="needShow(rating.rateType,rating.text)" :key="rating.rateTime"
              class="rating-item">
            <div class="user">
              <span class="name">{{rating.username}}</span>
              <img :src="rating.avatar" alt="" class="avatar" width="12" height="12">
            </div>
            <div class="rate-time">{{ rating.rateTime | formatDate }}</div>
            <div class="text">
              <span
                :class="{'icon-thumb_up':rating.rateType ===0 ,'icon-thumb_down':rating.rateType === 1 }"></span>
              {{rating.text}}
            </div>
          </li>
        </ul>
        <div v-show="!food.ratings||!food.ratings.length">暂无评价</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../cartcontrol/cartcontrol'
  import {formatDate} from '../../common/js/date'
  import Vue from 'vue'
  import split from '../split/split'
  import BScroll from 'better-scroll'
  import ratingselect from '../ratingselect/ratingselect'

  /*eslint-disable*/
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  export default {
    props: {
      food: Object
    },
    data () {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    methods: {
      show () {
        this.showFlag = true
        // 保证在DOM渲染完再创建better-scroll
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              // 打开点击事件，不然在better-scroll点击无反应
              click: true
            })
          }
        })
      },
      hide () {
        this.showFlag = false
      },
      addFirst () {
        Vue.set(this.food, 'count', 1)
      },
      // 根据选项卡切换评论区的内容
      needShow (type, text) {
        // 当点击只显示有内容发评论时，但是全部都是无内容就不显示
        if (this.onlyContent && !text) {
          return false
        }
        // 选项卡为全部,rateType里无2（ALL）
        if (this.selectType === ALL) {
          return true
        } else {
          // 根据li的ratingType来判断是否显示
          return type === this.selectType
        }
      }
    },
    filters: {
      formatDate (time) {
        // 把传进来的值转化为一个date对象
        let date = new Date(time)
        // 通过打印可以看到已经成功转换为日期对象了
        // console.log(date)
        // 返回格式化好的日期
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    created () {
      // 监听子组件的事件，改变商品评价类型
      this.$root.eventHub.$on('selectTypeChange', type => {
        this.selectType = type
      })
      // 监听子组件的事件，来回切换只读有内容的评论
      this.$root.eventHub.$on('onlyContentChange', onlyContent => {
        this.onlyContent = onlyContent
      })
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/icon.css"
  @import "../../common/stylus/mixins.styl"
  .food
    position: fixed
    z-index: 30
    width: 100%
    left: 0
    top: 0
    bottom: 48px
    background: #fff

    .food-content
      .image-header
        position: relative
        width: 100%
        // 高度设为0不影响，因为padding-top会撑开高度
        height: 0
        // padding-top：100%会相对于宽度计算，这样的目的是让图片宽高一样
        padding-top: 100%

        img
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%

        .back
          position: absolute
          top: 10px
          left: 0

          .icon-arrow_lift
            display: block
            padding: 10px
            font-size: 20px
            color: #fff

      .content
        padding: 18px
        position: relative

        .title
          margin-bottom: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
          line-height: 14px

        .detail
          margin-bottom: 18px
          line-height: 10px
          height: 10px
          color: rgb(147, 153, 159)
          font-size: 0

          .sell-count, .rating
            font-size: 10px

          .sell-count
            margin-right: 12px

        .price
          line-height: 24px
          font-weight: 700

          .new
            color: rgb(240, 20, 20)
            font-size: 14px

          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
            margin-left: 8px

        .cartcontrol-wrapper
          position: absolute
          right: 12px
          bottom: 12px

        .buy
          position: absolute
          right: 18px
          bottom: 18px
          height: 24px
          z-index: 10
          line-height: 24px
          padding: 0 12px
          border-radius: 12px
          background: rgb(0, 160, 220)
          color: #fff
          font-size: 10px

      .info
        padding: 18px

        .title
          line-height: 14px
          margin-bottom: 6px
          font-size: 14px
          color: rgb(7, 17, 27)

        .text
          line-height: 24px
          padding: 0 8px
          font-size: 12px
          font-weight: 200
          color: rgb(77, 85, 93)

      .rating
        padding-top: 18px

        .title
          line-height: 14px
          margin-left: 18px
          font-size: 14px
          color: rgb(7, 17, 27)

      .rating-wrapper
        padding: 0 18px

        .rating-item
          position: relative
          padding: 16px 0
          border-1px(rgba(7, 17, 27, 0.1))

          .user
            position: absolute
            top: 16px
            right: 0

            .name
              font-size: 10px
              color: rgb(147, 153, 159)
              line-height: 12px
              margin-right: 6px

          .rate-time
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 12px

          .text
            margin-top: 6px
            font-size: 12px

            .icon-thumb_down, .icon-thumb_down
              margin-right: 4px
              line-height: 24px

            .icon-thumb_down
              color: rgb(147, 153, 159)

            .icon-thumb_up
              color: rgb(0, 160, 220)

</style>
