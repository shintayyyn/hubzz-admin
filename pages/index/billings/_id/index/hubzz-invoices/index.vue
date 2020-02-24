<template>
	<div class="w-full overflow-hidden">
		<div class="mx-2 float-right">
			<AppButton
				:label="'Issue HUBZZ Invoice'"
				:nuxtLink="`/billings/${$route.params.id}/hubzz-invoices/issue-hubzz-invoice`"
				class="t my-2 text-sm"
			/>
		</div>
		<AppTable
			v-if="hubzzInvoicesCount> 0"
			:total="hubzzInvoicesCount"
			:items="hubzzInvoices"
			:currentPage="currentPage"
			:perPage="params.limit"
			:columns="columns"
			:loading="loadingHubzzInvoices"
			:routerLink="`/billings/${$route.params.id}/hubzz-invoices`"
			:orderBy="params.order_by"
			@pagechanged="pagechanged"
			@sorted="sorted"
		>
			<template v-slot:total_amount_slot="slotProps">
				<div>{{'£ '+slotProps.item.total_amount }}</div>
			</template>

			<template v-slot:period="slotProps">
				<div>
					{{ $moment(slotProps.item.date_start).format('DD/MM/YYYY') +
					' - ' +
					$moment(slotProps.item.date_end).format('DD/MM/YYYY')}}
				</div>
			</template>

			<template v-slot:issued_at="slotProps">
				<div>{{$moment(slotProps.item.issued_at).format('DD/MM/YYYY')}}</div>
			</template>

			<template v-slot:paid_at="slotProps">
				<div v-if="!slotProps.item.paid_at">
					<div
            v-if="practice && practice.sage_ref && practice.direct_debit === true"
						@click.stop.prevent="toShowPaidModal(slotProps.item.id)"
						class="p-2 bg-green-500 hover:bg-green-600 rounded-lg cursor-pointer"
					>Mark as Paid</div>
				</div>
				<div
					class="px-2"
					v-else
				>{{ slotProps.item.paid_at ? $moment(slotProps.item.paid_at).format('DD/MM/YYYY | HH:MM:ss') : "Not yet paid" }}</div>
			</template>
		</AppTable>

		<template v-else>
			<div class="m-2 w-full text-center text-white">There are no Invoices for HUBZZ</div>
		</template>
		<transition name="fade" mode="out-in">
			<div class="mark-paid-modal overflow-hidden" v-if="showPaidModal == true">
				<transition name="drop" mode="out-in">
					<AppConfirm
						v-if="confirm"
						:inStyle="'top:35%'"
						:inClass="'rounded-lg'"
						:message="'Are you sure you want to mark this bill as paid?'"
						@cancel="confirm = false"
						@confirm="toMarkAsPaid()"
					/>
				</transition>
        <!-- TO PAID CONFIRM CANCEL -->
				<div class="shield" v-if="confirm == true" @click="confirm = false"></div>
				<div class="flex items-center text-sm text-white m-4">
					<div @click="showPaidModal = false" class="text-white hover:text-sunglow p-1 ml-auto">
						<svgicon name="times-solid" height="24" width="24" class="fill-current cursor-pointer" />
					</div>
				</div>
        
				<div class="flex flex-col w-full text-white px-8 justify-between">
					<div class="justify-center">
						<AppDateToggled class="z-50" v-model="paidAt" :name="'paidAt'" :label="'Paid At'" isBefore />
					</div>
					<div class="flex flex-row mb-4">
						<div
							@click="confirm = true"
							class="p-2 px-4 my-2 mr-2 rounded-lg bg-green-500 hover:bg-green-600 cursor-pointer"
						>Confirm</div>
						<div
							@click="showPaidModal = false"
							class="p-2 px-4 my-2 mr-2 rounded-lg bg-red-500 hover:bg-red-600 cursor-pointer"
						>Cancel</div>
					</div>
				</div>
        <!-- TO PAID CONFIRM CANCEL ENDS HERE -->
			</div>
		</transition>

		<div class="billing-shield" v-if="showPaidModal == true" @click="showPaidModal = false"></div>
	</div>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
import AppTable from "@/components/Base/AppTable";
import AppDateToggled from "@/components/Base/AppDateToggled";
import AppDate from "@/components/Base/AppDate";
import AppConfirm from "@/components/Base/AppConfirm";
export default {
	components: {
		AppButton,
		AppTable,
		AppDateToggled,
		// AppDate,
		AppConfirm
	},
	data() {
		return {
			loading: false,
			currentPage: 1,
			params: {
        practice_id:"",
				limit: 10,
				offset: 0,
				order_by: ["created_at:desc"]
			},
			// practiceInvoices: [],
			// practiceInvoicesCount: 0,
			practice: "",
			sort: "",
			columns: [
				{
					name: "Invoice Number",
					dataIndex: "invoice_number",
					sortable: true
				},
				{
					name: "Practice",
					dataIndex: "practice.name",
					class: "text-center",
					customClass: "truncate",
					sortable: "true"
				},
				{
					name: "Period",
					dataIndex: "period",
					slotName: "period",
					class: "text-center"
				},
				{
					name: "Issued At",
					dataIndex: "issued_at",
					slotName: "issued_at",
					class: "text-center",
					sortable: "true"
				},
				{
					name: "£ Amount",
					dataIndex: "total_amount",
					slotName: "total_amount_slot",
					class: "text-center",
					sortable: "false"
				},

				{
					name: "Paid",
					dataIndex: "paid_at",
					slotName: "paid_at",
					class: "text-center"
				}
			],
			// FOR MARKING INVOICE AS PAID
			showPaidModal: false,
			paidAt: "",
			invoiceId: "",
			confirm: false
		};
	},
	async asyncData({ app, route, store }) {
		try {
			await store.commit("billings/TOGGLE_LOADING", true);
			let { page = 1, order_by = [] } = route.query;

			const practice_id = route.params.id;
			const limit = 10;
			const offset = page * limit - limit;
			let params = {
				practice_id,
				limit,
				offset,
				order_by
			};

			let response = await app.$axios.$get(
				`/api/v1/admin/practice-invoices/count`,
				{ params }
			);
			await store.commit(
				"billings/SET_HUBZZ_INVOICES_COUNT",
				response.data.count
			);

			response = await app.$axios.$get(`/api/v1/admin/practice-invoices`, {
				params
			});
			await store.commit(
				"billings/SET_HUBZZ_INVOICES",
				response.data.practice_invoices
      );
      
      response = await app.$axios.$get(`/api/v1/admin/practices/${practice_id}`)
      const practice = response.data.practice

      await store.commit("billings/TOGGLE_LOADING", false);
      
			return {
        practice,
        params,
				loading: false,
				perPage: limit,
				currentPage: page,
				order_by
			};
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("Get hubzz invoices error!", err);
		}
	},
	computed: {
		loadingHubzzInvoices() {
			return this.$store.state.billings.loading_invoices;
		},
		hubzzInvoicesCount() {
			return this.$store.state.billings.hubzz_invoices_count;
		},
		hubzzInvoices() {
			return this.$store.state.billings.hubzz_invoices;
		}
	},
	watch: {
		confirm(value) {
			if (value === false) {
				this.getHubzzInvoices(this.params);
			}
		}
	},
	methods: {
		getHubzzInvoices(params) {
      console.log('params', params)
			this.$store.dispatch("billings/fetchHubzzInvoices", {
        practice_id: params.practice_id,
				limit: params.limit,
				order_by: params.order_by,
				offset: params.offset
			});
		},
		toShowPaidModal(itemId) {
			this.showPaidModal = true;
			this.invoiceId = itemId;
		},
		async toMarkAsPaid() {
			await this.$axios
				.$put(`/api/v1/admin/practice-invoices/${this.invoiceId}/paid`, {
					paid_at: this.paidAt
				})
				.then(() => {
					this.confirm = false;
					this.showPaidModal = false;
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Successfully Marked Invoice as Paid"
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
		},
		pagechanged(page) {
			const query = {
				...this.$route.query,
				page: page || 1
			};
			this.params.offset = this.params.limit * (page - 1);
			this.currentPage = page;
			this.getHubzzInvoices(this.params);
		},
		sorted(order_by) {
			// go back to page 1
			this.currentPage = 1;
			let query = {
				...this.$router.query,
				order_by
			};
			this.params.order_by = order_by;
			this.getHubzzInvoices(this.params);
		}
	}
};
</script>

<style>
.mark-paid-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border-radius: 25px;
	min-width: 600px;
	min-height: 640px;
	max-width: 95%;
	max-height: 80%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
</style>
