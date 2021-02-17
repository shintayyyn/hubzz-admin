<template>
	<div class="items-center text-sm">
		<div
			v-if="practiceInvoice.paid_at_in_gb_formatted" 
			class="mx-4 my-2 font-semibold text-lg"
		>
			{{ '* This invoice has been marked as paid on ' + practiceInvoice.paid_at_in_gb_formatted }}
		</div>
		<div
			v-if="practiceInvoice.unpaid_at_in_gb_formatted" 
			class="mx-4 my-2 font-semibold text-lg"
		>
			<div>{{ `* This invoice has been marked Invalid on ${practiceInvoice.unpaid_at_in_gb_formatted}` }}</div>
			<div v-if="practiceInvoice.unpaid_reason">{{ `For the reason: ${practiceInvoice.unpaid_reason}` }}</div>
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
				:byLocum="false"
			/>
		</div>
	</div>
</template>
<script>
import HubzzInvoice from "@/components/Billings/HubzzInvoice"
export default {
	components: {
		HubzzInvoice
	},
	data () {
		return {
			practiceInvoice: "",
			practice: "",
			invoiceItems: [],
			disputedItems: [],
			debitItems: [],
			creditItems: []
		}
	},
	async asyncData ({ app, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/practice-invoices/${route.params.hubzzInvoiceId}`,
				{
          viewing_practice_id: route.params.id,
          with_relations: true,
				}
			)
			const practiceInvoice = response.data.practice_invoice

			console.log('practice invoice', practiceInvoice)

			response = await app.$axios.$get(
				`/api/v1/admin/practices/${route.params.id}`
			)
			const practice = response.data.practice
      const practiceInvoiceItems = practiceInvoice.practice_invoice_items
			let invoiceItems = []
			let disputedItems = []
			let debitItems = []
			let creditItems = []

			for (let i = 0; i < practiceInvoiceItems.length; i++) {
      
				const newItem = {
					job_part_id: practiceInvoiceItems[i].id,
					description: practiceInvoiceItems[i].description,
          total: practiceInvoiceItems[i].total.toFixed(2),
          total_hours: practiceInvoiceItems[i].job_part ? (practiceInvoiceItems[i].job_part.final_hours)/60 : null
				}
				if (
					practiceInvoiceItems[i].type.includes("Job Part - Approved") ||
					practiceInvoiceItems[i].type.includes("Job Part - Issued") ||
					practiceInvoiceItems[i].type.includes("Job Part - Invoiced")||
					practiceInvoiceItems[i].type.includes("Job Part - To Be Invoiced")
				) {
					newItem.id = invoiceItems.length + 1
					invoiceItems.push(newItem)
				} else if (
					practiceInvoiceItems[i].type.includes("Job Part - Disputed")
				) {
					newItem.id = disputedItems.length + 1
					disputedItems.push(newItem)
				} else if (practiceInvoiceItems[i].type.includes("Debit")) {
					newItem.id = debitItems.length + 1
					debitItems.push(newItem)
				} else if (practiceInvoiceItems[i].type.includes("Credit")) {
					newItem.id = creditItems.length + 1
					creditItems.push(newItem)
				}
			}
			return {
				practiceInvoice,
				practice,
				invoiceItems,
				disputedItems,
				debitItems,
				creditItems
			}
		} catch (err) {
			console.log("get invoice error", err)
		}
	},
	methods: {
		goBack () {
			const query = {
				...this.$route.query
			}
			this.$router.push({
				path: `/billings/hubzz-billing/${this.$route.params.id}/practice-hubzz-invoices`,
				query
			})
		}
	}
}
</script>

<style>
.practice-hubzz-invoice-modal {
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
	.practice-hubzz-invoice-modal {
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