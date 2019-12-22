<template>
	<div class="issue-hubzz-invoice-modal p-4 md:p-8 shadow-lg">
		<div class="flex items-center text-sm text-white py-2">
			<div>
				<svgicon
					name="arrow-left-solid"
					height="32"
					width="32"
					class="fill-current text-white hover:text-sunglow p-1 cursor-pointer"
					@click="goBack()"
				/>
			</div>
		</div>
		<section class="max-w-lg">
			<div class="flex flex-col md:flex-row justify-between md:items-center text-white">
				<div class="w-full flex flex-col items-start md:flex-row md:items-center mx-2">
					<AppDate
						class="w-full md:w-1/2 md:mx-2"
						v-model="toFilter.approved_at_date_start"
						:name="'approved_at_date_start'"
						:label="'From'"
					/>
					<AppDate
						class="w-full md:w-1/2 md:mx-2"
						v-model="toFilter.approved_at_date_end"
						:name="'approved_at_date_end'"
						:label="'To'"
					/>
					<div class="w-full flex justify-between items-center mb-2">
						<AppButton :label="'Go'" @click="chooseJobPartsModal = true" />
						<div class="flex flex-col md:justify-center p-1 md:p-2 align-middle text-white leading-none">
							<input type="checkbox" id="disputed" value="true" v-model="includeDisputed" />
							<label for="disputed">Show Disputed Invoices</label>
						</div>
					</div>
				</div>

				<!-- <div class="mx-2 float-right">
				<div @click="toPostPracticeInvoiceItem()">
					<p class="p-2 bg-sunglow font-semibold text-black rounded-lg md:my-8 cursor-pointer">Confirm</p>
				</div>
				</div>-->
			</div>
			<HubzzInvoice :forViewing="false" :practice="practice" />
			<div
				class="issue-hubzz-invoice-shield"
				v-if="chooseJobPartsModal == true"
				@click="chooseJobPartsModal = false"
			></div>
		</section>
		<transition name="slide" mode="out-in">
			<div class="choose-job-parts-modal shadow-lg" v-if="chooseJobPartsModal">
				<ChooseJobParts
					:filter="toFilter"
					:includeDisputed="includeDisputed"
					@close="chooseJobPartsModal = false"
					@chosenJobParts="toProcessInvoiceItems"
				/>
			</div>
		</transition>
	</div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppDate from "@/components/Base/AppDate";
import AppLoading from "@/components/Base/AppLoading";
import HubzzInvoice from "@/components/Billings/HubzzInvoice";
import ChooseJobParts from "@/components/Billings/ChooseJobParts";
export default {
	components: {
		AppButton,
		AppDate,
		AppLoading,
		HubzzInvoice,
		ChooseJobParts
	},
	data() {
		return {
			loading: false,
			chooseJobPartsModal: false,
			includeDisputed: false,

			toFilter: {
				viewing_practice_id: this.$route.params.id,
				approved_at_date_start: "",
				approved_at_date_end: "",
				status: "",
				invoice_status: this.includeDisputed == true ? "Disputed" : null
			},

			practice: "",
			approved_job_parts: "",

			doNotShow: true,
			showHubzzInvoice: false,
			toPostPracticeInvoice: {
				practice_id: "",
				date_start: "",
				date_end: "",
				items: "",
				total_amount: ""
			},
			chosenJobParts: [],
			invoiceItems: []
		};
	},
	computed: {
		amountTotal: function() {
			if (this.invoiceItems.length > 0) {
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
	created() {
		this.toFilter.approved_at_date_start = this.$moment();
		this.toFilter.approved_at_date_end = this.$moment();
	},
	async asyncData({ app, route, store }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			);
			const practice = response.data.practice;
			return {
				practice
			};
		} catch (err) {
			console.log("get practice error", err);
		}
	},
	methods: {
		toProcessInvoiceItems(chosenJobParts) {
			console.table("asd", chosenJobParts);
			this.chooseJobPartsModal = false;
			for (let i = 0; i < chosenJobParts.length; i++) {
				const newItem = {
					job_part_id: chosenJobParts[i].id,
					description:
						"Job Number " +
						chosenJobParts[i].job_part_number +
						" for £" +
						chosenJobParts[i].practice_rate +
						" from " +
						chosenJobParts[i].date_start +
						" to " +
						chosenJobParts[i].date_end,
					hours: chosenJobParts[i].final_hours,
					total: parseFloat(
						chosenJobParts[i].final_hours * chosenJobParts[i].practice_rate
					)
				};
				newItem.id = this.invoiceItems.length + 1;
				this.invoiceItems.push(newItem);

				this.chooseJobPartsModal = false;
			}
		},

		async deductInvoiceItem(itemId) {
			const mapInvoiceItems = this.invoiceItems.map(
				invoiceItem => invoiceItem.id
			);
			await this.invoiceItems.splice(mapInvoiceItems.indexOf(itemId), 1);
		},

		async toPostPracticeInvoiceItem() {
			console.log("practice", this.practice.id);
			(this.toPostPracticeInvoice.practice_id = this.practice.id),
				(this.toPostPracticeInvoice.date_start = this.toFilter.approved_at_date_start),
				(this.toPostPracticeInvoice.date_end = this.toFilter.approved_at_date_end),
				(this.toPostPracticeInvoice.items = this.invoiceItems);
			this.toPostPracticeInvoice.total_amount = this.amountTotal;

			await this.$axios
				.$post(`/api/v1/admin/practice-invoices`, this.toPostPracticeInvoice)
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
		},

		goBack() {
			const query = {
				...this.$route.query
			};
			this.$router.push({
				path: `/billings/${this.$route.params.id}/hubzz-invoices`,
				query
			});
		}
	}
};
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
	border-left: solid 2px #ffc72c;
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