<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <!--      标题-->
      <div class="over-view">
        <h1 class="title">{{seller.name}}</h1>
        <!--        评星-->
        <div class="desc">
          <Star :size="36" :score="seller.score"></Star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <!--        起送价-->
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <!--        收藏-->
        <div class="favorite">
          <i class="icon-favorite" :class="{'active':favorite}" @click="toggleFavorite"></i>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <!--      公告-->
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <!--          公告内容-->
        <div class="content-wrapper">
          <p class="text">{{seller.bulletin}}</p>
        </div>
        <!--          满减优惠-->
        <ul v-if="seller.supports" class="supports">
          <li v-for="(item,index) in seller.supports" class="support-item" :key="index">
            <span class="icon" :class="classMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <Split></Split>
      <div class="pic">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(item,index) in seller.pics" :key="index">
              <img :src="item" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <Split></Split>
      <!--      商家信息-->
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul v-for="(item,index) in seller.infos" :key="index" class="info-item">
          <li class="text">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Star from '../star/star'
  import Split from '../split/split'
  import BScroll from 'better-scroll'
  import {saveToLocal, loadFromLocal} from '@/common/js/store'

  export default {
    props: {
      seller: Object
    },
    data () {
      return {
        favorite: (() => {
          // 如果本地有这个店家的数据就返回id或者key,否则返回false
          return loadFromLocal(this.seller.id, 'favorite', false)
        })()
      }
    },
    methods: {
      // 来回切换收藏
      toggleFavorite () {
        this.favorite = !this.favorite
        // 点击收藏时要把id及key保存到本地
        saveToLocal(this.seller.id, 'favorite', this.favorite)
      }
    },
    computed: {
      favoriteText () {
        return this.favorite ? '已收藏' : '收藏'
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    mounted () {
      this.scroll = new BScroll(this.$refs.seller, {
        click: true
      })
      // 横向滚动商家图片
      if (this.seller.pics) {
        // 单张图片高度
        let picWidth = 120
        // 图片间距
        let margin = 6
        // 商家图片的总宽度(包括间隙)
        let width = this.seller.pics.length * (picWidth + margin) - margin
        // 设置商家图片ul总宽度，如果不设置的话，ul的宽度就是100%，滑动之后会反弹
        this.$refs.picList.style.width = width + 'px'
        this.picScroll = new BScroll(this.$refs.picWrapper, {
          scrollX: true,
          eventPassThrough: 'vertical'
        })
      }
    },
    components: {
      Star,
      Split
    }
  }
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixins"
  @import "../../common/stylus/icon.css"
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden

    .over-view
      padding: 18px
      position: relative

      .title
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)

      .desc
        margin-top: 8px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, .1))

        .star
          display: inline-block
          vertical-align: top

        .text
          vertical-align: top
          line-height: 18px
          margin-left: 12px
          font-size: 10px

      .remark
        display: flex
        padding-top: 18px

      .favorite
        position: absolute
        text-align: center
        width: 50px
        top: 18px
        right: 11px

        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9

          &.active
            color: rgb(240, 20, 20)

        .text
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 93)

        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, .1)

          &:last-child
            border: none

          h2
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
            margin-bottom: 4px

          .content
            margin-top: 4px
            font-size: 10px

            .stress
              line-height: 24px
              font-size: 24px
              color: rgb(7, 17, 27)
              font-weight: 200

    .bulletin
      padding: 18px 18px 0

      .title
        font-weight: 300
        margin-bottom: 8px

      .content-wrapper
        padding: 0 12px 16px
        border-1px(rgba(7, 17, 27, .1))

        .text
          line-height: 24px
          font-size: 12px
          color: rgb(2410, 20, 20)
          font-weight: 200

      .supports

        .support-item
          padding: 16px 12px
          border-1px(rgba(7, 17, 27, .1))

          &:last-child
            border-none()

        .icon
          border-right: 6px
          // 设置为inline-block才可以设置宽高
          display: inline-block
          vertical-align: top
          background-repeat: no-repeat
          background-size: 16px 16px
          height: 16px
          width: 16px

          &.decrease
            bg-image('decrease_4')

          &.discount
            bg-image('discount_4')

          &.guarantee
            bg-image('guarantee_4')

          &.invoice
            bg-image('invoice_4')

          &.special
            bg-image('special_4')

        .text
          vertical-align: top
          line-height: 16px
          font-weight: 200
          color: rgb(7, 17, 27)
          font-size: 12px

    .pic
      padding: 18px 0 18px 18px

      .title
        margin-bottom: 12px

      .pic-wrapper
        overflow: hidden
        white-space: nowrap
        width: 100%

        .pic-list
          font-size: 0

          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px

            &.last-child
              margin-right: 0

    .info
      padding: 18px 18px 0 18px
      color: rgb(7, 17, 27)

      .title
        padding-bottom: 8px
        line-height: 14px
        font-weight: 500
        font-size: 14px
        border-1px(rgba(7, 17, 27, .1))

      .info-item
        padding: 16px 12px
        line-height: 16px
        color: rgb(7, 17, 27)
        font-size: 12px
        font-weight: 200
        border-1px(rgba(7, 17, 27, .1))

</style>
