<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <scroll class="content" ref="scroll" :probe-type="3" :pull-up-load="true" @scroll="contentScroll"
            @pullingUp="loadMore">
      <home-swipe :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control" :titles="titles" @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="showBackTop"></back-top>

  </div>
</template>

<script>

import NavBar from "@/components/content/navbar/NavBar";
import TabControl from "@/components/content/tabcontrol/TabControl";

import RecommendView from "@/views/home/childcomps/RecommendView";
import HomeSwipe from "@/views/home/childcomps/HomeSwipe";
import FeatureView from "@/views/home/childcomps/FeatureView";

import {getHomeMultiData, getHomeGoods} from "@/network/home";
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backtop/BackTop";

export default {
  name: 'Home',
  components: {
    BackTop,
    Scroll,
    GoodsList,
    TabControl,
    FeatureView,
    HomeSwipe,
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
    }
  },
  created() {
    this.getHomeMultiData();

    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },
  methods: {
    /**
     * 事件监听方法
     */
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
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    contentScroll(position) {
      this.showBackTop = (-position.y) > 500
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
      this.$refs.scroll.scroll.refresh();
      this.$refs.scroll.finishPullUp();
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
      });
    }
  }
}
</script>

<style scoped>
#home {
  padding-top: 44px;
  /*ViewPort height*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}

.tab-control {
  position: sticky;
  top: 44px;
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