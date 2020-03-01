<template>
  <div class="header">
    <div class="content-warpper">
      <!--      头像部分-->
      <div class="avatar">
        <img :src="this.seller.avatar" width="64" height="64">
      </div>
      <div class="content">
        <!--        标题-->
        <div class="title">
          <!--          标题的icon-->
          <span class="brand"></span>
          <!--          标题内容-->
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!--        满减优惠部分-->
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <!--      5个-->
      <div v-if="seller.supports" class="support-content">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <!--    公告部分-->
    <div class="bulletin" @click="showDetail">
      <!--        下面这段不分行是为了去掉换行出现的空白字体-->
      <span class="bulletion-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <!--    整个头部的虚幻背景-->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
      <!--    展开商品优惠详情页的事件控制 初始使用v-show控制不显示-->
      <div v-show="detailShow" class="detail">
        <!--商品优惠详情页-->
        <!--    此处使用clearfix来清除浮动-->
        <div class="detail-wrapper clearfix">
          <!--      详情页的内容区域-->
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="starWrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <!--  小标题-->
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <!--优惠信息-->
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <!--          商家公告-->
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin-title">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <!--      关闭此页的开关-->
        <div class="detail-close" @click="hideDetail()">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star'
  // import seller from '@/components/seller/seller'

  export default {
    props: {
      seller: Object
    },
    data () {
      return {
        detailShow: false
      }
    },
    methods: {
      showDetail () {
        this.detailShow = true
      },
      hideDetail () {
        this.detailShow = false
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
    },
    components: {
      star
    }
  }
</script>

<style rel="stylesheet/scss" lang="stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  @import "../../common/stylus/icon.css"
  @import "../../common/stylus/_base.styl"
  .header
    position: relative
    background: rgba(7, 17, 27, 0.5)
    color: #fff

    .content-warpper
      position: relative
      padding: 24px 12px 18px 24px
      font-size: 0

      .avatar
        display: inline-block

        img
          border-radius: 2px

      .content
        display: inline-block
        font-size: 16px
        margin-left: 16px

        .title
          margin: 2px 0 8px 0

          .brand
            width: 30px
            height: 18px
            display: inline-block
            bg-image("brand")
            background-size: 30px 18px
            background-repeat: no-repeat
            vertical-align: top

            .name
              font-size: 16px
              color: rgb(255, 255, 255)
              font-weight: bold
              line-height: 18px

        .description
          font-size: 12px
          color: rgb(255, 255, 255)
          font-weight: 200
          line-height: 12px
          margin-bottom: 10px

        .support
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 4px
            background-size: 12px 12px
            background-repeat: no-repeat

            &.decrease
              bg-image('decrease_1')

            &.discount
              bg-image('discount_1')

            &.guarantee
              bg-image('guarantee_1')

            &.invoice
              bg-image('invoice_1')

            &.special
              bg-image('special_1')

          .text
            font-size: 10px
            color: #fff
            font-weight: 200
            line-height: 12px
            margin-bottom: 6px
            vertical-align: top

      .support-content
        position: absolute
        height: 24px
        right: 12px
        padding: 0px 8px
        line-height: 24px
        bottom: 14px
        background: rgba(0, 0, 0, 0.2)
        border-radius: 14px
        text-align: center

        .count
          font-size: 10px
          color: #fff
          vertical-align: top

        .icon-keyboard_arrow_right
          margin-left: 2px
          line-height: 24px
          font-size: 12px

    .bulletin
      height: 28px
      padding: 0 22px 0 12px
      background-color: rgba(7, 17, 27, 0.2)
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis /* 为了去除html换行带来的空白字体，会把字体设置为0
      但是此处为了让超出的部分显示"..."，这次不能设置字体大小为0*/
      /*font-size: 0*/
      position: relative

      .bulletion-title
        width: 22px
        height: 12px
        display: inline-block
        margin-top: 8px
        bg-image("bulletin")
        background-size: 22px 12px
        background-repeat: no-repeat
        vertical-align: top

      .bulletin-text
        font-size: 10px
        color: #fff
        margin: 0 4px
        font-weight: 200
        line-height: 28px
        vertical-align: top

      .icon-keyboard_arrow_right
        position: absolute;
        font-size: 15px;
        right: 6px;
        top: 6px;

    .background
      position: absolute
      left: 0
      // 背景优先级比正常的低
      z-index: -1
      //让背景虚化
      filter: blur(10px)
      width: 100%
      height: 100%
      top: 0

    .detail
      width: 100%
      height: 100%
      top: 0
      left: 0
      position: fixed
      //超出部分自动滑动
      overflow: auto
      z-index: 100
      background: rgba(7, 17, 27, .8)

      /*离开过程和进入时间都是花费0.5秒*/

      &.fade-enter-active, &.fade-leave-active
        transition: opacity .5s

      // 离开过程中的透明度为0，离开过程花费0.5秒，产生过渡效果

      &.fade-enter, &.fade-leave-active
        opacity: 0

  .detail-wrapper
    width: 100%
    //让内容区域最小高度100%
    min-height: 100%

    .detail-main
      margin-top: 64px
      //给关闭按钮预留64px位置
      padding-bottom: 64px

      .name
        line-height: 16px
        font-size: 16px
        text-align: center
        font-weight: 700

      .starWrapper
        margin-top: 18px
        text-align: center
        padding: 2px 0

      .title
        display: flex
        width: 80%
        margin: 28px auto 24px

        .line
          flex: 1
          position: relative
          top: -6px
          border-bottom: 1px solid rgba(255, 255, 255, 0.2)

        .text
          padding: 0 12px
          font-weight: 700
          font-size: 14px

      .supports
        margin: 0 auto
        width: 80%

        .support-item
          padding: 0 12px
          margin-bottom: 12px
          font-size: 0

          &:last-child
            margin-bottom: 0

          .icon
            display: inline-block
            width: 16px
            height: 16px
            vert-align: top
            margin-right: 6px
            background-size: 16px 16px
            background-repeat: no-repeat

            &.decrease
              bg-image('decrease_2')

            &.discount
              bg-image('discount_2')

            &.guarantee
              bg-image('guarantee_2')

            &.invoice
              bg-image('invoice_2')

            &.special
              bg-image('special_2')

          .text
            font-size: 12px
            line-height: 16px

      .bulletin-title
        width: 80%
        margin: 0 auto

        .content
          line-height: 24px
          color: #fff
          padding: 0 12px
          font-size: 12px

  .detail-close
    //把关闭按钮往上提64px
    margin: -64px auto 0
    clear: both
    position: relative
    height: 32px
    width: 32px
    font-size: 32px
</style>
