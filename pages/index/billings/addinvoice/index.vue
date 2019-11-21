<template>
  <div class="billing-modal p-4 md:p-8 shadow-lg">
    <div>
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/billings" class="text-white pb-2">
          <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current focus:outline-none" />
        </nuxt-link>
      </div>
      <!-- HEADER -->
        <div class="flex flex-wrap overflow-hidden md:pl-4 mb-1">
          <div class="px-1">
            <button
            @click="file()"
              class="inline-flex items-center py-2 px-4 my-1 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow focus:outline-none"
            >
              <svgicon name="save-icon" width="21" height="21" color="transparent black"></svgicon>
              <span class="pl-1">Save Changes</span>
            </button>
          </div>

          <div class="px-1">
            <button
              class="inline-flex items-center py-2 px-4 my-1 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow"
            >
              <svgicon name="email" width="21" height="21" color="black"></svgicon>
              <span class="pl-1">Save and Archive as Final</span>
            </button>
          </div>
        </div>
      <!-- HEADER ENDS HERE -->

      <!-- BODY -->
        <!-- FIRST PAGE -->
          <div id='toPrint' class="md:m-4 max-w-xl flex flex-col bg-white p-4">
            <!-- ADDRESS  -->
            <div class="flex justify-end verflow-hidden"> 
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

            <!-- SELECT ADDRESSEE??? -->
            <div class="flex flex-wrap overflow-hidden">
              <div class="my-1 px-1 w-2/3 overflow-hidden">
                <div class="border-2 border-gray-300 rounded-lg p-4 text-sm">
                  <div class="pb-2">To: Accounts Department</div>
                  <select
                    class="block appearance-none font-bold w-full bg-white border-b-2 border-gray-300 hover:border-gray py-2 leading-tight focus:outline-none"
                  >
                    <option>Select the Addressee</option>
                    <option>Select the Addressee</option>
                    <option>Select the Addressee</option>
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
              <!-- Choose Practice -->
              <div class="my-1 px-1 w-full overflow-hidden">
                <p class="text-sm text-black font-semibold mx-2">
                  Choose Practice
                </p>
                <select
                  v-model="chosenPractice"
                  class="block appearance-none font-bold text-sm w-full bg-white border-b-2 border-gray-500 py-2 leading-tight focus:outline-none"
                >
                  <option
                    v-for="(practice, index) in practices"
                    :key="`practice-${index}`"
                  >{{practice.surgery.name}}</option>
                </select>
              </div>

              <!-- List -->
              <div class="my-1 px-1 w-full overflow-hidden">
                <div class="flex flex-col border-b border-gray-400 pb-2">
                  <!--HEADER-->
                  <div class="flex items-center justify-center py-2 bg-black">
                    <div class="w-3/6">
                      <div class="text-white text-sm text-left px-4">
                        <strong>Description</strong>
                      </div>
                    </div>
                    <div class="w-2/6">
                      <div class="text-white text-sm text-left">
                        <strong>Job Number</strong>
                      </div>
                    </div>
                    <!-- <div class="w-1/6">
                      <div class="text-white text-sm text-left">
                        <strong>Hours</strong>
                      </div>
                    </div> -->
                    <div class="w-2/6">
                      <div class="text-white text-sm text-left">
                        <strong>Amount</strong>
                      </div>
                    </div>
                    <!-- Add fields -->
                    <div class="mr-2">
                      <span
                        @click="addInvoiceItem()" 
                        class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white">+</span>
                    </div>
                  </div>
                  <!--HEADER ENDS HERE-->
                  <!-- Invoice items -->
                  <div 
                    v-for="(item, index) in invoiceItems"
                    :key="`item-${index}`"
                  >
                    <div class="flex w-full justify-center py-1">
                      
                      <div class="w-3/6 text-sm mx-1">
                        <textarea 
                          v-model="item.description"
                          rows = "2"
                          maxlength="45"
                          class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1" 
                          placeholder="Enter Description"></textarea>
                      </div>

                      <div class="w-2/6 text-sm mx-1">
                        <input 
                          v-model="item.job_part"
                          class="border-b-2 border-gray-300 w-full h-full focus:outline-none" 
                          placeholder="Job Part Number"/>
                      </div>

                      <!-- <div class="w-2/6 text-sm mx-1">
                        <input 
                          v-model="item.hours"
                          class="border-b-2 border-gray-300 w-full h-full focus:outline-none" 
                          type="number"
                          placeholder="Hours"/>
                      </div> -->

                      <div class="w-2/6 text-sm mx-1">
                        <input 
                          v-model="item.amount"
                          class="border-b-2 border-gray-300 w-full h-full focus:outline-none" 
                          type="number" 
                          placeholder="Enter Amount"/>
                      </div>

                      <div class="mr-2 flex items-center">
                        <span
                        @click="deductInvoiceItem(item.id)"
                        class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white">-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- TOTAL / FOOTER (ANCHOR THIS ALONG WITH TOTAL THING BELOW) -->
            <div>
              <div class="my-1 px-1 w-full overflow-hidden">
                <div class="flex flex-wrap">
                  <div class="my-1 px-1 w-3/4 font-bold">Total</div>
                  <div class="my-1 px-1 w-1/4 text-left">{{'£ ' + amountTotal}}</div>
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
        <!-- FIRST PAGE ENDS HERE -->
      <!-- BODY ENDS HERE-->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toPostPracticeInvoice:{
        practice_id: '',
        date_start: '',
        date_end:'',
        items: [],
        total_amount: ''
      },
      invoiceItems:[{
        id: 1,
        job_part: '',
        description: '',
        hours: '',
        amount: 0,
      },],
      invoice: {

      },
      doNotShow: true,
      practices:[],
      chosenPractice: '',
    }
  },
  async asyncData({ app, route, store }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/practices`)
      const practices = response.data.data.practices

      return{
        practices
      }
    } catch (err) {
      console.log("index qualifications index create asyncData err", err);
    }
  },
  computed: {
    amountTotal: function () {
      if(this.invoiceItems.length > 1){
        const reducer = (accumulator, currentValue) => accumulator + currentValue
        let array = this.invoiceItems.map(invoiceItem => parseFloat(invoiceItem.amount))
        let sum = array.reduce(reducer)
        return sum
      }else{
        return 0
      }
    }
  },
  methods:{
    async addInvoiceItem(){
      // deduct 1 when dealing with ID for array
      console.log('it workds')
      const newItem = {
        job_part: '',
        description: '',
        hours: '',
        amount: 0,
      }
      newItem.id = this.invoiceItems.length + 1
      await this.invoiceItems.push(newItem)
    },

    async deductInvoiceItem(itemId){
      const mapInvoiceItems = this.invoiceItems.map(invoiceItem => invoiceItem.id)
      await this.invoiceItems.splice(mapInvoiceItems.indexOf(itemId),1)
    },

    async createInvoice(){
      await this.$axios.post(`/api/v1/admin/practice-invoices`,{
        practice_id: this.chosenPractice.id,
        date_start: this.toPostPracticeInvoice.date_start,
        data_end:this.toPostPracticeInvoice.date_end,
        items: this.invoiceItems,
        total_amount: this.amountTotal,
      }).then(res => {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: "Invoice Posted"
        });
      }).catch(err => { 
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: "Invoice Posted"
        });
      }) 
      
    },

    file(){
      // this.html2canvas(document.querySelector("#toPrint")).then(canvas => {
      //   const image = canvas.toDataURL("image/png")
      //   doc.addImage(image,'PNG',1,1);
      //   doc.save("sample.pdf")
      // })
      this.$html2canvas(document.querySelector("#toPrint")).then(canvas => {
        // Max 9 for entire first page 
        // Max 12 to fill first page with record
        // doc.addImage(image,'PNG',1,1);
        console.log(canvas)
        const doc = this.$jsPDF('p', 'mm', 'a4')
        var imgWidth = 210 ; 
        var pageHeight = 297;  
        console.log("dimensions", canvas.height, imgWidth, canvas.width)
        console.log("canvas", canvas.height, canvas, canvas.width)
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var position = 0;
        let imgData = canvas.toDataURL("image/png")
        
        console.log("ig", imgWidth)

        while (heightLeft >= 0) {
          if( this.invoiceItems.length <= 10 ) {
            position = heightLeft - imgHeight;
            console.log("ig", position, imgWidth / 2)
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            doc.addPage()
          }
          else if( this.invoiceItems.length >= 10 ) {
            position = heightLeft - imgHeight
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            position = (heightLeft - imgHeight) + 50;
            heightLeft -= pageHeight;
            doc.addPage()
          }
          
        }
        doc.save("sample.pdf")
      })
    },
  },
  
};
</script>
<style>
.invoice {
  width: 100%;
}
@media (min-width: 480px) {
  .right-side-header-content {
    width: calc(100% - 0px);
  }
}
.page-overlap {
  min-width: 100%;
}
@media screen and (min-width: 768px) {
  .page-overlap {
    min-width: calc(100% - 70px);
  }
  .invoice {
    max-width: 800px;
  }
}

@media screen and (min-width: 1200px) {
  .page-overlap {
    min-width: calc(100% - 200px);
  }
}

.billing-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px yellow;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .billing-modal {
    width: 80%;
  }
}
.billing-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
</style>
