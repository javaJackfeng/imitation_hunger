<template>
  <div id="app">
    <v-header :seller='seller'></v-header>
     <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" :ratings="ratings" :seller="seller">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller" :seller="seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from './components/header/header'
const axios =require('axios')
export default {
  data() {
    return {
      seller:{},
      ratings:[]
    }
  },
  components:{
    'v-header':header
  },
  created() {
    // axios.get('/mock/data.json').then(res=>{
    //   let data=res.data
    //   this.seller=data.seller
    // }).catch(err=>{ 
    //   console.log(err)
    // })
     axios.get('http://47.98.33.246:18082').then(res=>{
      let data=res.data
      this.seller=data.seller
    }).catch(err=>{ 
      throw new Error(err)
    })
  },
}
</script>
<style rel="stylesheet/stylus" lang="stylus">
  @import "common/stylus/mixins.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))

    .tab-item
      flex: 1
      text-align: center

      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)

        &.active
          color: rgb(240, 20, 20)
</style>