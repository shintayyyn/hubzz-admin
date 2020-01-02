<template>
	<div class="billing-modal shadow-lg p-4 md:p-8">
		<div @click="$router.go(-1)" class="cursor-pointer">
			<svgicon
				name="arrow-left-solid"
				height="32"
				width="32"
				class="text-white hover:text-sunglow fill-current"
			/>
		</div>
		<section class="py-4">
			<HubzzInvoice :forViewing="false" />
		</section>
	</div>
</template>

<script>
import HubzzInvoice from "@/components/Billings/HubzzInvoice";
import AppLoading from "@/components/Base/AppLoading";
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
export default {
	components: {
		HubzzInvoice,
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
			invoiceItems: [
				{
					id: 1,
					job_part: "",
					description: "",
					hours: "",
					amount: 0
				}
			],
			invoice: {},
			hide: true,
			practices: [],
			chosenPractice: [],
			loading: false
		};
	},
	async asyncData({ app, route, store }) {
		try {
			let response = await app.$axios.$get(`/api/v1/admin/practices`);
			const practices = response.data.practices;

			return {
				practices
			};
		} catch (err) {
			console.log("index qualifications index create asyncData err", err);
		}
	},
	computed: {
		amountTotal: function() {
			if (this.invoiceItems.length > 1) {
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
			this.hide = false;
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

			this.hide = true;
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
