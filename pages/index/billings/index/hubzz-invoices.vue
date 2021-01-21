<template>
  <div v-if="authAdminPermissions.includes('View Hubzz Invoices')">
    <div class="flex flex-col md:flex-row justify-start w-full m-3">
      <div class="flex-1 text-white">
        <!-- <input
          v-model="search"
          class="rounded-lg border-2 border-transparent text-sm text-white w-1/2 md:w-full p-2 focus:border-sunglow focus:outline-none bg-waterloo"
          placeholder="Filter by Practice Name or Invoice Number"
        > -->
        <AppInput 
          v-model="search"
          :type="'text'"
          :label="'Search by Practice Name'"
          :placeholder="'Practice Name'"
        />
      </div>
      <div class="flex m-3 text-white">
        <input id="showUnpaidInvoiceOnly" v-model="showUnpaidInvoiceOnly" type="checkbox" value="true">
        <label for="showUnpaidInvoiceOnly">Show Unpaid Invoices Only</label>
      </div>
      <div class="flex m-3 text-white">
        <input id="showExportableInvoicesOnly" v-model="showExportableInvoicesOnly" type="checkbox" value="true">
        <label for="showExportableInvoicesOnly">Show Exportable Invoices Only</label>
      </div>
      <div class="flex m-3 text-white">
        <input id="showPaidInvoiceOnly" v-model="showPaidInvoiceOnly" type="checkbox" value="true">
        <label for="showPaidInvoiceOnly">Show Paid Invoices Only</label>
      </div>
      <div class="flex m-3 text-white">
        <input id="showCsvExportOnly" v-model="showCsvExportOnly" type="checkbox" value="true">
        <label for="showCsvExportOnly">Show CSV Exported Only</label>
      </div>
    </div>
    <div class="m-2 border-b-2 border-white">
      <div class="hidden md:flex pb-1 items-center text-sm text-white justify-around font-semibold">
        <div 
          v-if="authAdminPermissions.includes('Update Hubzz Invoices & Other Processes')"
          class="align-middle  text-center w-1/10"
        >
          Check
        </div>
        <div 
          class="align-middle  text-center w-1/10"
          @click="sorted('surgery_name')"
        >
          Invoice Number
          <svgicon
            v-if="!params.order_by.includes('surgery_name')"
            class="inline align-baseline"
            :name="sortIcon('surgery_name')"
            height="12"
            width="12"
            color="white black"
          />
        </div>
        <div 
          class="align-middle text-center w-1/10"
          @click="sorted('practice_name')"
        >
          Practice Name
          <svgicon
            v-if="!params.order_by.includes('practice_name')"
            class="inline align-baseline"
            :name="sortIcon('practice_name')"
            height="12"
            width="12"
            color="white black"
          />
        </div>
        
        <div class="align-middle px-16 text-center w-1/10">
          Period
        </div>
        <div 
          class="align-middle pl-11 text-center w-1/10"
          @click="sorted('issued_at')"
        >
          Issued At
          <svgicon
            v-if="!params.order_by.includes('issued_at')"
            class="inline align-baseline"
            :name="sortIcon('issued_at')"
            height="12"
            width="12"
            color="white black"
          />
        </div>
        <div class="align-middle pl-12 text-center w-1/10">
          £ Amount
        </div>
        <div class="align-middle text-center w-1/10">
          Due Date
        </div>
        <div 
          class="align-middle  text-center w-1/10"
          @click="sorted('paid_at')"
        >
          Payment Status
          <svgicon
            v-if="!params.order_by.includes('paid_at')"
            class="inline align-baseline"
            :name="sortIcon('paid_at')"
            height="12"
            width="12"
            color="white black"
          />
        </div>
        <div
          class="align-middle text-center w-1/10"
          @click="sorted('exported_at')"
        >
          Exported?
          <svgicon
            v-if="!params.order_by.includes('exported_at')"
            class="inline align-baseline"
            :name="sortIcon('exported_at')"
            height="12"
            width="12"
            color="white black"
          />
        </div>
        <div
          v-if="authAdminPermissions.includes('Update Hubzz Invoices & Other Processes')"
          class="align-middle text-center w-1/10"
          @click="sorted('paid')"
        >
          Actions
          <svgicon
            v-if="!params.order_by.includes('paid')"
            class="inline align-baseline"
            :name="sortIcon('paid')"
            height="12"
            width="12"
            color="white black"
          />
        </div>
      </div>
      <AppTable
        v-if="hubzzInvoices.length > 0"
        :total="hubzzInvoicesCount"
        :items="hubzzInvoices"
        :current-page="currentPage"
        :perPage="params.limit"
        :columns="columns"
        :loading="loadingHubzzInvoices"
        :router-link="`/billings/hubzz-invoices`"
        :order-by="params.order_by"
        :disabledHeadings="true"
        @checkClicked="toggleCheck"
        @pagechanged="pagechanged"
        @sorted="sorted"
      >
        <template v-slot:checker="slotProps">
          <input 
            v-if="slotProps.item.sage_ref"
            :id="slotProps.item" 
            v-model="chosenInvoices" 
            type="checkbox" 
            :value="slotProps.item" 
          >
          <label :for="slotProps.item" />
        </template>
        <template v-slot:issuedAt="slotProps">
          <div>
            {{ $moment(slotProps.item.date_created_in_gb).isSame($moment(), 'day') ? slotProps.item.date_created_in_gb_formatted_relative : $moment(slotProps.item.date_created_in_gb).format('DD/MM/YYYY') }}
          </div>
        </template>
        <template v-slot:practiceName="slotProps">
          <div>
            {{ slotProps.item.practice.name }}
          </div>
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
          <div
            v-if="slotProps.item.sage_ref"
            :class="slotProps.item.exported_at ? 'text-white-400' : 'text-white-400'"
          >
            <span class="font-bold">{{ slotProps.item.exported_at ? 'Yes' : 'No' }}</span>
          </div>
          <div v-else>
            <span class="font-bold text-lg text-white">No Sage Reference</span>
          </div>
        </template>

        <template v-slot:payment_status="slotProps">
          <div class="flex flex-col">
            <div
              v-if="slotProps.item.unpaid_at" 
              class="px-2"
            >
              {{ slotProps.item.unpaid_at ? `Marked Invalid at  ${slotProps.item.unpaid_at_in_gb_formatted }`: null }}
            </div>
            <div 
              v-else-if="slotProps.item.paid_at"
              class="flex items-center justify-center"
            >
              {{ slotProps.item.paid_at ? `Paid at ${slotProps.item.paid_at_in_gb_formatted}` : null }}
            </div>
            <div 
              v-else
              class="text-gray-400"
            >
              Payment not settled
            </div>
          </div>
        </template>

        <template v-slot:actions="slotProps">
          <div class="flex justify-center">
            <div class="flex items-center justify-center">
              <AppButton
                :label="!slotProps.item.paid_at ? 'Settle Payment':'Payment is Settled'"
                :background="'green'"
                class="text-white mr-2"
                :disabled="slotProps.item.sage_ref && !slotProps.item.paid_at ? false : true"
                @click="toShowPaidModal(slotProps.item.id)"
              />
              <!-- <span
                v-if="!slotProps.item.sage_ref"
                class="tool-left text-sm mr-2"
                data-tip="Sage Reference is not yet added on Practice Profile."
                tabindex="1"
              >
                <svgicon name="info" width="21" height="21" color="white transparent black" class="ml-2" />
              </span> -->
            </div>
            <!-- <div
              v-else
              class="px-2"
            >
              {{ slotProps.item.paid_at ? $moment(slotProps.item.paid_at).format('DD/MM/YYYY') : "Not yet paid" }}
            </div> -->

            <!-- <div>
              <AppButton
                :label="'View'"
                class="mr-2"
                @click="viewInvoice(slotProps.item.id)"
              />
            </div> -->
          </div>
        </template>
      </AppTable>
      <template v-else>
        <div class="m-2 w-full text-center text-white">
          There are no Invoices for HUBZZ
        </div>
      </template>
    </div>
    
    <div 
      v-if="authAdminPermissions.includes('Export Sage Csv')"
      class="flex flex-row justify-end"
    >
      <AppButton
        class="mx-2"
        :label="'Clear Selection'"
        :icon="'add-rectangle'"
        @click="reset()"
      />
      <AppButton
        class="mr-2"
        :label="'Create SAGE.csv'"
        :icon="'circle-check'"
        :disabled="chosenInvoices.length == 0"
        @click="confirmSage()"
      />
    </div>

    <!--SETTLE PAYMENT MODAL -->
    <transition name="fade" mode="out-in">
      <div v-if="showPaidModal == true" class="mark-paid-modal h-full flex flex-col border-l-4 border- -4 border-sunglow shadow-lg overflow-hidden">
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
              Mark Payment as Invalid
            </div>
          </div>
        </div>
        <!-- PAID OR UNPAID MODAL RED AND BLUE BUTTONS ENDS HERE -->
        
        <!-- MARKING AS PAID MODAL WITH DATEPICKER -->
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
        <!-- MARKING AS PAID MODAL WITH DATEPICKER ENDS HERE -->

        <!-- MARKING AS UNPAID MODAL WITH TEXTFIELD -->
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
        <!-- MARKING AS UNPAID MODAL WITH TEXTFIELD ENDS HERE -->
      </div>
    </transition>
    <!-- SETTLE PAYMENT MODAL ENDS HERE -->

    <!-- SAGE CSV EXPORT MODAL -->
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
                 class="text-white"
            >
              <div class="flex flex-row m-2">
                <div class="mx-2">
                  {{ 'ID: '+ item.id }}
                </div>
                <div class="mx-2">
                  {{ 'Invoice Number: ' + item.invoice_number }}
                </div>
                <div class="mx-2">
                  {{ 'Exported At: ' + item.exported_at_in_gb_formatted }}
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
    <!-- SAGE CSV EXPORT MODAL ENDS HERE -->

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
import AppInput from "@/components/Base/AppInput"
import AppTable from "@/components/Base/AppTable"
import AppDateToggled from "@/components/Base/AppDateToggled"
import debounce from "lodash.debounce"
import AppConfirm from "@/components/Base/AppConfirm"
export default {
	components: {
    AppInput,
		AppButton,
		AppTable,
		AppDateToggled,
		AppConfirm
	},
	data () {
		return {
			loading: false,
      currentPage: 1,
      downloading: false,
      search: "",
      showUnpaidInvoiceOnly: false,
      showPaidInvoiceOnly: false,
      showCsvExportOnly: false,
      showExportableInvoicesOnly: false,
			params: {
        search: "",
        practice_id: "",
        invoice_number: "",
        // exportable: true,
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
      unpaidModal: false,
      paidAt: null,
      unpaidReason: '',
			invoiceId: "",
			confirm: false,
      
      // EXPORTING MODALS
      exportedModal: false,

			// practiceInvoices: [],
			// practiceInvoicesCount: 0,
			practice: "",
			sort: "",
			columns: [
        //  {
        //   name: "Check",
        //   dataIndex: "checker",
        //   class: "text-center",
        //   slotName: "checker",
        //   eventName: "checkClicked",
        //   order: 1
        // },
				{
					name: "Invoice Number",
          dataIndex: "invoice_number",
          class: "text-center",
					sortable: true
				},
				{
					name: "Practice",
          dataIndex: "practice.name",
          slotName: "practiceName",
					class: "text-center",
					sortable: "true"
				},
				{
					name: "Period",
					dataIndex: "period",
          slotName: "period",
          minWidth: "36",
					class: "text-center truncate pr-24 "
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
          name: "Paid?",
          dataIndex: "",
          slot: true,
          slotName: "payment_status",
					class: "text-center"
        },
        {
          name: "CSV Exported?",
          dataIndex:"exported_at",
          slotName:"exported_at",
          class:"text-center",
        },
      ],
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
				this.getHubzzInvoices()
			}
    },
    search () {
      this.searchSubmit()
    },
    showUnpaidInvoiceOnly (newValue) {
      this.currentPage = 1
      this.params.offset = 0
      if (this.showPaidInvoiceOnly === true && newValue === true) {
        this.showPaidInvoiceOnly = false
      }

      this.getHubzzInvoices()
    },
    showPaidInvoiceOnly (newValue) {
      this.currentPage = 1
      this.params.offset = 0
      if (this.showUnpaidInvoiceOnly === true && newValue === true) {
        this.showUnpaidInvoiceOnly = false
      }
      
      this.getHubzzInvoices()
    },
    showCsvExportOnly (newValue) {
      this.currentPage = 1
      this.params.offset = 0
      if (this.showExportableInvoicesOnly === true && newValue === true) {
        this.showExportableInvoicesOnly = false
      }
      this.getHubzzInvoices()
      
    },
    showExportableInvoicesOnly (newValue) {
      this.currentPage = 1
      this.params.offset = 0
      if (this.showCsvExportOnly === true && newValue === true) {
        this.showCsvExportOnly = false
      }
      this.getHubzzInvoices()
    }
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
      // const exportable = true
			let params = {
				limit,
				offset,
        order_by,
        // exportable,
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
  created () {
    if (this.authAdminPermissions.includes('Export Sage Csv')) {
      this.columns.unshift({
        name: "Check",
        dataIndex: "checker",
        class: "text-center",
        slotName: "checker",
        eventName: "checkClicked",
        order: 1
      })
    }
    if (this.authAdminPermissions.includes('Update Hubzz Invoices & Other Processes')) {
      this.columns.push({
        name: "Actions",
        slot: true,
        slotName: "actions",
        dataIndex: "",
        class: "text-center"
      })
    }
    
  },
	methods: {
    searchSubmit: debounce(function (page, order_by) {
      this.chosenInvoices = []
			let search = this.search
      this.params.search = this.search
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

			this.getHubzzInvoices()

			// this.$router.push({ query })
    }, 500),

    getHubzzInvoices () {
      console.log('show unpaid',this.showUnpaidInvoiceOnly)
      this.$store
      .dispatch("billings/fetchHubzzInvoices", {
        exportable: this.showExportableInvoicesOnly === true ? true : null,
        practice_id: this.params.practice_id ? this.params.practice_id : '',
        search: this.params.search ? this.params.search : '',
        paid: this.showPaidInvoiceOnly === true ? true : this.showUnpaidInvoiceOnly === true ? "false" : null,
        exported: this.showCsvExportOnly === true ? true : this.showExportableInvoicesOnly === true ? "false" : null,
        invoice_number: this.params.invoice_number ? this.params.invoice_number : '',
				limit: this.params.limit ? this.params.limit : '',
				order_by: this.params.order_by ? this.params.order_by : '' ,
        offset: this.params.offset ? this.params.offset : '',
        countOnly: true
      })
      .then(() => {
        this.$store.dispatch("billings/fetchHubzzInvoices", {
          exportable: this.showExportableInvoicesOnly ? this.showExportableInvoicesOnly : '',
          practice_id: this.params.practice_id ? this.params.practice_id : '',
          search: this.params.search ? this.params.search : '',
          paid:this.showPaidInvoiceOnly === true ? true : this.showUnpaidInvoiceOnly === true ? "false" : null,
          exported: this.showCsvExportOnly === true ? true : this.showExportableInvoicesOnly === true ? "false" : null,
          invoice_number: this.params.invoice_number ? this.params.invoice_number : '',
          limit: this.params.limit ? this.params.limit : '',
          order_by: this.params.order_by ? this.params.order_by : '' ,
          offset: this.params.offset ? this.params.offset : '',
        })
      })
    },
    // BULK SAGE METHODS
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
        window.open(`${process.env.API_URL}/api/v1/admin/hq-invoice/bulk-sage?token=${token}`)
        this.confirm = false
        this.exportedModal = false
        this.chosenInvoices = []

      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err.response ? err.response.data : err)
      }).finally(() => {
        this.downloading = false
        this.exportedModal = false
        this.getHubzzInvoices()
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
    },

    // SETTLE PAYMENT METHODS
    reset () {
      this.currentPage = 1
      this.chosenInvoices = []
      this.exportedChosenInvoices = []
    },

    cancelPaymentModal () {
      this.paymentModal = false
      this.unpaidModal = false 
      this.modalPaidUnpaid = true
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
      this.modalPaidUnpaid = false
      this.unpaidModal = true
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
          this.getHubzzInvoices()
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
    
		practiceTypeStyle (type) {
			switch (type) {
				case "Stand Alone":
					return "bg-indigo-500 text-white lg:px-4 sm:px-2"
				case "Hub":
					return "bg-red-500 text-white lg:px-8 sm:px-2"
				case "Spoke":
					return "bg-blue-500 text-white lg:px-8 sm:px-2"
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
			this.getHubzzInvoices()
		},

		sorted (orderByParam) {
      if (!this.params.order_by.some(item => item.includes(`${orderByParam}`))) {
        this.params.order_by = []
        this.params.order_by.push(`${orderByParam}:desc`)
      } else {
        let index = this.params.order_by.findIndex(item => item === `${orderByParam}:desc`)
        if (index >= 0) {
          this.params.order_by.splice(index, 1, `${orderByParam}:asc`)
        } else {
          this.params.order_by.splice(
            this.params.order_by.findIndex(item => item === `${orderByParam}:asc`),
            1
          )
        }
      }

			this.currentPage = 1
			this.getHubzzInvoices()
    },
    
    sortIcon (orderByParam) {
      return this.params.order_by.some(orderBy => orderBy === orderByParam || orderBy === `${orderByParam}:asc`)
        ? 'sort-ascend'
        : this.params.order_by.some(orderBy => orderBy === `${orderByParam}:desc`)
          ? 'sort-descend'
          : 'sort'
      },
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
