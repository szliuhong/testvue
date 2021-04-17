<template>
  <div>
    <detail-nav-bar :trade-item-id="tradeItemId"/>
  </div>
</template>

<script>

import DetailNavBar from "views/detail/childComps/DetailNavBar";
export default {
  name: "Detail",
  components: {
    DetailNavBar,
  },
  data() {
    return {
      tradeItemId: null
    }
  },
  created() {
    this.tradeItemId = this.$route.params.tradeItemId;
  }
}
</script>

<style scoped>

</style>