<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swipe :banners="banners"/>
    <recommend-view :recommends="recommends"/>
    <feature-view/>
    <tab-control class="tab-control" :titles="titles" @tabClick="tabClick"/>
    <goods-list :goods="showGoods"/>

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

export default {
  name: 'Home',
  components: {
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
        "pop": {list: []},
        "new": {list: []},
        "sell": {list: []},
      },
      currentType: 'pop',
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
      getHomeGoods(type).then(res => {
             console.log(res.cloth);
             this.goods[type].list.push(...res.cloth);
          }
      )
    }
  }
}
</script>

<style scoped>
  #home {
    padding-top: 44px;
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

</style>