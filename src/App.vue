<template>
  <div id="app">
    <router-view/>
    <main-tab-bar/>
  </div>
</template>

<style>
  @import "~assets/css/base.css";
</style>

<script>
  import MainTabBar from "@/components/content/MainTabBar";

  export default {
    components: {
      MainTabBar,

    }
  }
</script>