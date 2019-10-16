<template>
  <div class="billing-modal p-4 md:p-8 shadow-lg">
      <AddInvoice/>
  </div>
</template>

<script>
import AddInvoice from '@/components/Billings/AddInvoice'
export default {
  components:{
    AddInvoice
  },
  async asyncData({ app, route }) {
    try {
    } catch (err) {
      console.log("index qualifications index create asyncData err", err);
    }
  },

  data() {
    return {
      name: ""
    };
  }
};
</script>
<style>
  .invoice{
    width: 100%;
  }
  @media(min-width: 480px){
    .right-side-header-content{
      width: calc(100% - 0px);
    }
  }
  .page-overlap{
    min-width: 100%;
  }
  @media screen and (min-width: 768px){
    .page-overlap{
    min-width: calc(100% - 70px);
    }
    .invoice{
      width: 550px;
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      min-width: calc(100% - 200px);
    }
  }
</style>