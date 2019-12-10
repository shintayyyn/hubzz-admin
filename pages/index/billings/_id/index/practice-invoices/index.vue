<template>
	<div class="flex w-full overflow-hidden">
		<div
			class="max-w-2xl w-full overflow-hidden my-1 mx-1 rounded-lg bg-waterloo"
		>
			<p class="m-3 text-white text-xl font-semibold ">Practice Invoices</p>
			<div class="m-2">
				<!-- HEADER -->
				<div
					class="hidden md:flex items-center text-white justify-around font-semibold"
				>
					<div class="flex-1 align-middle px-2">Invoice Number</div>
					<div class="flex-1 align-middle px-2 text-center">Locum Name</div>
					<div class="flex-1 align-middle px-2 text-center">Issued</div>
					<div class="flex-1 align-middle px-2 text-center">£ Amount</div>
					<div class="flex-1 align-middle px-2 text-center">Status</div>
				</div>
				<!-- HEADER ENDS HERE -->
				<nuxt-link
					v-for="(locumInvoice, index) in locumInvoices"
					:key="`billing-${index}`"
					:to="`/billings/${practice.id}/practice-invoices/job-invoice/${locumInvoice.id}`"
					class="flex flex-col cursor-pointer md:flex-row px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo-light hover:bg-waterloo"
					draggable="false"
				>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Invoice Number</strong
						>
						<span class="break-all">{{ locumInvoice.invoice_number }}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Practice / Surgery</strong
						>
						<span class="break-word">{{ locumInvoice.locum_user.name }}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">Issued At</strong>
						<span class="break-all">{{
							$moment(locumInvoice.issued_at).format("MMM DD, YYYY | HH:ss:mm")
						}}</span>
					</div>
					<!-- <div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Job Numbers</strong
						>
						<span
							v-for="(item, index) in locumInvoice.job_numbers"
							:key="index"
							class=""
							>{{ item }}</span
						>
					</div> -->
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">£ Amount</strong>
						<span class="break-all">{{ locumInvoice.total_amount }}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">Status</strong>
						<!-- <span>{{ locumInvoice.status }}</span> -->
						<div class="py-4" v-if="!locumInvoice.paid && !locumInvoice.paid_at">
							<a
								class="px-4 py-2 whitespace-no-wrap rounded-full bg-green-500 text-white"
								>Mark as paid</a
							>
						</div>
					</div>
				</nuxt-link>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
      practiceInvoice: '',
      locumInvoices: '',
			practice: '',
		};
	},
	async asyncData({ app, route, store }) {
		try {
			let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/locum-invoices`)
			const locumInvoices = response.data.locum_invoices
			response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      
      console.log('locumInvoices', locumInvoices)
			return {
			  locumInvoices,
			  practice
			}
		} catch (err) {
			console.log('Get specific invoice error!', err)
		}
	},
	methods: {
		practiceTypeStyle(type) {
			switch (type) {
				case "Stand Alone":
					return "bg-indigo-500 text-white lg:px-4 sm:px-2";
					break;
				case "Hub":
					return "bg-red-500 text-white lg:px-8 sm:px-2";
					break;
				case "Spoke":
					return "bg-blue-500 text-white lg:px-8 sm:px-2";
					break;
				default:
					return;
			}
		}
	}
};
</script>

<style></style>
