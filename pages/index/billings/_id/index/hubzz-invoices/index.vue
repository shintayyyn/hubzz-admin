<template>
	<div class="w-full overflow-hidden">
    <div class="lg:w-3/4 md:w-full sm:w-full mx-2">
      <AppButton
        :label="'Issue HUBZZ Invoice'"
        :nuxtLink="`/billings/${$route.params.id}/hubzz-invoices/issue-hubzz-invoice`"
        class="float-right my-2 text-sm"
      />
    </div>
    <div
			class="max-w-2xl w-full overflow-hidden my-1 mx-1 rounded-lg bg-waterloo"
		>
			<p class="m-3 text-white text-xl font-semibold ">Invoice Records</p>
			<div class="m-2">
				<!-- HEADER -->
				<div
					class="hidden md:flex items-center text-white justify-around font-semibold"
				>
					<div class="flex-1  align-middle px-2">Invoice Number</div>
					<div class="flex-1  align-middle px-2 text-center">Practice / Surgery</div>
					<div class="flex-1  align-middle px-2 text-center">Issued At</div>
					<div class="flex-1  align-middle px-2 ">Job Numbers</div>
					<div class="flex-1  align-middle px-2 text-center">£ Amount</div>
					<div class="flex-1  align-middle px-2 text-center">Status</div>
				</div>
				<!-- HEADER ENDS HERE -->
				<nuxt-link
					v-for="(practiceInvoice, index) in practiceInvoices"
					:key="`billing-${index}`"
					:to="`/billings/${$route.params.id}/hubzz-invoices/${practiceInvoice.id}`"
					class="flex flex-col cursor-pointer md:flex-row px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo-light hover:bg-waterloo"
					draggable="false"
				>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Invoice Number</strong
						>
						<span class="break-all">{{ practiceInvoice.invoice_number }}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Practice / Surgery</strong
						>
						<span class="break-word">{{ practiceInvoice.practice.surgery.name }}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">Issued At</strong>
						<span class="break-all">{{
							$moment(practiceInvoice.issued_at).format("MMM DD, YYYY | HH:SS:MM")
						}}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Job Numbers</strong
						>
						<span
							v-for="(item, index) in practiceInvoice.practice_invoice_items"
							:key="index"
							class=""
							>{{ item.job_part.job_part_number }}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">£ Amount</strong>
						<span class="break-all">£{{ practiceInvoice.total_amount }}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">Status</strong>
						<!-- <span>{{ practiceInvoice.status }}</span> -->
						<div class="py-4" v-if="!practiceInvoice.paid && !practiceInvoice.paid_at">
							<a
								class="px-4 py-2 whitespace-no-wrap rounded-full bg-yellow-500 text-white"
								>Mark as paid</a
							>
						</div>
            <div v-else>
              <div
								class="px-4 py-2 whitespace-no-wrap rounded-full bg-green-500 text-white"
								>Mark as paid</div
							>
            </div>
					</div>
				</nuxt-link>
			</div>
		</div>
	</div>
</template>
<script>
import AppButton from '@/components/Base/AppButton'
export default {
  components:{
    AppButton
  },
	data() {
		return {
			practiceInvoices: "",
			practice: "",
			sampleJobInvoices: [
				{
					id: "1",
					invoice_number: "0000000001",
					locum_name: "Squidward Q. Tentacles",
					date_created: "2019-11-11T03:06:20.478Z",
					issued_at: "2019-11-07T00:00:00.000Z",
					job_numbers: ["H00000000101"],
					total_amount: "£100.00",
					status: "Paid"
				},
				{
					id: "2",
					invoice_number: "0000000002",
					locum_name: "Sandra Jennifer J. Cheeks",
					date_created: "2019-11-11T03:06:20.478Z",
					issued_at: "2019-11-07T00:00:00.000Z",
					job_numbers: ["H00000000102"],
					total_amount: "£100.00",
					status: "Paid"
				},
				{
					id: "3",
					invoice_number: "0000000003",
					locum_name: "Eugene Harold A. Krabs",
					date_created: "2019-11-11T03:06:20.478Z",
					issued_at: "2019-11-07T00:00:00.000Z",
					job_numbers: ["H00000000103"],
					total_amount: "£100.00",
					status: "Paid"
				},
				{
					id: "4",
					invoice_number: "0000000004",
					locum_name: "Spongebob B. SquarePants",
					date_created: "2019-11-11T03:06:20.478Z",
					issued_at: "2019-11-07T00:00:00.000Z",
					job_numbers: ["H00000000104"],
					total_amount: "£100.00",
					status: "Paid"
				},
				{
					id: "5",
					invoice_number: "0000000005",
					locum_name: "Patrick A. Star",
					date_created: "2019-11-11T03:06:20.478Z",
					issued_at: "2019-11-07T00:00:00.000Z",
					job_numbers: ["H00000000105"],
					total_amount: "£100.00",
					status: "Paid"
				}
			]
		};
	},
	async asyncData({ app, route, store }) {
		try {
      let params = {
        viewing_practice_id : route.params.id
      }
      let response = await app.$axios.$get(`/api/v1/admin/practice-invoices`,{ params })
      const practiceInvoices = response.data.practice_invoices
      console.log('hubzz invoices', practiceInvoices)
			return {
        practiceInvoices
			}
		} catch (err) {
			error({ statusCode: 404 }),
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
