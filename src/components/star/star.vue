<template>
  <!--  初始整个star评分的样式star，及获取starType的属性-->
  <div class="star" :class="starType">
    <!--    循环星星的数组，把数组里的每颗星星取出来-->
    <span v-for="(itemClass,index) in itemClasses"
          :class="itemClass" :key="index" class="star-item"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  // 星星的个数
  const LENGTH = 5
  // 全星类
  const CLA_ON = 'on'
  // 半星类
  const CLA_HALF = 'half'
  // 无星类
  const CLA_OFF = 'off'
  export default {
    // 接收父组件的传值
    props: {
      // 图片尺寸和评分
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    // 计算属性计算出来starType，决定应该使用的图片尺寸
    computed: {
      starType () {
        return 'star-' + this.size
      },
      itemClasses () {
        // 盛放最终星星的数组
        let result = []
        // 四舍五入的算法
        let score = Math.floor(this.score * 2) / 2
        // 全星的个数
        let integerScore = Math.floor(score)
        // 判断得到的结果是否有小数
        let hasDecimal = score % 1 !== 0
        // 把整星放进去
        for (let i = 0; i < integerScore; i++) {
          result.push(CLA_ON)
        }
        // 把半星放进去
        if (hasDecimal) {
          result.push(CLA_HALF)
        }
        // 把无星放进去
        while (result.length < LENGTH) {
          result.push(CLA_OFF)
        }
        return result
      }
    }
  }

</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .star
    font-size: 0

    .star-item
      display: inline-block
      background-repeat: no-repeat

    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px

        &:last-child
          margin-right: 0

        &.on
          bg-image('star48_on')

        &.half
          bg-image('star48_half')

        &.off
          bg-image('star48_off')

    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px

        &:last-child
          margin-right: 0

        &.on
          bg-image('star36_on')

        &.half
          bg-image('star36_half')

        &.off
          bg-image('star36_off')

    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px

        &:last-child
          margin-right: 0

        &.on
          bg-image('star24_on')

        &.half
          bg-image('star24_half')

        &.off
          bg-image('star24_off')
</style>
