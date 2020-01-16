<template>
	<div class="text-black">
		<!-- HEADER -->
		<div class="flex flex-wrap overflow-hidden md:mx-1 md:pl-3 mb-1 pb-1 text-sm">
			<AppButton
        v-if="forViewing == true" 
				class="mr-2"
				:label="'Export as PDF'"
				:icon="'cloud-download'"
				@click="exportToPdf()"
			/>
      <AppButton
        v-if="forViewing == true" 
				class="mr-2"
				:label="'Test HTML'"
				:icon="'cloud-download'"
				@click="testHtml()"
			/>
      <AppButton
        v-if="forViewing == true" 
				class="mr-2"
				:label="'Test Export'"
				:icon="'cloud-download'"
				@click="testHubzzInvoice()"
			/>
      <AppButton
        v-if="forViewing == true" 
				class="mr-2"
				:label="'Test Multiple Page'"
				:icon="'cloud-download'"
				@click="testMultiplePage()"
			/>
      <AppButton 
        v-if="forViewing == false" 
        class="m-2"
        :label="'Save and Archive as Final'" 
        :icon="'save-icon'"
        @click="createInvoice()"
      />
      <AppButton
        v-if="forViewing == false"
        class="m-2" 
        :label="'Save as Draft'" 
        :icon="'save-icon'"
      />
			<AppButton
        v-if="forViewing == false"
        class="m-2" 
        :label="'Cancel'" 
        :icon="'save-icon'"
       />
		</div>
		<!-- HEADER ENDS HERE -->

		<!-- BODY -->
		<!-- FIRST PAGE -->
		<AppLoading :loading="loading" spinner :message="'Exporting to PDF'" />
		<div
			id="toPrint"
			class="invoice md:mx-4 max-w-xl h-full flex flex-col justify-between bg-white"
			:class="!doNotShow && 'display'"
		>
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
								<div class="font-semibold">
									<div>To: Accounts Department</div>
									<div class="w-full m-2">
										<p>{{practice.surgery.name}}</p>
                    <div class="mx-2 text-sm font-light">
                      <p>{{practice.surgery.address.line_1}}</p>
                      <p>{{practice.surgery.address.line_2}}</p>
                      <p>{{practice.surgery.address.line_3}}</p>
                    </div>
										
                     <div class="mt-2 flex flex-col">
                      <div>For the period</div>
                      <div>
                        <span>{{dateStart + " to " + dateEnd}}</span>
                      </div>
                    </div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
        <!-- FOR INVOICES -->
				<div v-if="invoiceItems && invoiceItems.length > 0" class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
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
							<div class="w-2/6">
								<div class="text-white text-sm text-right px-4">
									<strong>£Amount</strong>
								</div>
							</div>
							<div v-if="forViewing == false">
								<!-- <div class="mr-2" v-if="doNotShow">
									<span
										@click="addInvoiceItem()"
										class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
									>+</span>
								</div> -->
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
						<div class="flex w-full justify-center border-b border-gray-500 py-1">
							<div v-if="forViewing == false" class="w-2/3 text-sm mx-1">
								<textarea
									v-if="doNotShow"
									v-model="item.description"
									rows="2"
									class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
									placeholder="Enter Description"
								></textarea>
								<p v-else class="text-left px-2 py-1">{{ item.description ? item.description : "No Description" }}</p>
							</div>
							<div v-else class="w-full max-w px-2 py-1">{{item.description}}</div>
							<div class="w-1/3 text-sm mx-1">
								<template v-if="forViewing == false">
									<input
										v-if="doNotShow"
										v-model="item.total"
										class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right"
										:class="!doNotShow && 'pr-3'"
										type="number"
										min="0"
										placeholder="Enter Total"
									/>
								</template>
								<p v-else class="px-2 py-1 text-right text-black">{{ item.total }}</p>
							</div>
							<template v-if="forViewing == false">
								<div class="mr-2 flex items-center" v-if="doNotShow">
									<span
										@click="deductInvoiceItem(item.id)"
										class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
									>-</span>
								</div>
							</template>
						</div>
					</div>
				</div>

        <!-- FOR DISPUTED -->
				<div v-if="disputedItems && disputedItems.length > 0" class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
					<div
						:class="!doNotShow && 'px-4'"
						:ref="'items-header'"
						:style="`min-width: ${doNotShow ? '733px' : ''}`"
					>
						<div class="flex items-center justify-center py-2 bg-black">
							<div class="w-4/6">
								<div class="text-white text-sm text-left px-4">
									<strong>Disputed Job Description</strong>
								</div>
							</div>
							<div class="w-2/6">
								<div class="text-white text-sm text-right px-4">
									<strong>£Amount</strong>
								</div>
							</div>
							<!-- <div v-if="forViewing == false">
								<div class="mr-2" v-if="doNotShow">
									<span
										@click="addInvoiceItem()"
										class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
									>+</span>
								</div>
							</div> -->
						</div>
					</div>
					<div
						v-for="(item, index) in disputedItems"
						:key="`item-${index}`"
						:class="!doNotShow && 'px-4'"
						:ref="`item-${index}`"
						:style="`min-width: ${doNotShow ? '733px' : ''}`"
					>
						<div class="flex w-full justify-center border-b border-gray-500 py-1">
							<div v-if="forViewing == false" class=" w-2/3 text-sm mx-1">
								<textarea
									v-if="doNotShow"
									v-model="item.description"
									rows="2"
									class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
									placeholder="Enter Description"
								></textarea>
								<p v-else class="text-left px-2 py-1">{{ item.description ? item.description : "No Description" }}</p>
							</div>
							<div v-else class="w-full max-w px-2 py-1">{{item.description}}</div>
							<div class="w-1/3 text-sm mx-1">
								<template v-if="forViewing == false">
									<input
										v-if="doNotShow"
										v-model="item.total"
										class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right"
										:class="!doNotShow && 'pr-3'"
										type="number"
										min="0"
										placeholder="Enter Total"
									/>
								</template>
								<p v-else class="px-2 py-1 text-right text-black">{{ item.total }}</p>
							</div>
							<template v-if="forViewing == false">
								<div class="mr-2 flex items-center" v-if="doNotShow">
									<span
										@click="deductDisputedItem(item.id)"
										class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
									>-</span>
								</div>
							</template>
						</div>
					</div>
				</div>
        
        <!-- FOR DEBITS -->
        <div class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
					<div
						:class="!doNotShow && 'px-4'"
						:ref="'items-header'"
						:style="`min-width: ${doNotShow ? '733px' : ''}`"
					>
						<div class="flex items-center justify-center py-2 bg-black">
							<div class="w-4/6">
								<div class="text-white text-sm text-left px-4">
									<strong>Debit Description</strong>
								</div>
							</div>
							<div class="w-2/6">
								<div class="text-white text-sm text-right px-4">
									<strong>£ Amount</strong>
								</div>
							</div>
							<div v-if="forViewing == false">
								<div class="mr-2" v-if="doNotShow">
									<span
										@click="addDebitItem()"
										class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
									>+</span>
								</div>
							</div>
						</div>
					</div>
					<div
						v-for="(item, index) in createdDebitItems"
						:key="`item-${index}`"
						:class="!doNotShow && 'px-4'"
						:ref="`item-${index}`"
						:style="`min-width: ${doNotShow ? '733px' : ''}`"
					>
						<div class="flex w-full justify-center border-b border-gray-500 py-1">
							<div v-if="forViewing == false" class=" w-2/3 text-sm mx-1">
								<textarea
									v-if="doNotShow"
									v-model="item.description"
                  :maxlength="maxChars"
									rows="2"
									class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
									placeholder="Enter Description"
								></textarea>
								<p v-else class="text-left px-2 py-1">{{ item.description ? item.description : "No Description" }}</p>
							</div>
							<div v-else class="w-full max-w px-2 py-1">{{item.description}}</div>
							<div class="w-1/3 text-sm mx-1">
								<template v-if="forViewing == false">
									<input
										v-if="doNotShow"
										v-model="item.total"
										class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right"
										:class="!doNotShow && 'pr-3'"
										type="number"
										min="0"
										placeholder="Enter Total"
									/>
								</template>
								<p v-else class="px-2 py-1 text-right text-md font-semibold">{{ item.total }}</p>
							</div>
							<template v-if="forViewing == false">
								<div class="mr-2 flex items-center" v-if="doNotShow">
									<span
										@click="deductDebitItem(item.id)"
										class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
									>-</span>
								</div>
							</template>
						</div>
					</div>
				</div>

        <!-- FOR CREDITS -->
        <div class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
					<div
						:class="!doNotShow && 'px-4'"
						:ref="'items-header'"
						:style="`min-width: ${doNotShow ? '733px' : ''}`"
					>
						<div class="flex items-center justify-center py-2 bg-black">
							<div class="w-4/6">
								<div class="text-white text-sm text-left px-4">
									<strong>Credit Description</strong>
								</div>
							</div>
							<div class="w-2/6">
								<div class="text-white text-sm text-right px-4">
									<strong>£Amount</strong>
								</div>
							</div>
							<div v-if="forViewing == false">
								<div class="mr-2" v-if="doNotShow">
									<span
										@click="addCreditItem()"
										class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
									>+</span>
								</div>
							</div>
						</div>
					</div>
					<div
						v-for="(item, index) in createdCreditItems"
						:key="`item-${index}`"
						:class="!doNotShow && 'px-4'"
						:ref="`item-${index}`"
						:style="`min-width: ${doNotShow ? '733px' : ''}`"
					>
						<div class="flex w-full justify-center border-b border-gray-500 py-1">
							<div v-if="forViewing == false" class=" w-2/3 text-sm mx-1">
								<textarea
									v-if="doNotShow"
									v-model="item.description"
									rows="2"
									class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
									placeholder="Enter Description"
								></textarea>
								<p v-else class="text-left px-2 py-1">{{ item.description ? item.description : "No Description" }}</p>
							</div>
							<div v-else class="w-full max-w px-2 py-1">{{item.description}}</div>
							<div class="w-1/3 text-sm mx-1">
								<template v-if="forViewing == false">
									<input
										v-if="doNotShow"
										v-model="item.total"
										class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right"
										:class="!doNotShow && 'pr-3'"
										type="number"
										min="0"
										placeholder="Enter Total"
									/>
								</template>
								<p v-else class="px-2 py-1 text-right text-md font-semibold">{{ '- '+item.total }}</p>
							</div>
							<template v-if="forViewing == false">
								<div class="mr-2 flex items-center" v-if="doNotShow">
									<span
										@click="deductCreditItem(item.id)"
										class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
									>-</span>
								</div>
							</template>
						</div>
					</div>
				</div>
        
				<div ref="items-total" class="flex justify-betwen px-4 pt-2">
					<div class="my-1 px-1 w-3/4 font-bold">Total</div>
					<div class="my-1 px-1 w-1/4 text-right text-lg font-semibold">{{ "£ " + amountTotal }}</div>
				</div>
			</div>
			<!-- <div class="p-4" ref="pdf-footer">
				<div class="border-2 border-gray-300 rounded-lg p-2 text-sm">
					Payment by BACS:
					<br />Account name: XXX
					<br />Bank: XXX
					<br />Sort code: XXX
					<br />Account number: XXX
					<br />
				</div>
			</div> -->
		</div>
		<!-- FIRST PAGE ENDS HERE -->
		<!-- BODY ENDS HERE-->
	</div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading";
import AppButton from "@/components/Base/AppButton";
export default {
	props: [
    "forViewing",
    "practice",
    "practiceInvoice",
    "invoiceItems",
    "disputedItems",
    "debitItems",
    "creditItems",
    "dateStart",
    "dateEnd",
    "byLocum"
    ],
	components: {
		AppLoading,
		AppButton,
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

      createdDebitItems: [],
      createdCreditItems: [],
			invoice: {},
			doNotShow: true,
			practices: [],
			chosenPractice: [],
      loading: false,
      
      maxChars: 100
		};
	},
	created() {
    if (this.debitItems) {
      console.log('debit items available', this.debitItems)
      this.createdDebitItems = this.debitItems
    }
    if(this.creditItems) {
      console.log('credit items available', this.creditItems)
      this.createdCreditItems = this.creditItems
    }
	},
	computed: {
		amountTotal: function() {
      let grossSum = 0
      let invoiceItemTotal = 0
      let disputedItemTotal = 0
      let debitTotal = 0 
      let creditTotal = 0
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      
      if(this.invoiceItems && this.invoiceItems.length > 0) {
        let invoiceItems = this.invoiceItems.map(invoiceItem => parseFloat(invoiceItem.total));
        invoiceItemTotal = invoiceItems.reduce(reducer)
      }

      if(this.disputedItems && this.disputedItems.length > 0) {
        let disputedItems = this.disputedItems.map(disputedItem => parseFloat(disputedItem.total))
        disputedItemTotal = disputedItems.reduce(reducer)
      }

      grossSum = parseFloat(invoiceItemTotal + disputedItemTotal);
      
      if (this.createdDebitItems && this.createdDebitItems.length > 0) {
        let createdDebitItems = this.createdDebitItems.map(debitItem => parseFloat(debitItem.total))
        debitTotal = createdDebitItems.reduce(reducer);
      }
      
      if (this.createdCreditItems && this.createdCreditItems.length > 0) {
        let createdCreditItems = this.createdCreditItems.map(creditItem => parseFloat(creditItem.total))
        creditTotal = createdCreditItems.reduce(reducer)
      }
      const netSum = parseFloat((grossSum + debitTotal) - creditTotal).toFixed(2)
      console.log('netsum', netSum)
      return netSum;
		}
	},
	methods: {
     async testHtml() {
      window.open(
        `${process.env.API_URL}/practice-invoices/${this.practiceInvoice.id}/html`
      );
    },
    async testHubzzInvoice() {
      window.open(
        `${process.env.API_URL}/practice-invoices/${this.practiceInvoice.id}/pdf`
      );
    },
    async testMultiplePage() {
      window.open(
        `${process.env.API_URL}/practice-invoices/test/pdf`
      )
    },
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

    async deductDisputedItem(itemId) {
			const mapDisputedItems = this.disputedItems.map(
				disputedItem => disputedItem.id
			);
			await this.disputedItems.splice(mapDisputedItems.indexOf(itemId), 1);
    },
    
    async addDebitItem() {
      const newItem = {
        type: "Debit",
        description: "",
        amount: 0
      }
      newItem.id = this.createdDebitItems.length + 1;
      await this.createdDebitItems.push(newItem)
    },

    async deductDebitItem(itemId) {
			const mapDebitItems = this.createdDebitItems.map(
				debitItem => debitItem.id
			);
			await this.createdDebitItems.splice(mapDebitItems.indexOf(itemId), 1);
    },

    async addCreditItem() {
      const newItem = {
        type: "Credit",
        description: "",
        amount: 0
      }
      newItem.id = this.createdCreditItems.length + 1
      await this.createdCreditItems.push(newItem)
    },

    async deductCreditItem(itemId) {
			const mapCreditItems = this.createdCreditItems.map(
				creditItem => creditItem.id
			);
			await this.createdCreditItems.splice(mapCreditItems.indexOf(itemId), 1);
    },

		async createInvoice() {
     
        this.toPostPracticeInvoice.practice_id = await this.practice.id ? this.practice.id : null
        this.toPostPracticeInvoice.date_start = await this.dateStart ? this.dateStart : null
        this.toPostPracticeInvoice.date_end = await this.dateEnd ? this.dateEnd : null
        this.toPostPracticeInvoice.items = await this.invoiceItems.concat(this.disputedItems,this.createdDebitItems,this.createdCreditItems)
        this.toPostPracticeInvoice.total_amount = await this.amountTotal

        if(this.toPostPracticeInvoice.items.length > 0){
        await this.$axios
          .post(`/api/v1/admin/practice-invoices`, this.toPostPracticeInvoice)
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
              status: "danger",
              text: err.response.data.message
            });
          });
      } else {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: "Items to be invoiced is required"
          });
      }
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
			let totalItemCount = parseInt(this.invoiceItems.length + this.debitItems + this.creditItems)

			for (let i = 0; i < totalItemCount; i++) {
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
	border-left: solid 2px #ffc72c;
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
