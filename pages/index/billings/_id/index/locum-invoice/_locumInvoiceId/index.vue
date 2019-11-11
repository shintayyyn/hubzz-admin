<template>
  <div class="locum-invoice-modal p-4 md:p-8 shadow-lg">
    <div class="flex items-center text-sm text-white py-2">
      <div @click="goBack()" class="text-white hover:text-sunglow p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
      </div>
    </div>
     <div class="max-w-2xl">
        <div class="flex items-center text-white py-2">
          <p>Invoice Number: <span class="font-bold">0000000001</span></p>
          <p class="px-3 py-1 mx-2 rounded text-black bg-green-300 uppercase font-bold">Paid</p>
        </div>
        <embed class="object-contain object-top w-full h-full document" src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"/>
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return{
      locum: '',
    }
  },
  async asyncData({ app, route, store }){
    try{
      // let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.locumInvoiceId}`)
      // const locum = response.data.data.locum
      console.log('this is the "invoice" id:',route.params.locumInvoiceId)
      return{
        locum
      }
    }catch(err){
      console.log('Get locum invoice error!', err)
    }
  },
  methods:{
    goBack(){
      const query = {
        ...this.$route.query
      }
      this.$router.push({path:`/billings/${this.$route.params.id}`,query})
    },
  }

}
</script>
<style>
 .locum-invoice-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.locum-invoice-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px yellow;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .locum-invoice-modal {
    width: 70%;
  }
}
.document {
  width: 100%;
  min-height: 50vh;
}

@media screen and (min-width: 768px) {
  .document {
    min-height: 80vh;
  }
}
</style>