<template>
  <div class="w-full overflow-hidden">
    <div class="flex justify-end mx-4 mb-2">
      <AppButton
        v-if="authAdminPermissions.includes('Create Hubzz Invoices')" 
        class="text-sm"
        :disabled="!practice.sage_ref ? true : false"
        :label="'Issue HUBZZ Invoice'"
        @click="issueHubzzInvoice"
      />
    </div>
    
    <AppTableNew
      v-if="hubzzInvoicesCount> 0"
      :total="hubzzInvoicesCount"
      :items="hubzzInvoices"
      :current-page="currentPage"
      :perPage="params.limit"
      :columns="columns"
      :loading="loadingHubzzInvoices"
      :routerLink="`/billings/hubzz-billing/${$route.params.id}/practice-hubzz-invoices`"
      :order-by="params.order_by"
      @pagechanged="pagechanged"
      @sorted="sorted"
      :minHeight="'45vh'"
    >
      <template v-slot:total_amount_slot="slotProps">
        <div>{{ '£ '+slotProps.item.total_amount.toFixed(2) }}</div>
      </template>

      <template v-slot:period="slotProps">
        <div>
          {{ $moment(slotProps.item.date_start).format('DD/MM/YYYY') +
            ' - ' +
            $moment(slotProps.item.date_end).format('DD/MM/YYYY') }}
        </div>
      </template>

      <template v-slot:issuedAt="slotProps">
        <div>
          {{ $moment(slotProps.item.date_created_in_gb).isSame($moment(), 'day') ? slotProps.item.date_created_in_gb_formatted_relative : $moment(slotProps.item.date_created_in_gb).format('DD/MM/YYYY') }}
        </div>
      </template>

      <template v-slot:issued_at="slotProps">
        <div>{{ $moment(slotProps.item.issued_at).format('DD/MM/YYYY') }}</div>
      </template>

      <template v-slot:due_date="slotProps">
        <div>{{ $moment(slotProps.item.due_date).format('DD/MM/YYYY') }}</div>
      </template>

      <template v-slot:payment_status="slotProps">
        <div class="flex flex-col">
          <div
            v-if="slotProps.item.unpaid_at" 
            class="px-2"
          >
            {{ slotProps.item.unpaid_at ? 'Marked as Invalid Payment at ' + $moment(slotProps.item.unpaid_at).format('DD/MM/YYYY') : null }}
          </div>
          <div 
            v-else-if="slotProps.item.paid_at"
            class="flex items-center justify-center"
          >
            {{ slotProps.item.paid_at ? 'Paid at ' + $moment(slotProps.item.paid_at).format('DD/MM/YYYY') : null }}
          </div>
          <div 
            v-else
            class="text-gray-600"
          >
            Payment not settled
          </div>
        </div>
      </template>

      <template v-slot:paid_at="slotProps">
        <div class="flex items-center justify-center">
          <AppButton
            :label="!slotProps.item.paid_at ? 'Settle Payment':'Payment is Settled'"
            class="mr-2"
            customTheme="bg-green-500 hover:bg-green-600 text-white"
            :disabled="slotProps.item.sage_ref && slotProps.item.paid_at === null ? false : true"
            @click="toShowPaidModal(slotProps.item.id)"
          />
          <span
            v-if="!slotProps.item.sage_ref"
            class="tool-left text-sm mr-2"
            data-tip="Sage Reference is not yet added on Practice Profile."
            tabindex="1"
          >
            <svgicon name="info" width="21" height="21" color="white transparent black" class="ml-2" />
          </span>
        </div>
      </template>
    </AppTableNew>

    <template v-else>
      <div class="m-2 w-full text-center text-white">
        There are no Invoices for HUBZZ
      </div>
    </template>

    <!--SETTLE PAYMENT MODAL -->
    <transition name="fade" mode="out-in">
      <div v-if="showPaidModal == true" class="mark-paid-modal h-full flex flex-col border-l-4 border-r-4 border-sunglow shadow-lg overflow-hidden">
        <!-- TO PAID CONFIRM CANCEL -->
        <transition name="drop" mode="out-in">
          <AppConfirm
            v-if="confirm"
            :in-style="'top:35%'"
            :in-class="'rounded-lg'"
            :message="paidAt ? 'Are you sure you want to mark this bill as paid? This action cannot be reversed.' : 'Are you sure you want to mark this bill as invalid?'"
            @cancel="confirm = false"
            @confirm="settlePayment()"
          />
        </transition>
        <!-- SHIELD FOR CONFIRM CANCEL -->
        <div v-if="confirm == true" class="shield" @click="confirm = false" />

        <div class="flex items-center text-sm text-white m-4">
          <div class="text-white hover:text-sunglow p-1 ml-auto" @click="closeModals()">
            <svgicon name="times-solid" height="24" width="24" class="fill-current cursor-pointer" />
          </div>
        </div>

        <!-- TO PAID CONFIRM CANCEL ENDS HERE -->

        <!-- PAID OR UNPAID MODAL RED AND BLUE BUTTONS -->
        <div
          v-if="paymentModal === false && modalPaidUnpaid === true" 
          class="flex flex-col text-center text-lg font-semibold h-full mt-6 text-white"
        >
          <div class="p-4 mt-2 border-b">
            <div 
              class="rounded-lg m-2 my-6 p-8 bg-green-500 hover:bg-green-600 cursor-pointer"
              @click="toShowPaymentModal()"
            >
              Mark Invoice as Paid
            </div>
          </div>
          <div class="p-4">
            <div 
              class="rounded-lg m-2 my-6 p-8 bg-red-500 hover:bg-red-600 cursor-pointer"
              @click="toShowUnpaidModal()"
            >
              Mark Invoice as Invalid
            </div>
          </div>
        </div>
        <!-- PAID OR UNPAID MODAL RED AND BLUE BUTTONS ENDS HERE-->

        <div class="flex flex-col w-full text-white px-8 justify-between">
          <div v-if="paymentModal === true && modalPaidUnpaid === false">
            <div class="justify-center">
              <AppDateToggled v-model="paidAt" class="z-50" :name="'paidAt'" :label="'Paid At'" is-before />
            </div>
            <div class="flex flex-row mb-4">
              <AppButton
                :label="'Confirm'"
                :background="'green'"
                class="text-white mr-2"
                :disabled="paidAt ? false : true"
                @click="confirm = true"
              />
              <AppButton
                :label="'Cancel'"
                :background="'red'"
                class="text-white mr-2"
                @click="cancelPaymentModal()"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full text-white px-8 justify-between">
          <div v-if="unpaidModal === true && modalPaidUnpaid === false">
            <div class="justify-center">
              <AppInput
                v-model="unpaidReason"
                :type="'textarea'"
                :name="'unpaidReason'"
                :label="'Mark as Unpaid Reason (Optional)'"
                :resize="false"
                :rows="2"
              />
            </div>
            <div class="flex flex-row mb-4">
              <AppButton
                :label="'Confirm'"
                :background="'green'"
                class="text-white mr-2"
                @click="confirm = true"
              />
              <AppButton
                :label="'Cancel'"
                :background="'red'"
                class="text-white mr-2"
                @click="cancelPaymentModal()"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton"
import AppTableNew from "@/components/Base/AppTableNew"
import AppTable from "@/components/Base/AppTable"
import AppDateToggled from "@/components/Base/AppDateToggled"
// import AppDate from "@/components/Base/AppDate"
import AppInput from "@/components/Base/AppInput"
import AppConfirm from "@/components/Base/AppConfirm"
export default {
	components: {
		AppButton,
		AppTable,
    AppTableNew,
		AppDateToggled,
		// AppDate,
    AppConfirm,
    AppInput,
	},
	data () {
		return {
			loading: false,
			currentPage: 1,
			params: {
				practice_id: "",
				limit: 10,
				offset: 0,
				order_by: ["date_created:desc"]
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
          dataIndex: "date_created",
          slotName:"issuedAt",
          class: "text-center",
					sortable: "true"
				},
				{
					name: "£ Amount",
					dataIndex: "total_amount",
					slotName: "total_amount_slot",
					class: "text-center",
					sortable: "false",
        },
        {
          name: "Due Date",
          dataIndex:"due_date",
          slotName:"due_date",
          class:"text-center",
        },
        {
          name: "Payment Status",
          dataIndex: "",
          slot: true,
          slotName: "payment_status",
					class: "text-center localDate"
        },
      ],
      
			// FOR MARKING INVOICE AS PAID
			showPaidModal: false,
      modalPaidUnpaid: false,
      paymentModal: false,
      unpaidModal: false,
      paidAt: null,
      unpaidReason: '',
			invoiceId: "",
			confirm: false,
		}
	},
	computed: {
    authAdminPermissions () {
			return this.$store.getters["permissions"]
    },
		loadingHubzzInvoices () {
			return this.$store.state.billings.loading_invoices
		},
		hubzzInvoicesCount () {
			return this.$store.state.billings.hubzz_invoices_count
		},
		hubzzInvoices () {
			return this.$store.state.billings.hubzz_invoices
		}
	},
	watch: {
		confirm (value) {
			if (value === false) {
				this.getHubzzInvoices(this.params)
			}
		}
	},
	async asyncData ({ app, route, store }) {
		try {
			await store.commit("billings/TOGGLE_LOADING", true)
			let { 
        page = 1, 
        order_by = ["date_created:desc"] 
      } = route.query

			const practice_id = route.params.id
			const limit = 10
			const offset = page * limit - limit
			let params = {
				practice_id,
				limit,
				offset,
				order_by
			}

			let response = await app.$axios.$get(
				`/api/v1/admin/practice-invoices/count`,
				{ params }
			)
			await store.commit(
				"billings/SET_HUBZZ_INVOICES_COUNT",
				response.data.count
			)

			response = await app.$axios.$get(`/api/v1/admin/practice-invoices`, {
				params
			})
			await store.commit(
				"billings/SET_HUBZZ_INVOICES",
				response.data.practice_invoices
			)

			response = await app.$axios.$get(
				`/api/v1/admin/practices/${practice_id}`
			)
			const practice = response.data.practice

			await store.commit("billings/TOGGLE_LOADING", false)

			return {
				practice,
				params,
				loading: false,
				perPage: limit,
				currentPage: page,
				order_by
			}
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			})
			console.log("Get hubzz invoices error!", err)
		}
  },

  created () {
    if (this.authAdminPermissions.includes('Update Hubzz Invoices & Other Processes')) {
      this.columns.push({
        name: "Actions",
        dataIndex: "paid_at",
        slotName: "paid_at",
        class: "text-center"
      })
    }
  },
  
	methods: {
    issueHubzzInvoice () {
      console.log('banana')
      this.$router.push(`/billings/hubzz-billing/${this.$route.params.id}/practice-hubzz-invoices/issue-hubzz-invoice`)
    },

		getHubzzInvoices (params) {
			console.log("params", params)
			this.$store.dispatch("billings/fetchHubzzInvoices", {
				practice_id: params.practice_id,
				limit: params.limit,
				order_by: params.order_by,
				offset: params.offset
			})
    },

     cancelPaymentModal () {
      this.paymentModal = false
      this.unpaidModal = false 
      this.modalPaidUnpaid = true
      this.paidAt = null
      this.unpaidReason = null
    },

    toShowPaidModal (itemId) {
			this.showPaidModal = true
      this.modalPaidUnpaid = true
      this.invoiceId = itemId
      this.paidAt = null
      this.unpaidReason = null
    },

    toShowPaymentModal () {
      this.modalPaidUnpaid = false
      this.paymentModal = true
      this.paidAt = null
      this.unpaidReason = null
    },
    
    toShowUnpaidModal () {
      this.unpaidModal = true
      this.modalPaidUnpaid = false
      this.paidAt = null
      this.unpaidReason = null
    },

    closeModals () {
      this.showPaidModal = false
      this.modalPaidUnpaid = false
      this.paymentModal = false
      this.unpaidModal = false 

      this.confirm = false
      this.exportedModal = false
      this.paidAt = null
      this.unpaidReason = null
    },

    settlePayment (){
      if(this.paidAt) {
        this.toMarkAsPaid()
      } else {
        this.toMarkAsUnpaid()
      }
    },
    
		async toMarkAsPaid () {
			await this.$axios
				.$put(`/api/v1/admin/practice-invoices/${this.invoiceId}/paid`, {
					paid_at: this.paidAt
				})
				.then(() => {
					this.closeModals()
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Successfully Marked Invoice as Paid"
					})
				})
				.catch(err => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					})
				})
    },

    async toMarkAsUnpaid () {
      await this.$axios
        .$put(`/api/v1/admin/practice-invoices/${this.invoiceId}/unpaid`,{
          unpaid_reason: this.unpaidReason,
        })
        .then(() => {
          this.closeModals()
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Successfully Marked Invoice as Unpaid"
          })
          this.getHubzzInvoices(this.params)
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					})
        })
    },
    
		practiceTypeStyle (type) {
			switch (type) {
				case "Stand Alone":
					return "bg-indigo-500 text-white lg:px-4 sm:px-2"
				// break
				case "Hub":
					return "bg-red-500 text-white lg:px-8 sm:px-2"
				// break
				case "Spoke":
					return "bg-blue-500 text-white lg:px-8 sm:px-2"
				// break
				default:
					return
			}
		},
		pagechanged (page) {
			// const query = {
			// 	...this.$route.query,
			// 	page: page || 1
			// }
			this.params.offset = this.params.limit * (page - 1)
			this.currentPage = page
			this.getHubzzInvoices(this.params)
		},

		sorted (order_by) {
			// go back to page 1
			this.currentPage = 1
			// let query = {
			// 	...this.$router.query,
			// 	order_by
			// }
			this.params.order_by = order_by
			this.getHubzzInvoices(this.params)
		}
	}
}
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
