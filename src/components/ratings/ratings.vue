<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <!--        评价左半部分-->
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <!--        评价右半部分-->
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <Star :size="36" :score="seller.serviceScore"></Star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <Star :size="36" :score="seller.foodScore"></Star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <Split></Split>
      <RatingSelect :selectType="selectType" :onlyContent="onlyContent"
                    :ratings="this.ratings"></RatingSelect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="(rating,index) in ratings" class="rating-item" :key="index"
              v-show="needShow(rating.rateType, rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-if="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-if="rating.recommend && rating.recommend.length">
                <i class="icon-thumb_up"></i>
                <span v-for="(item,index) in rating.recommend" class="item" :key="index">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Star from '../star/star'
  import BScroll from 'better-scroll'
  import {formatDate} from '../../common/js/date'
  import Split from '../split/split'
  import RatingSelect from '../ratingselect/ratingselect'
  const axios = require('axios')
  const ALL = 2
  export default {
    props: {
      // 商家信息
      seller: {}
    },
    data () {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: false
      }
    },
    created () {
      axios.get('http://47.98.33.246:18082')
      // 正确的请求方法
        .then(response => {
          let data = response.data
          this.ratings = data.ratings
        })
        .catch(function (error) { // 请求失败处理
          // console.log(error)
          throw new Error(error)
        })
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        })
      })
      // 监听子组件的事件，改变商品评价类型
      this.$root.eventHub.$on('selectTypeChange', type => {
        this.selectType = type
      })
      // 监听子组件的事件，来回切换只读有内容的评论
      this.$root.eventHub.$on('onlyContentChange', onlyContent => {
        this.onlyContent = onlyContent
      })
    },
    methods: {
      select (type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
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
    components: {
      Star,
      Split,
      RatingSelect
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixins"
  .ratings
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden

    .overview
      display: flex
      padding: 18px 0

      .overview-left
        flex: 0 0 137px
        // 为了兼容性问题，这里写死width
        width: 137px
        padding: 6px 0
        text-align: center
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        // 兼容小设备尺寸
        @midia only screen and(max-width:320px)
        flex: 0 0 115px
        width: 115px

        .score
          line-height: 28px
          margin-bottom: 6px
          font-size: 24px
          color: rgb(265, 153, 0)

        .title
          margin-bottom: 8px
          font-size: 12px
          color: rgb(7, 17, 27)
          line-height: 12px

        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(7, 17, 27)

      .overview-right
        flex: 1
        padding: 0 0 0 24px
        @midia only screen and(max-width:320px)
        padding-left: 6px

        .score-wrapper
          margin-bottom: 8px

          .title
            display: inline-block
            font-size: 12px
            color: rgb(7, 17, 27)
            line-height: 18px

          .star
            display: inline-block
            vertical-align: top
            margin: 0 12px

          .score
            display: inline-block
            font-size: 12px
            color: rgb(255, 153, 0)
            line-height: 18px

        .delivery-wrapper
          .title
            font-size: 12px
            color: rgb(7, 17, 27)

          .time
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)

    .rating-wrapper
      padding: 0 18px

      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7, 17, 27, 0.1))

        .avatar
          flex: 0 0 28px
          margin-right: 12px
          width: 28px

          img
            border-radius: 50%

        .content
          flex: 1
          position: relative

          .name
            font-size: 10px
            color: rgb(7, 17, 27)
            line-height: 12px

          .star-wrapper
            margin-top: 4px

            .star
              display: inline-block
              vertical-align: top

            .delivery
              display: inline-block
              vertical-align: top
              margin-left: 6px
              font-size: 10px
              font-weight: 200
              color: rgb(147, 153, 159)
              line-height: 12px

          .text
            margin-top: 6px
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)

          .recommend
            margin-top: 8px

            .icon-thumb_up
              line-height: 16px
              font-size: 12px
              color: rgb(0, 160, 220)

            .item
              margin-left: 8px
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              background: #fff
              font-size: 9px
              color: rgb(147, 153, 159)
              line-height: 18px

          .time
            position: absolute
            right: 0
            top: 0
            line-height: 12px
            font-size: 10px
            font-weight: 200
            color: rgb(147, 153, 159)
</style>
