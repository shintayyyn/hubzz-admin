<template>
  <div class="issue-hubzz-invoice-modal p-4 md:p-8 shadow-lg">
    <div class="flex items-center text-sm text-white py-2">
      <div @click="goBack()" class="text-white hover:text-sunglow p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
      </div>
    </div>
    <div class="flex flex-row text-white">
      <div class="mx-2">
        <AppDate
          v-model="toFilter.date_start"
          :name="'date_start'"
          :label="'From'"
        />
      </div>
      <div class="mx-2">
        <AppDate
          v-model="toFilter.date_end"
          :name="'date_end'"
          :label="'To'"
        />
      </div>
      <div @click="chooseJobPartsModal = true">
        <p class="p-2 bg-sunglow font-semibold text-black rounded-lg my-8 cursor-pointer">Go</p>
      </div>
      <div class="mx-2 float-right">
        <div @click="toPostPracticeInvoiceItem()" >
          <p class="p-2 bg-sunglow font-semibold text-black rounded-lg my-8 cursor-pointer">Confirm</p>
        </div>
      </div>
    </div>
    <!-- <div>
      <div
        class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
      >
        <input
          type="checkbox"
          id="disputed"
          value="true"
          v-model="includeDisputed"
        />
        <label for="disputed">Include Disputed Invoices?</label>
      </div>
    </div> -->
    	<!-- FIRST PAGE -->
			<div
				id="toPrint"
				class="invoice md:mx-4 max-w-xl h-full flex flex-col justify-between bg-white"
				:class="!doNotShow && 'display'"
			>
				<AppLoading :loading="loading" spinner :message="'Exporting to PDF'" />
				<div>
					<div class="flex flex-col p-4" ref="pdf-header">
						<div>
							<div class="text-sm text-right">
								<p>Hubzz Limited Mws,</p>
								<p>601 London Road</p>
								<p>Westcliff-On-Sea SS0 9PE</p>
								<p>billing@hubzz.co.uk</p>
								<p>Registered Company</p>
								<p>10832559</p>
							</div>
						</div>
						<div class="flex">
							<div class="w-full md:w-2/3">
								<div
									class="border-2 border-gray-300 rounded-lg p-4 text-sm"
									:class="doNotShow ? 'md:w-2/3' : 'w-2/3'"
								>
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
						</div>
						<div class="py-2 pt-6 px-2">
							<p class="font-semibold">{{practice ? practice.surgery.name : null}}</p>
						</div>
					</div>

					<div
						class="flex flex-col overflow-x-auto"
						:class="doNotShow && 'mx-4'"
					>
						<div
							:class="!doNotShow && 'px-4'"
							:ref="'items-header'"
							:style="`min-width: ${doNotShow ? '733px' : ''}`"
						>
							<div class="flex items-center justify-center py-2 bg-black">
								<div class="w-3/6">
									<div class="text-white text-sm text-left px-4">
										<strong>Description</strong>
									</div>
								</div>
								<div class="w-2/6">
									<div class="text-white text-sm text-left px-2">
										<strong>Job Number</strong>
									</div>
								</div>
								<!-- <div class="w-1/6">
                    <div class="text-white text-sm text-left">
                      <strong>Hours</strong>
                    </div>
                  </div> -->
								<div class="w-2/6">
									<div class="text-white text-sm text-right px-4">
										<strong>£ Amount</strong>
									</div>
								</div>
								<!-- Add fields -->
								<!-- <div class="mr-2" v-if="doNotShow">
									<span
										@click="addInvoiceItem()"
										class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
										>+</span
									>
								</div> -->
							</div>
						</div>
						<div
							v-for="(item, index) in invoiceItems"
							:key="`item-${index}`"
							:class="!doNotShow && 'px-4'"
							:ref="`item-${index}`"
							:style="`min-width: ${doNotShow ? '733px' : ''}`"
						>
							<div
								class="flex w-full justify-center border-b border-gray-500 py-1"
							>
								<div class="w-3/6 text-sm mx-1">
									<textarea
										v-if="doNotShow"
										v-model="item.description"
										rows="2"
										class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
										placeholder="Enter Description"
									></textarea>
									<p v-else class="px-2 py-1">
										{{ item.description ? item.description : "No Description" }}
									</p>
								</div>

								<div class="w-2/6 text-sm mx-1">
									<input
										v-if="doNotShow"
										v-model="item.job_part"
										class="border-b-2 border-gray-300 w-full h-full focus:outline-none px-2"
										placeholder="Job Part Number"
									/>
									<p v-else class="px-2 py-1">
										{{ item.job_part ? item.job_part : "No Job Part Number" }}
									</p>
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
										v-if="doNotShow"
										v-model="item.total"
										class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right"
										:class="!doNotShow && 'pr-3'"
										type="number"
										min="0"
										placeholder="Enter total"
									/>
									<p v-else class="px-2 py-1 text-right">{{ item.total }}</p>
								</div>

								<div class="mr-2 flex items-center" v-if="doNotShow">
									<span
										@click="deductInvoiceItem(item.id)"
										class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
										>-</span
									>
								</div>
							</div>
						</div>
					</div>

					<div ref="items-total" class="flex justify-betwen px-4 pt-2">
						<div class="my-1 px-1 w-3/4 font-bold">Total</div>
						<div class="my-1 px-1 w-1/4 text-right">
							{{ "£ " + amountTotal }}
						</div>
					</div>
				</div>
				<div class="p-4" ref="pdf-footer">
					<div class="border-2 border-gray-300 rounded-lg p-2 text-sm">
						Payment by BACS:
						<br />Account name: XXX <br />Bank: XXX <br />Sort code: XXX
						<br />Account number: XXX
						<br />
					</div>
				</div>
			</div>
			<!-- FIRST PAGE ENDS HERE -->
      <div
        class="issue-hubzz-invoice-shield"
        v-if="chooseJobParts == true"
        @click="chooseJobParts = false"
      ></div>

      <transition name="slide" mode="out-in">
        <div class="choose-job-parts-modal shadow-lg" v-if="chooseJobPartsModal">
          <ChooseJobParts @close="chooseJobPartsModal = false" :filter="toFilter"/>
        </div>
      </transition>
  </div>
</template>
<script>
import AppButton from '@/components/Base/AppButton'
import AppDate from '@/components/Base/AppDate'
import AppLoading from '@/components/Base/AppLoading'
import ChooseJobParts from '@/components/Billings/ChooseJobParts'
export default {
  components:{
    AppButton,
    AppDate,
    AppLoading,
    ChooseJobParts,
  },  
  data(){
    return {
      loading: false,
      chooseJobPartsModal: false,
      includeDisputed: false,
      toFilter:{
        date_start: '',
        date_end: '',
        status: '',
        invoice_status: '',
      },
      practice: '',
      approved_job_parts: '',

      doNotShow: true,
      showHubzzInvoice: false,
      toPostPracticeInvoice: {
				practice_id: '',
				date_start: '',
				date_end: '',
				items: '',
				total_amount: '',
      },
      chosenJobParts: [],
			invoiceItems: [],
    }
  },
  computed: {
		amountTotal: function() {
			if (this.invoiceItems.length > 1) {
				const reducer = (accumulator, currentValue) =>
					accumulator + currentValue;
				let array = this.invoiceItems.map(invoiceItem =>
					parseFloat(invoiceItem.total)
				);
				let sum = parseFloat(array.reduce(reducer));
				return sum;
			} else {
				return 0;
			}
		}
  },
  created(){
    
  },
  async asyncData({app, route, store}) {
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      return{
        practice
      }
    }catch(err){
      console.log('get practice error', err)
    }
  },
  methods:{
    chooseJobPartsModal(){
      this.chooseJobParts = true
    },
    async toGetApprovedJobParts(){
      let params = {
        approved_at_date_start: this.toFilter.date_start,
        approved_at_date_end:this.toFilter.date_end,
        status: 'Approved'
      }
      await this.$axios.$get(`/api/v1/admin/job-parts`,{ params }).then(res => {
        console.log('res', res)
        this.approved_job_parts = res.data.job_parts
      })

      this.chooseJobParts = true
      this.showHubzzInvoice = true 
    },

    async toProcessInvoiceItems(){
      for(let i = 0; i < this.chosenJobParts.length ; i++){
        const newItem = {
          job_part_id: this.chosenJobParts[i].id,
          description: 'Job Number '+this.chosenJobParts[i].job_part_number+
          ' for £'+this.chosenJobParts[i].practice_rate + 
          ' from '+this.chosenJobParts[i].date_start+
          ' to '+this.chosenJobParts[i].date_end,
          hours: this.chosenJobParts[i].final_hours,
          total: parseFloat(this.chosenJobParts[i].final_hours * this.chosenJobParts[i].practice_rate)
        };
        newItem.id = this.invoiceItems.length + 1;
        await this.invoiceItems.push(newItem);

        this.chooseJobParts = false
      }
    },  

    async deductInvoiceItem(itemId) {
			const mapInvoiceItems = this.invoiceItems.map(
				invoiceItem => invoiceItem.id
			);
			await this.invoiceItems.splice(mapInvoiceItems.indexOf(itemId), 1);
    },
    
    async toPostPracticeInvoiceItem(){
      console.log('practice', this.practice.id)
      this.toPostPracticeInvoice.practice_id = this.practice.id,
      this.toPostPracticeInvoice.date_start = this.toFilter.date_start,
      this.toPostPracticeInvoice.date_end = this.toFilter.date_end
      this.toPostPracticeInvoice.items = this.invoiceItems
      this.toPostPracticeInvoice.total_amount = this.amountTotal

      await this.$axios.$post(`/api/v1/admin/practice-invoices`,this.toPostPracticeInvoice)
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Invoice Successfully Created"
          });
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          });
        })
    },

    async exportToPdf() {
			this.doNotShow = false;
			this.loading = true;
			if (process.client) {
				document.body.style.cursor = "wait";
			}

			let doc = this.$jsPDF("p", "mm");
			let pageHeight = 1020;
			let yPosition = 0;

			// PDF HEADER
			const canvasPdfHeader = await this.$html2canvas(this.$refs["pdf-header"]);
			const imgWidthPdfHeader = 205;
			const imgHeightPdfHeader =
				(canvasPdfHeader.height * imgWidthPdfHeader) / canvasPdfHeader.width;
			const imgDataPdfHeader = canvasPdfHeader.toDataURL("image/png");

			pageHeight = pageHeight - this.$refs["pdf-header"].offsetHeight;

			doc.addImage(
				imgDataPdfHeader,
				"PNG",
				2.5,
				yPosition,
				imgWidthPdfHeader,
				imgHeightPdfHeader
			);

			yPosition = yPosition + imgHeightPdfHeader;

			// ITEMS HEADER
			const canvasItemsHeader = await this.$html2canvas(
				this.$refs["items-header"]
			);
			const imgWidthItemsHeader = 205;
			const imgHeightItemsHeader =
				(canvasItemsHeader.height * imgWidthItemsHeader) /
				canvasItemsHeader.width;
			const imgDataItemsHeader = canvasItemsHeader.toDataURL("image/png");

			pageHeight = pageHeight - this.$refs["items-header"].offsetHeight;

			doc.addImage(
				imgDataItemsHeader,
				"PNG",
				2.5,
				yPosition,
				imgWidthItemsHeader,
				imgHeightItemsHeader
			);

			yPosition = yPosition + imgHeightItemsHeader;

			// ITEMS
			let totalJobParts = this.invoiceItems.length;

			for (let i = 0; i < totalJobParts; i++) {
				// minus the current item invoice height to the pageHeight
				pageHeight = pageHeight - this.$refs[`item-${i}`][0].offsetHeight;
				// if all pageHeight is used, add page
				if (pageHeight < 0) {
					pageHeight = 1020;
					yPosition = 0;
					doc.addPage();
					// add header to every new page, also subtract its height to page height
					doc.addImage(
						imgDataItemsHeader,
						"PNG",
						2.5,
						yPosition,
						imgWidthItemsHeader,
						imgHeightItemsHeader
					);

					yPosition = yPosition + imgHeightItemsHeader;

					pageHeight = pageHeight - this.$refs["items-header"].offsetHeight;
					pageHeight = pageHeight - this.$refs[`item-${i}`][0].offsetHeight;
				}

				// draw canvas
				let canvasItem = await this.$html2canvas(this.$refs[`item-${i}`][0]);
				let imgWidthItem = 205;
				let imgHeightItem =
					(canvasItem.height * imgWidthItem) / canvasItem.width;
				let imgDataItem = canvasItem.toDataURL("image/png");

				// add image
				doc.addImage(
					imgDataItem,
					"PNG",
					2.5,
					yPosition,
					imgWidthItem,
					imgHeightItem
				);

				yPosition = yPosition + imgHeightItem;
			}

			// sum up their offsetHeight
			// let daysWorkedOffsetHeight = this.$refs["days-worked"].offsetHeight;
			let itemsTotalOffsetHeight = this.$refs["items-total"].offsetHeight;
			let pdfFooterOffsetHeight = this.$refs["pdf-footer"].offsetHeight;

			let totalOffsetHeight = itemsTotalOffsetHeight + pdfFooterOffsetHeight;

			pageHeight = pageHeight - totalOffsetHeight;

			// DAYS WORKED
			// const canvasDaysWorked = await this.$html2canvas(
			//   this.$refs["days-worked"]
			// );
			// const imgWidthDaysWorked = 205;
			// const imgHeightDaysWorked =
			//   (canvasDaysWorked.height * imgWidthDaysWorked) / canvasDaysWorked.width;
			// const imgDataDaysWorked = canvasDaysWorked.toDataURL("image/png");

			// ITEMS TOTAL
			const canvasItemsTotal = await this.$html2canvas(
				this.$refs["items-total"]
			);
			const imgWidthItemsTotal = 205;
			const imgHeightItemsTotal =
				(canvasItemsTotal.height * imgWidthItemsTotal) / canvasItemsTotal.width;
			const imgDataItemsTotal = canvasItemsTotal.toDataURL("image/png");

			// PDF FOOTER
			const canvasPdfFooter = await this.$html2canvas(this.$refs["pdf-footer"]);
			const imgWidthPdfFooter = 205;
			const imgHeightPdfFooter =
				(canvasPdfFooter.height * imgWidthPdfFooter) / canvasPdfFooter.width;
			const imgDataPdfFooter = canvasPdfFooter.toDataURL("image/png");

			if (pageHeight < 0) {
				pageHeight = 1020;
				doc.addPage();
			}

			yPosition = 290 - (imgHeightItemsTotal + imgHeightPdfFooter);

			doc.addImage(
				imgDataItemsTotal,
				"PNG",
				2.5,
				yPosition,
				imgWidthItemsTotal,
				imgHeightItemsTotal
			);

			yPosition = yPosition + imgHeightItemsTotal;

			doc.addImage(
				imgDataPdfFooter,
				"PNG",
				2.5,
				yPosition,
				imgWidthPdfFooter,
				imgHeightPdfFooter
			);

			yPosition = yPosition + imgHeightPdfFooter;

			this.doNotShow = true;
			doc.save("sample.pdf");
			this.loading = false;
			if (process.client) {
				document.body.style.cursor = "auto";
			}
			console.log("height used", pageHeight);
    },
    
    file() {
			// this.html2canvas(document.querySelector("#toPrint")).then(canvas => {
			//   const image = canvas.toDataURL("image/png")
			//   doc.addImage(image,'PNG',1,1);
			//   doc.save("sample.pdf")
			// })
			this.$html2canvas(document.querySelector("#toPrint")).then(canvas => {
				// Max 9 for entire first page
				// Max 12 to fill first page with record
				// doc.addImage(image,'PNG',1,1);
				console.log(canvas);
				const doc = this.$jsPDF("p", "mm", "a4");
				var imgWidth = 205;
				var pageHeight = 297;
				console.log("dimensions", canvas.height, imgWidth, canvas.width);
				console.log("canvas", canvas.height, canvas, canvas.width);
				var imgHeight = (canvas.height * imgWidth) / canvas.width;
				var heightLeft = imgHeight;
				var position = 0;
				let imgData = canvas.toDataURL("image/png");

				console.log("ig", imgWidth);

				while (heightLeft >= 0) {
					if (this.invoiceItems.length <= 10) {
						position = heightLeft - imgHeight;
						console.log("ig", position, imgWidth / 2);
						doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
						heightLeft -= pageHeight;
						doc.addPage();
					} else if (this.invoiceItems.length >= 10) {
						position = heightLeft - imgHeight;
						doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
						position = heightLeft - imgHeight + 50;
						heightLeft -= pageHeight;
						doc.addPage();
					}
				}
				doc.save("sample.pdf");
			});
    },
    
    goBack(){
      const query = {
        ...this.$route.query
      }
      this.$router.push({path:`/billings/${this.$route.params.id}/hubzz-invoices`,query})
    },
  }
}
</script>

<style>
.card {
	min-width: 100px;
	height: 250px;
	box-sizing: content-box;
}
.issue-hubzz-invoice-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.choose-job-parts-modal,
.issue-hubzz-invoice-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px #FFC72C;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.issue-hubzz-invoice-modal {
		width: 70%;
	}
  .choose-job-parts-modal {
    width: 60%;
  }
}
</style>