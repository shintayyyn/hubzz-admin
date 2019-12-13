<template>
  <div class="relative text-black">
    <!-- HEADER -->
    <div class="flex flex-wrap overflow-hidden md:pl-3 mb-1 pb-1 text-sm">
      <AppButton
        class="mr-2"
        :label="forViewing ? 'Download' : 'Save'"
        :icon="forViewing ? 'cloud-download' : 'save-icon'"
        @click="exportToPdf()"
      />
      <AppButton :label="'Save and Archive as Final'" :icon="'email'" />
    </div>
    <!-- HEADER ENDS HERE -->

    <!-- BODY -->
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
                <AppInput
                  v-if="forViewing == false"
                  class="w-full mr-2"
                  :type="'select'"
                  :name="'addressee'"
                  :label="'To: Accounts Department'"
                  :placeholder="'Select...'"
                  :inClass="'border-gray-400'"
                  :items="[
                    { label: 'Select the Addressee', value: '1' },
                    { label: 'Select the Addressee', value: '2' },
                    { label: 'Select the Addressee', value: '3' }
                  ]"
                />
                <div v-else class="font-semibold">
                  <div>To: Accounts Department</div>
                  <div class="m-2">
                    <p>{{practice.surgery.name}}</p>
                    <p>{{practice.surgery.address.line_1}}</p>
                    <p>{{practice.surgery.address.line_2}}</p>
                    <p>{{practice.surgery.address.line_3}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="forViewing == false" class="py-2">
            <label class="text-sm text-black font-semibold"
              >Choose Practice</label
            >
            <select
              v-model="chosenPractice"
              class="block appearance-none font-bold text-sm w-full bg-white border-b-2 border-gray-500 py-2 leading-tight focus:outline-none"
            >
              <option
                v-for="(practice, index) in practices"
                :key="`practice-${index}`"
                >{{ practice.surgery.name }}</option
              >
            </select>
          </div>
        </div>

        <div class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
          <div
            :class="!doNotShow && 'px-4'"
            :ref="'items-header'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex items-center justify-center py-2 bg-black">
              <div class="w-4/6">
                <div class="text-white text-sm text-left px-4">
                  <strong>Description</strong>
                </div>
              </div>
              <!-- <div class="w-1/6">
                <div class="text-white text-sm text-left">
                <strong>Hours</strong>
                </div>
              </div> -->
              <div class="w-2/6">
                <div class="text-white text-sm text-right px-4">
                  <strong>£Amount</strong>
                </div>
              </div>
              <!-- Add fields -->
              <div v-if="forViewing == false">
                <div class="mr-2" v-if="doNotShow">
                  <span
                    @click="addInvoiceItem()"
                    class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    >+</span
                  >
                </div>
              </div>
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
              <div v-if="forViewing == false" class="w-2/3 text-sm mx-1">
                <textarea
                  v-if="doNotShow"
                  v-model="item.description"
                  rows="2"
                  class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
                  placeholder="Enter Descriptionewqewqewqewqewq"
                ></textarea>
                <p v-else class="px-2 py-1">
                  {{ item.description ? item.description : "No Description" }}
                </p>
              </div>
              <div v-else class="px-2 py-1">
                {{item.description}}
              </div>
              <div class="w-1/3 text-sm mx-1">
                <div v-if="forViewing == false">
                  <input
                  v-if="doNotShow"
                  v-model="item.amount"
                  class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right"
                  :class="!doNotShow && 'pr-3'"
                  type="number"
                  min="0"
                  placeholder="Enter Amount"
                />
                </div>
                
                <p v-else class="px-2 py-1 text-right">{{ item.amount }}</p>
              </div>
              <div v-if="forViewing == false">
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
    <!-- BODY ENDS HERE-->
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading";
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
export default {
  props:["forViewing" ,"practice", "practiceInvoice"],
	components: {
		AppLoading,
		AppButton,
		AppInput
	},
	data() {
		return {
			toPostPracticeInvoice: {
				practice_id: "",
				date_start: "",
				date_end: "",
				items: [],
				total_amount: ""
			},
			invoiceItems: [],
			invoice: {},
			doNotShow: true,
			practices: [],
			chosenPractice: [],
			loading: false
		};
	},
	created(){
    console.log('practiceInvoice', this.practiceInvoice)
    console.log('practice', this.practice)
    const practiceInvoiceItems = this.practiceInvoice.practice_invoice_items
    for(let i = 0; i < practiceInvoiceItems.length ; i++){
        const newItem = {
          job_part_id: practiceInvoiceItems[i].job_part.id,
          description: practiceInvoiceItems[i].description,
          amount: practiceInvoiceItems[i].total
        };
        newItem.id = this.invoiceItems.length + 1;
        this.invoiceItems.push(newItem);
      }
  },
	computed: {
		amountTotal: function() {
			if (this.invoiceItems.length > 0) {
				const reducer = (accumulator, currentValue) =>
					accumulator + currentValue;
				let array = this.invoiceItems.map(invoiceItem =>
					parseFloat(invoiceItem.amount)
				);
				let sum = array.reduce(reducer);
				return sum;
			} else {
				return 0;
			}
		}
	},
	methods: {
		async addInvoiceItem() {
			// deduct 1 when dealing with ID for array
			const newItem = {
				job_part: "",
				description: "",
				hours: "",
				amount: 0
			};
			newItem.id = this.invoiceItems.length + 1;
			await this.invoiceItems.push(newItem);
		},

		async deductInvoiceItem(itemId) {
			const mapInvoiceItems = this.invoiceItems.map(
				invoiceItem => invoiceItem.id
			);
			await this.invoiceItems.splice(mapInvoiceItems.indexOf(itemId), 1);
		},

		async createInvoice() {
			await this.$axios
				.post(`/api/v1/admin/practice-invoices`, {
					practice_id: this.chosenPractice.id,
					date_start: this.toPostPracticeInvoice.date_start,
					data_end: this.toPostPracticeInvoice.date_end,
					items: this.invoiceItems,
					total_amount: this.amountTotal
				})
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Invoice Posted"
					});
				})
				.catch(err => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Invoice Posted"
					});
				});
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
		}
	}
};
</script>
<style>
.display {
	width: 800px;
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
		min-height: 850px;
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
	overflow: hidden auto;
	border-left: solid 2px #FFC72C;
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
