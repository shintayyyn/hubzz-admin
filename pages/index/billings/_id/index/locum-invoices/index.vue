<template>
	<div class="flex w-full overflow-hidden">
		<div class="max-w-3xl overflow-hidden my-1 mx-1 rounded-lg bg-waterloo">
			<p class="m-3 text-white text-xl font-semibold ">Invoice Records</p>
			<div class="m-2">
				<!-- HEADER -->
				<div
					class="hidden md:flex items-center text-white justify-around font-semibold"
				>
					<div class="flex-1  align-middle px-2">Invoice Number</div>
					<div class="flex-1  align-middle px-2 text-center">Locum Name</div>
					<div class="flex-1  align-middle px-2 text-center">Created</div>
					<div class="flex-1  align-middle px-2 text-center">Issued</div>
					<div class="flex-1  align-middle px-2 ">Job Numbers</div>
					<div class="flex-1  align-middle px-2 text-center">£ Amount</div>
					<div class="flex-1  align-middle px-2 text-center">Status</div>
				</div>
				<!-- HEADER ENDS HERE -->
				<nuxt-link
					v-for="(jobInvoice, index) in sampleJobInvoices"
					:key="`billing-${index}`"
					:to="`/billings/${practice.id}/job-invoice/${jobInvoice.id}`"
					class="flex flex-col cursor-pointer md:flex-row px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo-light hover:bg-waterloo"
					draggable="false"
				>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Invoice Number</strong
						>
						<span class="break-all">{{ jobInvoice.invoice_number }}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Practice / Surgery</strong
						>
						<span class="break-word">{{ jobInvoice.locum_name }}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">Created</strong>
						<span class="break-all">{{
							$moment(jobInvoice.date_created).format("MMM DD, YYYY | HH:ss:mm")
						}}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">Issued</strong>
						<span class="break-all">{{
							$moment(jobInvoice.issued_at).format("MMM DD, YYYY | HH:SS:MM")
						}}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Job Numbers</strong
						>
						<span
							v-for="(item, index) in jobInvoice.job_numbers"
							:key="index"
							class=""
							>{{ item }}</span
						>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">£ Amount</strong>
						<span class="break-all">{{ jobInvoice.total_amount }}</span>
					</div>
					<div
						class="flex-1 flex flex-col md:justify-center p-1 md:p-2 align-middle md:text-center leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">Status</strong>
						<!-- <span>{{ jobInvoice.status }}</span> -->
						<div class="py-4" v-if="!jobInvoice.paid && !jobInvoice.paid_at">
							<a
								class="px-4 py-2 whitespace-no-wrap rounded-full bg-green-500 text-white"
								>Mark as paid</a
							>
						</div>
					</div>
				</nuxt-link>
			</div>
		</div>

		<!-- <div class="w-1/4 overflow-hidden my-1 mx-1 rounded-lg bg-waterloo">
          <div class="m-2">
            <div>
              <p class="m-2 text-white text-xl font-semibold">Practice</p>
              <div class="m-3 text-white">
                <p class="text-gray-400">Practice Name</p>
                <p class="flex flex-wrap items-center text-white text-sm p-2 font-semibold">
                  <span class="mr-2">{{practice.surgery ? practice.surgery.name : null}}</span>
                  <span
                  class="py-2 px-4 text-sm text-white rounded-lg shadow font-extrabold"
                  :class="practiceTypeStyle(practice.type)">{{practice.type}}</span>
                </p>
                <p class="text-gray-400">Phone Number</p>
                <p class="m-2 text-white font-semibold">{{practice.phone_number}}</p>
                <p class="text-gray-400">Report To</p>
                <p class="m-2 text-white font-semibold">{{practice.report_to ? practice.report_to : 'N/A'}}</p>
                <p class="text-gray-400">E-mail</p>
                <p class="m-2 text-white font-semibold">{{practice.email ? practice.email : 'N/A'}}</p>
                  <p class="text-gray-400">Address</p>
                <p class="flex flex-col text-white text-sm p-2 font-semibold">
                  <span v-if="practice.surgery.address && practice.surgery.address.line_1">{{practice.surgery.address ? practice.surgery.address.line_1 : null}}</span>
                  <span v-if="practice.surgery.address && practice.surgery.address.line_2">{{practice.surgery.address ? practice.surgery.address.line_2 : null}}</span>
                  <span v-if="practice.surgery.address && practice.surgery.address.line_3">{{practice.surgery.address ? practice.surgery.address.line_3 : null}}</span>
                </p>
              </div>
            </div>
            <div>
              <p class="m-2 text-white text-xl font-semibold">Billing Info</p>
              <div class="m-3 text-white">
                <p class="text-gray-400">Invoice Number</p>
                <p class="m-2 text-white font-semibold">{{practiceInvoice.invoice_number}}</p>
                <p class="text-gray-400">Total Amount</p>
                <p class="m-2 text-white font-semibold">{{practiceInvoice.total_amount}}</p>
                <p class="text-gray-400">Billing Cycle</p>
                <p class="m-2 text-white font-semibold">WiP</p>
                <p class="text-gray-400">Rates</p>
                <p class="m-2 text-white font-semibold">{{practice.rates[0].type ? practice.rates[0].type : 'N/A'}}</p>
                <p class="m-2 text-white font-semibold">{{practice.rates[0].rate ? '£ '+practice.rates[0].rate : 'N/A'}}</p>
                <p class="m-2 text-white font-semibold">{{practice.rates[1].type ? practice.rates[1].type : 'N/A'}}</p>
                <p class="m-2 text-white font-semibold">{{practice.rates[1].rate ? '£ '+practice.rates[1].rate : 'N/A'}}</p>
                <p class="text-gray-400">Payment Details</p>
                <p class="m-2 text-white font-semibold">WiP</p>
              </div>
            </div>
          </div>
        </div> -->
	</div>
</template>
<script>
export default {
	data() {
		return {
			practiceInvoice: "",
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
			// let response = await app.$axios.$get(`/api/v1/admin/practice-invoices/${route.params.id}`)
			// const practiceInvoice = response.data.practice_invoice
			// response = await app.$axios.$get(`/api/v1/admin/practices/${practiceInvoice.practice.id}`)
			// const practice = response.data.practice
			// return {
			//   practiceInvoice,
			//   practice
			// }
		} catch (err) {
			// error({ statusCode: 404 }),
			// console.log('Get specific invoice error!', err)
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
