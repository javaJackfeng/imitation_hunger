<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span @click="select(2)" class="block positive" :class="{'active':SelectType === 2}">{{desc.all}} <span
        class="count">{{ratings.length}}</span> </span>
      <span @click="select(0)" class="block positive" :class="{'active':SelectType === 0}">{{desc.positive}}<span
        class="count">{{getPositive.length}}</span> </span>
      <span @click="select(1)" class="block negative" :class="{'active':SelectType === 1}">{{desc.negative}}<span
        class="count">{{getNegative.length}}</span> </span>
    </div>
    <div class="switch">
      <i @click="toggleContent" class="icon-check_circle" :class="{'on':OnlyContent}"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 表示选项卡的三种状态
  /*eslint-disable*/
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  export default {
    // 接收来自父组件的参数
    props: {
      // 选项卡的文字内容
      selectType: {
        type: Number,
        default: ALL
      },
      // 是否只读有内容的评论
      onlyContent: {
        type: Boolean,
        default () {
          return false
        }
      },
      // 商品评价选项卡
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      },
      // 商品评论内容
      ratings: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        // 父组件传过来的值，子组件要进行处理，这个变量是一个中间值
        SelectType: this.selectType,
        OnlyContent: this.onlyContent
      }
    },
    methods: {
      // 改变选项卡的类型
      select (type) {
        this.SelectType = type
        // 通知父组件改变选项卡状态
        this.$root.eventHub.$emit('selectTypeChange', type)
      },
      // 来回切换只看内容评论
      toggleContent () {
        this.OnlyContent = !this.OnlyContent
        // 通知父组件切换只看的状态
        this.$root.eventHub.$emit('onlyContentChange', this.OnlyContent)
      }
    },
    computed: {
      // 过滤得到有内容的评论
      getPositive () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      getNegative () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/icon.css"
  @import "../../common/stylus/mixins.styl"
  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      font-size: 0
      border-1px(rgba(7, 17, 27, .1))

      .block
        display: inline-block
        margin-right: 8px
        line-height: 16px
        font-size: 12px
        padding: 8px 12px
        color: rgb(77, 85, 93)
        border-radius: 2px

        &.active
          color: #fff

        &.positive
          background-color: rgba(0, 160, 220, .2)

          &.active
            background-color: rgb(0, 160, 220)

        &.negative
          background-color: rgba(77, 85, 93, .2)

        &.active
          background-color: rgb(77, 85, 93)


  .switch
    padding: 12px 18px
    line-height: 24px
    color: rgb(147, 153, 159)
    font-size: 0
    border-1px(rgb(147, 153, 159))

    .icon-check_circle
      vertical-align: top
      font-size: 24px
      margin-right: 4px

      &.on
        color: #00c850

    .text
      vertical-align: top
      font-size: 12px
</style>
