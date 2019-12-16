<template>
	<div class="max-w-2xl w-full overflow-hidden">
    <div class="mx-2 float-right">
      <AppButton
        :label="'Issue HUBZZ Invoice'"
        :nuxtLink="`/billings/${$route.params.id}/hubzz-invoices/issue-hubzz-invoice`"
        class="t my-2 text-sm"
      />
    </div>
    <div
			class="w-full overflow-hidden my-1 mx-1 rounded-lg bg-orange-500 bg-waterloo"
		>
			<p class="m-3 text-white text-xl font-semibold ">Invoice Records</p>
			<div class="m-2">
				<!-- HEADER -->
				<div
					class="hidden md:flex items-center text-white justify-around font-semibold"
				>
					<div class="flex-1 align-middle px-2">Invoice Number</div>
					<div class="flex-1 align-middle px-2 text-center">Practice / Surgery</div>
					<div class="flex-1 align-middle px-2 text-center">Issued At</div>
					<div class="flex-1 align-middle px-2 ">Job Numbers</div>
					<div class="flex-1 align-middle px-2 text-center">£ Amount</div>
					<div class="flex-1 align-middle px-2 text-center">Status</div>
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
import AppTable from '@/components/Base/AppTable'
export default {
  components:{
    AppButton,
    AppTable
  },
	data() {
		return {
			practiceInvoices: "",
      practice: "",

      columns: [
        {
          name: "Invoice Number",
          dataIndex:"invoice_number",
          class:"text-center",
          sortable: true
        },
        {
          name: 'Practice',
          dataIndex:"practice.surgery.name",
          class:"text-center",
          sortable: 'true'
        },
        {
          name: 'Issued At',
          dataIndex:"invoice_number",
          class:"text-center",
          sortable: 'true'
        },
        {
          name: 'Job Numbers',
          dataIndex:'practice_invoice_items',
          class:"text-center",
          sortable: 'false'
        },
        {
          name: '£ Amount',
          dataIndex: 'total_amount',
          class:"text-center",
          sortable: 'false'
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
