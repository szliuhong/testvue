<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control" :titles="titles" @tabClick="tabClick" ref="tabControl1" v-show="isTabFixed"/>
    <scroll class="content" ref="scroll" :probe-type="3" :pull-up-load="true" @scroll="contentScroll"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @homeSwiperImageLoad="homeSwiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :class="{fixed: isTabFixed}" :titles="titles" @tabClick="tabClick" ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="showBackTop"></back-top>

  </div>
</template>

<script>

import NavBar from "components/content/navbar/NavBar";
import TabControl from "components/content/tabcontrol/TabControl";

import RecommendView from "views/home/childcomps/RecommendView";
import HomeSwiper from "views/home/childcomps/HomeSwiper";
import FeatureView from "views/home/childcomps/FeatureView";

import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backtop/BackTop";

import {getHomeMultiData, getHomeGoods} from "network/home";
import {debounce} from "common/utils";

export default {
  name: 'Home',
  components: {
    BackTop,
    Scroll,
    GoodsList,
    TabControl,
    FeatureView,
    HomeSwiper,
    RecommendView,
    NavBar
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  data() {
    return {
      recommends: [],
      banners: [],
      titles: ["流行", "新款", "精选"],
      goods: {
        "pop": {list: [], page: 0},
        "new": {list: [], page: 0},
        "sell": {list: [], page: 0},

      },
      currentType: 'pop',
      showBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
    }
  },
  created() {
    this.getHomeMultiData();

    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  mounted() {
    const refresh= debounce(this.$refs.scroll.refresh, 300)

    this.$bus.$on("itemImageLoad", () =>{
      refresh();
    });
  },
  methods: {
    /**
     * 事件监听方法
     */
    homeSwiperImageLoad(){
      this.offsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = 'pop';
          break;
        case 1:
          this.currentType = 'new';
          break;
        case 2:
          this.currentType = 'sell';
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    contentScroll(position) {
      this.showBackTop = (-position.y) > 1000;

      this.isTabFixed = (-position.y) > this.offsetTop;
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
    },


    /**
     * 网络请求相关方法
     */
    getHomeMultiData() {
      getHomeMultiData().then(res => {
        this.banners = res.data.banners;
        this.recommends = res.data.recommends;
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.cloth);
        this.goods[type].page += 1;

        this.$refs.scroll.finishPullUp();
      });
    }
  }
}
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  /*ViewPort height*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}
.tab-control{
  position: relative;
  z-index: 9;
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;

}
</style>