<template>
  <div>
    <div class="px-2 flex justify-start items-center flex-wrap">
      <div
        class="flex text-white m-2"
      >
        <div class="w-full">
          <input
            v-model="search"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Filter by Invoice ID"
          >
          <button
            v-if="search"
            class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1"
            @click="(search = ''), searchSubmit()"
          >
            <svgicon
              name="times-solid"
              height="12"
              width="12"
              class="text-white hover:text-yellow-500 fill-current -mx-2 md:-mx-6"
            />
          </button>
        </div>
      </div>
      <AppButton
        :class="sageChecker ? 'text-white mr-2' : 'text-black mr-2'"
        :background="sageChecker ? 'red' : 'sunglow'"
        :label="sageChecker ? 'Cancel creating SAGE.csv' : 'Create SAGE.csv'"
        :icon="$route.name.includes('bulk-billings') ? 'edit' : 'add-rectangle'"
        @click="showSageChecker()"
      />
      <AppButton
        v-if="sageChecker === true"
        class="mr-2 text-white"
        :background="'green'"
        :label="'Confirm Invoices and Export SAGE.csv'"
        :icon="'circle-check'"
        :disabled="chosenInvoices.length == 0"
        @click="confirmSage()"
      />
    </div>
    <AppTable
      v-if="hubzzInvoicesCount> 0"
      :total="hubzzInvoicesCount"
      :items="hubzzInvoices"
      :current-page="currentPage"
      :perPage="params.limit"
      :columns="columns"
      :loading="loadingHubzzInvoices"
      :order-by="params.order_by"
      :customWidth="1200"
      @checkClicked="toggleCheck"
      @pagechanged="pagechanged"
      @sorted="sorted"
    >
      <template 
        v-slot:checker="slotProps"
      >
        <input 
          v-if="slotProps.item.sage_ref"
          :id="slotProps.item" 
          v-model="chosenInvoices" 
          type="checkbox" 
          :value="slotProps.item" 
        >
        <label :for="slotProps.item" />
      </template>

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

      <template v-slot:issued_at="slotProps">
        <div>{{ $moment(slotProps.item.issued_at).format('DD/MM/YYYY') }}</div>
      </template>

      <template v-slot:due_date="slotProps">
        <div>{{ $moment(slotProps.item.due_date).format('DD/MM/YYYY') }}</div>
      </template>

      <template v-slot:exported_at="slotProps">
        <div class="p-1 rounded-full" :class="slotProps.item.exported_at ? 'bg-green-500' : 'bg-red-500'">
          <span class="m-1">{{ slotProps.item.exported_at ? 'Yes' : 'No' }}</span>
        </div>
      </template>

      <template v-slot:payment_status="slotProps">
        <div class="flex flex-col">
          <div
            v-if="slotProps.item.unpaid_at" 
            class="px-2"
          >
            {{ slotProps.item.unpaid_at ? 'Marked Invalid Payment at ' + $moment(slotProps.item.unpaid_at).format('DD/MM/YYYY') : null }}
          </div>
          <div 
            v-if="slotProps.item.paid_at"
            class="flex items-center justify-center"
          >
            {{ slotProps.item.paid_at ? 'Paid at ' + $moment(slotProps.item.paid_at).format('DD/MM/YYYY') : null }}
          </div>
        </div>
      </template>

      <template v-slot:actions="slotProps">
        <div class="flex justify-center">
          <div class="flex items-center justify-center">
            <AppButton
              :label="'Settle Payment'"
              :background="'green'"
              class="text-white mr-2"
              :disabled="slotProps.item.sage_ref ? false : true"
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
          <!-- <div
            v-else
            class="px-2"
          >
            {{ slotProps.item.paid_at ? $moment(slotProps.item.paid_at).format('DD/MM/YYYY') : "Not yet paid" }}
          </div> -->

          <div>
            <AppButton
              :label="'View'"
              class="mr-2"
              @click="viewInvoice(slotProps.item.id)"
            />
          </div>
        </div>
      </template>
    </AppTable>

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
            :message="'Are you sure you want to mark this bill as paid?'"
            @cancel="confirm = false"
            @confirm="toMarkAsPaid()"
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
              @click="toMarkAsUnpaid()"
            >
              Mark Invoice as Invalid
            </div>
          </div>
        </div>

        <div class="flex flex-col w-full text-white px-8 justify-between">
          <div v-if="paymentModal === true && modalPaidUnpaid === false">
            <div class="justify-center">
              <AppDateToggled v-model="paidAt" class="z-50" :name="'paidAt'" :label="'Paid At'" is-before />
            </div>
            <div class="flex flex-row mb-4">
              <div
                class="p-2 px-4 my-2 mr-2 rounded-lg bg-green-500 hover:bg-green-600 cursor-pointer"
                @click="confirm = true"
              >
                Confirm
              </div>
              <div
                class="p-2 px-4 my-2 mr-2 rounded-lg bg-red-500 hover:bg-red-600 cursor-pointer"
                @click="paymentModal === false && modalPaidUnpaid === true"
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="exportedModal == true" class="mark-paid-modal overflow-hidden">
        <transition name="drop" mode="out-in">
          <AppConfirm
            v-if="confirm"
            :in-style="'top:35%'"
            :in-class="'rounded-lg'"
            :message="'Are you sure you want to continue?'"
            @cancel="confirm = false"
            @confirm="markExported(chosenInvoices.map(invoice => invoice.id))"
          />
        </transition>
        <!-- TO EXPORT CONFIRM CANCEL -->
        <div v-if="confirm == true" class="shield" @click="confirm = false" />
        <div class="flex items-center text-sm text-white m-4">
          <div class="text-white hover:text-sunglow p-1 ml-auto" @click="exportedModal = false">
            <svgicon name="times-solid" height="24" width="24" class="fill-current cursor-pointer" />
          </div>
        </div>

        <div class="flex flex-col w-full text-white px-8 justify-between">
          <div class="justify-center">
            <div>
              The following invoices have already been Exported on the following dates:
            </div>
            <div v-for="(item, index) in exportedChosenInvoices"
                 :key="`item-${index}`"
                 class="text-white">
              <div class="flex flex-row m-2">
                <div class="mx-2">
                  {{ 'ID: '+ item.id }}
                </div>
                <div class="mx-2">
                  {{ 'Invoice Number: ' + item.invoice_number }}
                </div>
                <div class="mx-2">
                  {{ 'Exported At: ' + $moment(item.exported_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').utc().format('DD/MM/YYYY h:mm:ss a') }}
                </div>
              </div>
            </div>
            <div>
              Are you sure you'd like to export SAGE.csv with exported invoices?
            </div>
          </div>
          <div class="flex flex-row mb-4">
            <div
              class="p-2 px-4 my-2 mr-2 rounded-lg bg-green-500 hover:bg-green-600 cursor-pointer"
              @click="confirm = true"
            >
              Confirm
            </div>
            <div
              class="p-2 px-4 my-2 mr-2 rounded-lg bg-red-500 hover:bg-red-600 cursor-pointer"
              @click="exportedModal = false"
            >
              Cancel
            </div>
          </div>
        </div>
        <!-- TO EXPORT CONFIRM CANCEL ENDS HERE -->
      </div>
    </transition>

    <div 
      v-if="$route.path.includes('hubzzInvoiceId') 
        || showPaidModal === true 
        || exportedModal === true" 
      class="billing-shield" 
      @click="closeModals()"
    />
    <nuxt-child />
  </div>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
import AppTable from "@/components/Base/AppTable"
import AppDateToggled from "@/components/Base/AppDateToggled"
import debounce from "lodash.debounce"
// import AppDate from "@/components/Base/AppDate"
import AppConfirm from "@/components/Base/AppConfirm"
export default {
	components: {
		AppButton,
		AppTable,
		AppDateToggled,
		// AppDate,
		AppConfirm
	},
	data () {
		return {
			loading: false,
      currentPage: 1,
      downloading: false,
      search: "",
			params: {
        practice_id: "",
        invoice_number: "",
				limit: 10,
				offset: 0,
				order_by: ["date_created:desc"]
      },
      chosenInvoices: [],
      exportedChosenInvoices: [],
      // FOR MARKING INVOICE AS PAID
			showPaidModal: false,
      modalPaidUnpaid: false,
      paymentModal: false,
			paidAt: this.$moment().format("YYYY-MM-DD"),
			invoiceId: "",
			confirm: false,
      
      // EXPORTING MODALS
      exportedModal: false,

      sageChecker: false,
			// practiceInvoices: [],
			// practiceInvoicesCount: 0,
			practice: "",
			sort: "",
			columns: [
				{
					name: "Invoice Number",
          dataIndex: "invoice_number",
          class: "text-center",
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
					class: "text-center localDate",
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
        {
          name: "Exported",
          dataIndex:"exported_at",
          slotName:"exported_at",
          class:"text-center",
        },
        {
          name: "Actions",
          slot: true,
          slotName: "actions",
          dataIndex: "",
          class: "text-center px-8"
        },
        
      ],
			
		}
	},
	computed: {
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
    },
    search () {
			this.searchSubmit()
		},
	},
	async asyncData ({ app, route, store }) {
		try {
			await store.commit("billings/TOGGLE_LOADING", true)
			let { 
        page = 1, 
        order_by = ["date_created:desc"] 
      } = route.query

			const limit = 10
			const offset = page * limit - limit
			let params = {
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

			// response = await app.$axios.$get(
			// 	`/api/v1/admin/practices/${practice_id}`
			// )
			// const practice = response.data.practice

			await store.commit("billings/TOGGLE_LOADING", false)

			return {
				// practice,
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
	methods: {
    goToIssue () {},
    searchSubmit: debounce(function (page, order_by) {
      this.chosenInvoices = []
      this.params.invoice_number = this.search
			let search = this.search

			let query = {
				...this.$router.query,
				search
			}
			if (page === 1) {
				delete query.page
			}
			if (page && page > 1) {
				query = {
					...this.$router.query,
					page,
					search
				}
			}
			if (order_by) {
				query = {
					...this.$router.query,
					search,
					order_by
				}
			}
			if (page && order_by) {
				query = {
					...this.$router.query,
					page,
					search,
					order_by
				}
			}

			if (this.search === "") {
				delete query.search
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true
			}

			this.getHubzzInvoices(this.params)

			this.$router.push({ query })
    }, 500),
    showSageChecker () {
      this.sageChecker = !this.sageChecker
      const index = this.columns.findIndex(column => {
        return column.name === "Check"
      })

      if (index > -1) {
        this.columns.splice(index, 1)
      } else {
        this.columns.unshift(
          {
            name: "Check",
            dataIndex: "checker",
            class: "text-center",
            slotName: "checker",
            eventName: "checkClicked",
            order: 1
          },
        )
      }
    },
    async confirmSage () {
      const exported = this.chosenInvoices.filter(invoice => invoice.exported_at !== null)
      this.exportedChosenInvoices = exported
      if(exported.length > 0){
        this.exportedModal = true
      } else {
        await this.markExported()
      }
    },

    async markExported () {
      const invoiceIds = this.chosenInvoices.map(invoice => invoice.id)

      await this.$axios.put(`/api/v1/admin/practice-invoices/export-invoices`, {
        id: invoiceIds,
        exported_at: this.$moment().format("YYYY-MM-DD HH:mm:ss"),
      })
      await this.downloadCsv(invoiceIds)
    },

    downloadCsv (invoiceIds) {
      this.downloading = true

      this.$axios.post('/api/v1/admin/hq-invoice/generate-key', {
        filename: `bulkSage.csv`,
      }, {
        params: {
          practice_invoice_id: invoiceIds,
        },
      }).then((responses) => {
        const token = responses.data.data.token
        console.log('token', responses)

        window.open(`${process.env.API_URL}/api/v1/admin/hq-invoice/bulk-sage?token=${token}`)
      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err.response ? err.response.data : err)
      }).finally(() => {
        this.downloading = false
        this.exportedModal = false
      })


    },

    viewInvoice (invoiceId) {
      this.$router.push(`/billings/hubzz-invoices/${invoiceId}`)
    },
    toggleCheck (item) {
			const index = this.chosenInvoices.findIndex(invoice => {
				return invoice.id === item.id
			})

			if (index > -1) {
				this.chosenInvoices.splice(index, 1)
			} else {
				this.chosenInvoices.push(item)
      }
      
      console.log('chosen invoices', this.chosenInvoices)
    },
		getHubzzInvoices (params) {
			console.log("params", params)
      this.$store
      .dispatch("billings/fetchHubzzInvoices", {
        practice_id: params.practice_id ? params.practice_id : '',
        invoice_number: params.invoice_number ? params.invoice_number : '',
				limit: params.limit ? params.limit : '',
				order_by: params.order_by ? params.order_by : '' ,
        offset: params.offset ? params.offset : '',
        countOnly: true
      })
      .then(() => {
        this.$store.dispatch("billings/fetchHubzzInvoices", {
          practice_id: params.practice_id ? params.practice_id : '',
          invoice_number: params.invoice_number ? params.invoice_number : '',
          limit: params.limit ? params.limit : '',
          order_by: params.order_by ? params.order_by : '' ,
          offset: params.offset ? params.offset : '',
        })
      })
    },
    closeModals () {
      this.showPaidModal = false
      this.modalPaidUnpaid = false
      this.paymentModal = false
      this.confirm = false
      this.exportedModal = false
    },
    
		toShowPaidModal (itemId) {
			this.showPaidModal = true
      this.modalPaidUnpaid = true
			this.invoiceId = itemId
    },
    toShowPaymentModal () {
      this.modalPaidUnpaid = false
      this.paymentModal = true
    },
    async toMarkAsUnpaid () {
      await this.$axios
        .$put(`/api/v1/admin/practice-invoices/${this.invoiceId}/unpaid`)
        .then(() => {
          this.confirm = false
          this.showPaidModal = false
          this.paymentModal = false 
          this.modalPaidUnpaid =false
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

		async toMarkAsPaid () {
			await this.$axios
				.$put(`/api/v1/admin/practice-invoices/${this.invoiceId}/paid`, {
					paid_at: this.paidAt
				})
				.then(() => {
					this.confirm = false
          this.showPaidModal = false
          this.paymentModal = false 
          this.modalPaidUnpaid = false
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
  width: 500px;
	max-width: 95%;
	max-height: 70%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 768px) {
	.mark-paid-modal {
		max-height: 60%;
	}
}
</style>
