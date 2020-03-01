<template>
  <div class="goods">
    <!--    商品列表部分-->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}"
            @click="selMenu(index)" :key="index">
          <span class="text border-1px">
            <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!--    商品内容部分-->
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <!--循环遍历出mock数据中的所有商品信息-->
        <li v-for="(item,index) in goods" class="food-list-hook" :class="{'current':currentIndex === index}"
            :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <!--循环遍历单个商品中的商品信息-->
            <li v-for="(food,index) in item.foods" class="food-item border-1px" @click="selectFood(food)"
                :key=" index
          ">
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="content">
                <h2>{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old"
                                                                  v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <Shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :minPrice="seller.minPrice"
              :select-foods="selectFoods"></Shopcart>
    <Food :food="selectedFood" ref="food"></Food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Shopcart from '../shopcart/shopcart'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import Food from '../food/food'
  const axios = require('axios')
  export default {
    data () {
      return {
        goods: [],
        seller: {},
        // 所有商品的高度
        listHeight: [],
        // 滚动出去的高度
        scrollY: 0,
        // 传给商品详情页的参数，表示该商品
        selectedFood: {}
      }
    },
    computed: {
      // 计算出当前位置落在哪个空间
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      // 返回已选商品
      selectFoods () {
        let foods = []
        // 遍历商品
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            // 如果此商品有数量，即表示被选择
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    methods: {
      // 初始化BScroll实例
      _initScroll () {
        // 获取需要滚动的DOM
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          // better-scroll默认是阻止浏览器的行为，这里开放click事件
          click: true
        })
        this.foodScroll = new BScroll(this.$refs.foodWrapper, {
          // 传入的参数表示实时监测滚动的位置
          // 打开本区域的点击事件监听
          click: true,
          probeType: 3
        })
        this.foodScroll.on('scroll', (pos) => {
          // 拿到实时的y坐标
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight () {
        // 拿到所有商品DOM
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        // 计算所有商品的高度
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      // 滚动到相应商品区间
      selMenu (index) {
        // 拿到所有商品DOM
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
        // 找到当前被点击的DOM
        let el = foodList[index]
        // 调用better-scroll的接口实现滚动,滚动300ms
        this.foodScroll.scrollToElement(el, 300)
      },
      // 单个商品详情页传递参数
      selectFood (food) {
        this.selectedFood = food
        this.$refs.food.show()
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special']
      axios.get('http://47.98.33.246:18082')
        .then((response) => {
          this.goods = response.data.goods
          this.seller = response.data.seller
          this.$nextTick(() => {
              // 初始化better_scroll
              this._initScroll()
              // 计算所有商品高度
              this._calculateHeight()
            }
          )
        }).catch(function (error) { // 请求失败处理
        // console.log(error)
        throw new Error(error)
      })
      //  监听来自子组件的事件
      this.$root.eventHub.$on('cart-add', el => {
        this.$nextTick(() => {
          this.$refs.shopcart.drop(el)
        })
      })
    },
    components: {
      Shopcart,
      cartcontrol,
      Food
    }
  }
</script>

<style rel="stylesheet/stylus" lang="stylus">
  @import "../../common/stylus/mixins.styl"
  @import "../../common/stylus/icon.css"
  @import "../../common/stylus/_base.styl"
  .goods
    position: absolute
    top: 174px
    bottom: 46px
    display: flex
    width: 100%
    overflow: hidden

    .menu-wrapper
      width: 80px
      background: #f3f5f7
      flex: 0 0 80px

      .menu-item
        display: table
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;

        &.current
          position: relative
          margin-top: -1px
          z-index: 10
          background: #fff
          font-weight: 1700

          .text
            border-none()

        .text
          display: table-cell
          width: 56px
          font-size: 12px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))

          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 2px
            background-size: 12px 12px
            background-repeat: no-repeat

            &.decrease
              bg-image('decrease_3')

            &.discount
              bg-image('discount_3')

            &.guarantee
              bg-image('guarantee_3')

            &.invoice
              bg-image('invoice_3')

            &.special
              bg-image('special_3')

    .foods-wrapper
      flex: 1

      .title
        padding-left: 14px
        border-left: 2px solid #d9dde1
        line-height: 26px
        height: 26px
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7

      .food-item
        padding-bottom: 18px
        margin: 18px
        display: flex
        border-1px(rgba(7, 17, 27, 0.1))

        &:last-child
          border-none()
          /*清除让改分类最后一个商品的pd,不然会和下一个分类的mtop有个过大间距*/
          padding-bottom: 18px

        .icon
          flex: 0 0 57px
          margin-right: 10px

      .content
        flex: 1

        .name
          font-size: 14px
          color: rgb(7, 17, 27)
          font-weight: 700
          line-height: 28px
          margin: 2px 0 8px

        .extra
        .desc
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)

        .desc
          margin: 8px 0

        .price
          font-weight: 700
          line-height: 24px

          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)

          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)

        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 8px
</style>
