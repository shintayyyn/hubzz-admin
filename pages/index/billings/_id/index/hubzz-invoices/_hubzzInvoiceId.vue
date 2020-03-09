<template>
	<div class="hubzz-invoice-modal">
		<div class="items-center text-sm text-white py-2 m-6">
			<div class="p-1 mb-2">
				<svgicon
					@click="goBack()"
					name="arrow-left-solid"
					height="32"
					width="32"
					class="fill-current text-white hover:text-sunglow cursor-pointer"
				/>
			</div>
			<div>
				<HubzzInvoice
					:forViewing="true"
					:practice="practice"
					:practiceInvoice="practiceInvoice"
					:invoiceItems="invoiceItems"
					:disputedItems="disputedItems"
					:debitItems="debitItems"
					:creditItems="creditItems"
					:dateStart="practiceInvoice.date_start"
					:dateEnd="practiceInvoice.date_end"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import HubzzInvoice from "@/components/Billings/HubzzInvoice";
export default {
	components: {
		HubzzInvoice
	},
	data() {
		return {
			practiceInvoice: "",
			practice: "",
			invoiceItems: [],
			disputedItems: [],
			debitItems: [],
			creditItems: []
		};
	},
	async asyncData({ app, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practice-invoices/${route.params.hubzzInvoiceId}`,
				{
					viewing_practice_id: route.params.id
				}
			);
			const practiceInvoice = response.data.practice_invoice;
			console.log("practice invoice", practiceInvoice);

			response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			);
			const practice = response.data.practice;
			const practiceInvoiceItems = practiceInvoice.practice_invoice_items;

			let invoiceItems = [];
			let disputedItems = [];
			let debitItems = [];
			let creditItems = [];

			for (let i = 0; i < practiceInvoiceItems.length; i++) {
				const newItem = {
					job_part_id: practiceInvoiceItems[i].id,
					description: practiceInvoiceItems[i].description,
					total: practiceInvoiceItems[i].total.toFixed(2)
				};
				if (
					practiceInvoiceItems[i].type.includes("Job Part - Approved") ||
					practiceInvoiceItems[i].type.includes("Job Part - Issued") ||
					practiceInvoiceItems[i].type.includes("Job Part - Invoiced")
				) {
					console.log("normal invoice item has been pushed");
					newItem.id = invoiceItems.length + 1;
					invoiceItems.push(newItem);
				} else if (
					practiceInvoiceItems[i].type.includes("Job Part - Disputed")
				) {
					console.log("disputed invoice item has been pushed");
					newItem.id = disputedItems.length + 1;
					disputedItems.push(newItem);
				} else if (practiceInvoiceItems[i].type.includes("Debit")) {
					console.log("debit invoice item has been pushed");
					newItem.id = debitItems.length + 1;
					debitItems.push(newItem);
				} else if (practiceInvoiceItems[i].type.includes("Credit")) {
					console.log("credit invoice item has been pushed");
					newItem.id = creditItems.length + 1;
					creditItems.push(newItem);
				} else {
					console.log("it didnt work lol");
				}
			}
			return {
				practiceInvoice,
				practice,
				invoiceItems,
				disputedItems,
				debitItems,
				creditItems
			};
		} catch (err) {
			console.log("get invoice error", err);
		}
	},
	methods: {
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
.hubzz-invoice-modal {
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
	.hubzz-invoice-modal {
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