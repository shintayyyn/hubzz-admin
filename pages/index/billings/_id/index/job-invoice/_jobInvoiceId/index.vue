<template>
  <div class="locum-invoice-modal p-4 md:p-8 shadow-lg">
    <div class="flex items-center text-sm text-white py-2">
      <div @click="goBack()" class="text-white hover:text-sunglow p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
      </div>
    </div>
    <div @click="file()" class="p-4 w-1/4 bg-orange-500">
      test
    </div>

    <div id="toPrint" ref="content" class="md:m-4">
      <div class="invoice flex flex-col bg-white p-4">
        <div class="flex flex-wrap overflow-hidden">
          <div class="px-1 w-3/5 overflow-hidden">
            <!-- Column Content -->
          </div>
          <div class="mb-2 px-1 w-full sm:w-2/5 overflow-hidden">
            <p class="text-sm text-right">
              Hubzz Limited
              Mws, 601 London Road
              Westcliff-On-Sea SS0 9PE
              billing@hubzz.co.uk
              Registered Company 10832559
            </p>
          </div>
        </div>
        <div class="flex flex-wrap overflow-hidden">
          <div class="my-1 px-1 w-2/3 overflow-hidden">
            <div class="border-2 border-gray-300 rounded-lg p-4 text-sm">
              <div class="pb-2">To: Accounts Department</div>
              <select
                class="block appearance-none font-bold w-full bg-white border-b-2 border-gray-300 hover:border-gray py-2 leading-tight focus:outline-none"
              >
                <option>Select the Practice for this Invoice</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
          <div class="my-1 px-1 w-1/3 overflow-hidden">
            <div class="text-sm float-right text-right content-end">
              <strong>INVOICE</strong>
              <br />Not yet issued
            </div>
          </div>
        </div>
        <div class="flex flex-wrap overflow-hidden">
          <div class="my-1 px-1 w-full overflow-hidden">
            <select
              class="block appearance-none font-bold text-sm w-full bg-white border-b-2 border-gray-300 hover:border-gray py-2 leading-tight focus:outline-none"
            >
              <option>Select the Practice for this Invoice</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>

          <div class="my-1 px-1 w-full overflow-hidden">
            <div class="flex flex-col border-b border-gray-400 pb-2">
              <!--HEADER-->
              <div class="flex items-center justify-center py-2 bg-black">
                <div class="w-2/3">
                  <div class="text-white text-sm text-left px-4">
                    <strong>Description</strong>
                  </div>
                </div>
                <div class="w-1/3">
                  <div class="text-white text-sm text-center">
                    <strong>Total</strong>
                  </div>
                </div>
                <div class="mr-2">
                  <span class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white">+</span>
                </div>
              </div>
              <!--HEADER-->
              <div class="flex justify-center py-1">
                <div class="w-2/3 text-sm mx-1">
                  <textarea class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1" placeholder="Enter Description"></textarea>
                </div>
                <div class="w-1/3 text-sm mx-1">
                  <input class="border-b-2 border-gray-300 w-full h-full focus:outline-none" type="number" placeholder="Enter Amount"/>
                </div>
                <div class="mr-2 flex items-center">
                  <span class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white">-</span>
                </div>
              </div>
              <div class="flex justify-center py-1">
                <div class="w-2/3 text-sm mx-1">
                  <textarea class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1" placeholder="Enter Description"></textarea>
                </div>
                <div class="w-1/3 text-sm mx-1">
                  <input class="border-b-2 border-gray-300 w-full h-full focus:outline-none" type="number" placeholder="Enter Amount"/>
                </div>
                <div class="mr-2 flex items-center">
                  <span class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white">-</span>
                </div>
              </div>
            </div>
          </div>
          <div class="my-1 px-1 w-full overflow-hidden">
            <div class="flex flex-wrap">
              <div class="my-1 px-1 w-2/3 font-bold">Total</div>
              <div class="my-1 px-1 w-1/3 text-right">£1200</div>
            </div>
          </div>
        </div>
        <div class="border-2 border-gray-300 rounded-lg p-2 text-sm">
          Payment by BACS:
          <br />Account name: XXX
          <br />Bank: XXX
          <br />Sort code: XXX
          <br />Account number: XXX
          <br />
        </div>
      </div>
    </div>
    <!-- <div ref="content" class="max-w-2xl">
      <div class="flex items-center text-white py-2">
        <p>Invoice Number: <span class="font-bold">0000000001</span></p>
        <p class="px-3 py-1 mx-2 rounded text-black bg-green-300 uppercase font-bold">Paid</p>
      </div>
      <embed class="object-contain object-top w-full h-full document" src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"/>
    </div> -->
  </div>
</template>
<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import 'jspdf-autotable';
export default {
  data () {
    return{
    }
  },
  async asyncData({ app, route, store }){
    try{
      // let response = await app.$axios.$get(`/api/v1/admin/locum-users/${route.params.locumInvoiceId}`)
      // const locum = response.data.locum
      console.log('this is the "invoice" id:',route.params.jobInvoiceId)
      return{
        locum
      }
    }catch(err){
      console.log('Get locum invoice error!', err)
    }
  },
  methods:{
    createFile(){
      return{}
      const jsPDF = require('jspdf');
        require('jspdf-autotable');
        let doc = new jsPDF
        doc.text('Hello world!', 10, 10)
    },  
    file(){
      const doc = new jsPDF();
      html2canvas(document.querySelector("#toPrint")).then(canvas => {
        const image = canvas.toDataURL("image/png")
        doc.addImage(image,'PNG',20,20);
        doc.save("sample.pdf")
      })
    },
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