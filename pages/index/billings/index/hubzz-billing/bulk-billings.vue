<template>
  <div>
    <AppLoading :loading="loadingBillablePractices" />
    <div class="flex items-center px-2">
      <div class="relative w-full">
        <div
          v-if="authAdminPermissions.includes('Create Hubzz Invoices')" 
          class="flex justify-start items-center flex-wrap py-2"
        >
          <AppButton
            class="mr-2 mt-1 font-bold"
            :label="$route.name.includes('bulk-billings') ? '+ Bill Individually' : ' + Bill by Bulk'"
            :customTheme="'bg-info text-white'"
            @click="goToTab()"
          />
          <!-- Required Fields -->
          <div class="flex items-center rounded-lg border-solid border-2 px-4 border-gray-200">
            <div class="text-sm font-semibold mx-2">
              <span>
                Billing Period	
              </span>  
              <span class="text-red-500">
                *
              </span>
            </div>
            <AppDate
              v-model="billing_period_date_start"
              class="md:mx-2"
              required
              removeRequiredSymbol
              :name="'billing_period_date_start'"
              :customPlaceHolder="'Start Date'"
              :error="formError.find(item => item.field === 'billing_period_date_start')"
            />
            <AppDate
              v-model="billing_period_date_end"
              class="md:mx-2 p-2"
              required
              removeRequiredSymbol
              :name="'billing_period_date_end'"
              :customPlaceHolder="'End Date'"
              :isAfterDate="billing_period_date_start"
              :error="formError.find(item => item.field === 'billing_period_date_end')"
            />
            <AppDate
              v-model="due_date"
              class="md:mx-2"
              required
              removeRequiredSymbol
              :name="'due_date'"
              :customPlaceHolder="'Due Date'"
              :isAfter="true"
              :error="formError.find(item => item.field === 'due_date')"
            />
            <!-- <label for="billing_period_date_start">Date Start:</label>
            <input 
              id="billing_period_date_start" 
              v-model="billing_period_date_start" 
              type="date" 
              name="billing_period_date_start"
              placeholder="DD/MM/YYYY"
            >
            <label for="billing_period_date_end">Date End:</label>
            <input 
              id="billing_period_date_end" 
              v-model="billing_period_date_end" 
              type="date" 
              name="billing_period_date_end"
            >
            <label for="due_date">Due Date:</label>
            <input 
              id="due_date" 
              v-model="due_date" 
              type="date" 
              name="due_date"
            > -->
          </div>
        </div>
        <div class="flex flex-col">
          <!-- Upper Filter (Job parts, Required fields) -->
          <div class="flex lg:flex-row flex-col items-center w-full">
            <!-- Job part filters -->
            <div class="flex flex-col p-3">
              <div class="flex flex-row items-center">
                <AppDate
                  v-model="invoiceableDateEnd"
                  class="md:mx-2"
                  :name="'practice_invoiceable_date_end'"
                  :label="'Latest Job Part Date'"
                  :isBefore="true"
                />
                <div class="flex flex-col lg:flex-row mx-4 text-xs md:text-sm">
                  <div class="mr-4">
                    <input id="disputed" v-model="showDisputed" type="checkbox" value="true">
                    <label for="disputed">Include Disputed Invoices</label>
                  </div>
                  <div class="mr-4">
                    <input id="cancelled" v-model="showCancelled" type="checkbox" value="true">
                    <label for="cancelled">Include Cancelled Invoices</label>
                  </div>
                  <div class="mr-4">
                    <input id="completed" v-model="showCompleted" type="checkbox" value="true">
                    <label for="completed">Include Completed Invoices</label>
                  </div>
                  <div class="mr-4">
                    <input id="invoiced" v-model="showInvoiced" type="checkbox" value="true">
                    <label for="invoiced">Include Invoiced Invoices</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Lower Filter (Practice filters) -->
          <div class="flex items-center w-full">
            <div class="md:w-3/12 md:px-1 pb-1">
              <AppInputSmall 
                v-model="search"
                :type="'text'"
                :button="true"
                :buttonLabel="'Search'"
                :placeholder="'Practice Name'"
                @click="search"
              />
            </div>
            <div>
              <AppButton
                class="mx-3 font-bold"
                :customTheme="'border-2 rounded'"
                :label="alphabeticalOrder ? 'Sort Practice Name Z-A' : 'Sort Practice Name A-Z'"
                @click="alphabeticalOrder = !alphabeticalOrder"
              />
            </div>
            <div class="flex mx-4 text-xs md:text-sm">
              <div class="mr-4">
                <input id="standAloneOnly" v-model="showStandAloneOnly" type="checkbox" value="true">
                <label for="standAloneOnly">Show Stand Alone Practices Only</label>
              </div>
              <div class="mr-4">
                <input id="healthBoardsOnly" v-model="showHealthBoardsOnly" type="checkbox" value="true">
                <label for="healthBoardsOnly">Show Hub II Only</label>
              </div>
              <div class="mr-4">
                <input
                  id="independentSpokesOnly"
                  v-model="showIndependentSpokesOnly"
                  type="checkbox"
                  value="true"
                >
                <label for="independentSpokesOnly">Show Billable Spokes Only</label>
              </div>
              <div class="mr-4">
                <input
                  id="dependentSpokesOnly"
                  v-model="showDependentSpokesOnly"
                  type="checkbox"
                  value="true"
                >
                <label for="dependentSpokesOnly">Show Spokes (grouped by Hub)</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ JOB PART PICKER STARTS HERE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`` -->
    
    <div v-if="itemCount === 0">
      <div class="mt-10 w-full text-center py-8">
        No Billable Practices Found.
      </div>
    </div>
    <div v-else class="border-b-2 border-white mt-2">
      <div
        class="hidden md:flex justify-around font-semibold w-full px-4"
      >
        <div class="flex flex-row w-full text-sm justify-around">
          <!-- ORIGINAL -->
          <!-- <div
            class="text-center"
            style="flex: 1 0 0; min-width: 100px; max-width: 250px;" 
          >
            Practice
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 90px; max-width: 100px;"  
          >
            Check
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 90px; max-width: 200px;"  
          >
            Job Part Number
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 90px; max-width: 200px;"  
          >
            Approved at / Completed At
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 90px; max-width: 175px;"  
          >
            Total
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 90px; max-width: 220px;"  
          >
            Status
          </div> -->
          <!-- ORIGINAL ENDS HERE -->

          <!-- FOR QA TESTING ONLY -->
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 100px; max-width: 210px;" 
          >
            Practice
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 70px; max-width: 120px;"  
          >
            Select
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 100px; max-width: 115px;"  
          >
            Job Part No.
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 90px; max-width: 170px;"  
          >
            Approval/Completion Date
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 90px; max-width: 120px;"  
          >
            Amount
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 90px; max-width: 120px;"  
          >
            Invoice Status
          </div>
          <div
            class="text-center"
            style="flex: 1 0 0; min-width: 90px; max-width: 150px;"  
          >
            Disputes
          </div>
          <!-- FOR QA TESTING COLUMNS ENDS HERE -->
        </div>
      </div>

      <!-- OLD -->
      <!-- <div class="w-full h-160 overflow-y-auto rounded-lg">
        <div class="px-2 overflow-x-hidden">
          <AppTable
            :total="itemCount"
            :items="allBillablePractices"
            :currentPage="currentPage"
            :perPage="practiceParams.limit"
            :columns="practiceColumns"
            :orderBy="practiceParams.order_by"
            :disabledHeadings="true"
            :disabledPagination="true"
            :itemsOnTop="true"
            :customItemsWidth="'cursor-default'"
            @pagechanged="pagechanged"
            @checkClicked="toggleCheckPracticeCheckAll"
            @sorted="sorted"
          >
            <template v-slot:checker="slotProps">
              <div class="flex flex-col items-center bg-gray-300 rounded-lg justify-between m-1">
                <div class="text-left">
                  {{ slotProps.item.name }}
                </div>
                <div
                  class="m-1 rounded-full text-center px-4 py-1 w-32"
                  :class="typeStyle(slotProps.item.type)"
                >
                  {{ slotProps.item.type }}
                </div>
                <div
                  v-if="slotProps.item.type === 'Spoke' && slotProps.item.parent_practice"
                  class="text-blue-200 m-1"
                >
                  {{ slotProps.item.parent_practice.name }} (HUB)
                </div>
                <div class="m-1">
                  <input
                    :id="slotProps.item"
                    v-model="chosenPractices"
                    type="checkbox"
                    :value="slotProps.item"
                  >
                  <label :for="slotProps.item">Select All</label>
                </div>
                <div>
                  Picked {{ chosenPracticeJobParts.filter(item => item.practice_id === slotProps.item.id).length }} of {{ slotProps.item.practice_invoiceable_job_parts.length }}
                </div>
              </div>
            </template>

            <template v-slot:invoiceable_job_parts="slotProps">
              <div
                class="md:justify-center md:w-full px-1 xl:px-2 align-middle md:text-center overflow-x-hidden"
              >
                <AppTable
                  :total="slotProps.item.practice_invoiceable_job_parts.length"
                  :items="slotProps.item.practice_invoiceable_job_parts"
                  :columns="jobPartsColumns"
                  :disabledPagination="true"
                  :disabledHeadings="true"
                  :customWidth="'w-full overflow-x-hidden'"
                  :customItemsWidth="'w-full md:w-8/10 cursor-default'"
                  @checkClicked="toggleCheckJobParts"
                  @sorted="sorted"
                >
                  <template v-slot:checker="slotProps">
                    <input
                      :id="slotProps.item"
                      v-model="chosenPracticeJobParts"
                      type="checkbox"
                      :value="slotProps.item"
                    >
                    <label :for="slotProps.item" />
                  </template>
                  <template v-slot:approved_completed_at="slotProps">
                    <div>{{ slotProps.item.approved_at_in_gb_formatted ? slotProps.item.approved_at_in_gb_formatted : slotProps.item.completed_at_in_gb_formatted }}</div>
                  </template>
                  <template v-slot:status_slot="slotProps">
                    <div
                      :class="statusStyle(slotProps.item.invoice_status === 'To Be Invoiced'
                        ? slotProps.item.status === 'Cancelled'
                          ? slotProps.item.status 
                          : slotProps.item.invoice_status  
                        : slotProps.item.invoice_status === 'Disputed'
                          ? slotProps.item.invoice_status 
                          : slotProps.item.status )"
                    >
                      {{ slotProps.item.invoice_status === 'To Be Invoiced'
                        ? slotProps.item.status === 'Cancelled'
                          ? slotProps.item.status
                          : slotProps.item.invoice_status
                        : slotProps.item.invoice_status === 'Disputed'
                          ? slotProps.item.invoice_status
                          : slotProps.item.status }}
                    </div>
                  </template>
                  <template v-slot:job_part_items_disputed_at_slot="slotProps">
                    <div>{{ slotProps.item.job_part_items_disputed_at ? slotProps.item.job_part_items_disputed_at : 'N/A' }}</div>
                  </template>
                </AppTable>
              </div>
            </template>
          </AppTable>
        </div>
      </div> -->
      
      <!-- New -->
      <div class="overflow-auto" style="max-height: 43vh">
        <div v-for="item in allBillablePractices" :key="item.id">
          <div class="flex flex-col lg:flex-row m-2">
            <div 
              class="w-full lg:w-1/5 rounded-l-lg flex flex-col items-center justify-center stripe-gray p-2"
            >
              <div class="flex flex-col">
                <div class="text-center">
                  {{ item.name }}
                </div>

                <div
                  class="rounded-full text-center px-4 py-1"
                  :class="typeStyle(item.type)"
                >
                  {{ item.type }}
                </div>

                <div
                  v-if="item.type === 'Spoke' && item.parent_practice"
                  class="text-blue-400 text-center"
                >
                  {{ item.parent_practice.name }} (HUB)
                </div>

                <div class="relative text-center">
                  <input
                    :id="item.id"
                    v-model="chosenPractices"
                    type="checkbox"
                    :value="item"
                    @click="toggleCheckPracticeCheckAll(item)"
                  >
                  <label :for="item.id">Select All</label>
                  <!-- <AppButton 
                    :label="'Select All'" 
                    :icon="'add-rectangle'" 
                    @click="toggleCheckPracticeCheckAll(item)" 
                  /> -->
                </div>

                <div class="text-center text-sm">
                  {{ chosenJobPartsPerPractice(item) }} / {{ item.practice_invoiceable_job_parts.length }} Selected
                </div>
              </div>
            </div>
            
            <div class="w-full lg:w-4/5">
              <AppTableNew
                :total="item.practice_invoiceable_job_parts.length"
                :items="item.practice_invoiceable_job_parts"
                :columns="jobPartsColumns"
                :disabledPagination="true"
                :disabledHeadings="true"
                :customWidth="'800'"
                minHeight="auto"
                @checkClicked="toggleCheckJobParts"
                @sorted="sorted"
              >
                <template v-slot:checker="slotProps">
                  <input
                    :id="slotProps.item"
                    v-model="chosenPracticeJobParts"
                    type="checkbox"
                    :value="slotProps.item"
                  >
                  <label :for="slotProps.item" />
                </template>
                <template v-slot:approved_completed_at="slotProps">
                  <div>{{ slotProps.item.approved_at_in_gb_formatted ? slotProps.item.approved_at_in_gb_formatted : slotProps.item.completed_at_in_gb_formatted }}</div>
                </template>
                <template v-slot:status_slot="slotProps">
                  <div
                    :class="statusStyle(slotProps.item.invoice_status === 'To Be Invoiced'
                      ? slotProps.item.status === 'Cancelled'
                        ? slotProps.item.status 
                        : slotProps.item.invoice_status  
                      : slotProps.item.invoice_status === 'Disputed'
                        ? slotProps.item.invoice_status 
                        : slotProps.item.status )"
                  >
                    {{ slotProps.item.invoice_status === 'To Be Invoiced'
                      ? slotProps.item.status === 'Cancelled'
                        ? slotProps.item.status
                        : slotProps.item.invoice_status
                      : slotProps.item.invoice_status === 'Disputed'
                        ? slotProps.item.invoice_status
                        : slotProps.item.status }}
                  </div>
                </template>
                <template v-slot:job_part_items_disputed_at_slot="slotProps">
                  <div>{{ slotProps.item.job_part_items_disputed_at ? slotProps.item.job_part_items_disputed_at : 'N/A' }}</div>
                </template>
              </AppTableNew>
            </div>
          </div>
        </div>
      </div>
      <AppPagination
        :total="itemCount"
        :totalPages="totalPages"
        :currentPage="currentPage"
        :perPage="practiceParams.limit"
        @pagechanged="pagechanged"
      />
    </div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  JOB PART PICKER ENDS HERE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    
    <div class="flex flex-row justify-end mt-4">
      <div class="flex flex-col">
        <div 
          v-if="!billing_period_date_start 
            || !billing_period_date_end
            || !due_date
            || chosenPracticeJobParts.length === 0"
        >
          <span class="p-2 bg-red-200 mb-2 py-1 border border-red-400 text-red-600 rounded flex items-center text-sm">
            <svgicon name="exclamation-mark" class="w-4 h-4 mx-2 fill-current" />
            <span>
              Please
            </span>
            <span v-if="chosenPracticeJobParts.length === 0" class="ml-1">
              Choose Job Parts, 
            </span>
            <span v-if="!billing_period_date_start || !billing_period_date_end" class="ml-1">
              Input Billing Date From / To, 
            </span>
            <span v-if="!due_date" class="ml-1">
              Input Due Date,
            </span>
            <span class="ml-1">
              to enable Generate HUBZZ Invoices 
            </span>
            <!-- Please Choose Job Parts, Input Billing Date From / To, and Due Date to enable Generate HUBZZ Invoices -->
          </span>
        </div>
        <div>
          <div class="flex flex-row justify-end">
            <AppButton class="mx-2" :label="'Clear Selection'" :icon="'add-rectangle'" @click="reset()" />
            <AppButton
              class="mx-2"
              :label="'Generate HUBZZ Invoices'"
              :icon="'add-rectangle'"
              :disabled="billing_period_date_start 
                && billing_period_date_end
                && chosenPracticeJobParts.length > 0
                && due_date  
                ? false : true"
              @click="createBulkBillingChecked()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import debounce from "lodash.debounce"
// import AppTable from "@/components/Base/AppTable"
import AppTableNew from '@/components/Base/AppTableNew'
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"
import AppPagination from "@/components/Base/AppPagination"
// import AppInput from "@/components/Base/AppInput"
import AppInputSmall from "@/components/Base/AppInputSmall"
export default {
  components: {
    // AppTable,
    AppTableNew,
    AppDate,
    AppButton,
    AppLoading,
    AppPagination,
    // AppInput,
    AppInputSmall,
  },

  data () {
    return {
      searchMessage: "",
      showSessionsModal: false,
      formError: [],

      // for app table
      currentPage: 1,
      search: "",

      // for bulk billing processing
      showCompleted: false,
      showDisputed: false,
      showCancelled: false,
      showInvoiced: false,
      // query filters
      invoiceableDateEnd: "",

      alphabeticalOrder: false,

      orderAlphabeticalAsc: false,
      orderAlphabeticalDesc: false,
      showIndependentSpokesOnly: false,
      showDependentSpokesOnly: false,
      showStandAloneOnly: false,
      showHealthBoardsOnly: false,

      // form date start, end, due date
      billing_period_date_start: "",
      billing_period_date_end: "",
      due_date: "",

      chosenPractices: [],
      chosenPracticeJobParts: [],

      // tax rate
      practiceTaxRate: 0,
      practiceTaxRateFormatted: 0,

      practiceParams: {
        id: [],
        limit: 20,
        offset: 0,
        order_by: ["created_at:desc"],
        status: ["Active", "Dormant", "Account Suspension"],
        type: [],
        hub_type: [],
        billable_spoke: null,
        verified: true,
        practice_invoiceable_date_start: null,
        practice_invoiceable_date_end: null,
        practice_invoiceable_status: ['Approved'],
        practice_invoiceable: true
      },

      loading: false,
      practiceColumns: [
        // ===========ORIGINAL COLUMNS===========
        // {
        // 	name: 'Practice',
        // 	dataIndex: 'checker',
        // 	class: 'flex-1 mt-4 items-center',
        // 	flex: '1 0 0',
        // 	slotName: 'checker',
        // 	eventName: 'checkClicked',
        // 	minWidth: '100px',
        // 	maxWidth: '250px',
        // },
        // {
        // 	name: 'Job Parts',
        // 	dataIndex: 'invoiceable_job_parts',
        // 	class: 'flex-initial',
        // 	slotName: 'invoiceable_job_parts',
        // 	flex: '1 0 0',
        // 	minWidth: '100px',
        // 	maxWidth: '1000px'
        // },
        // ===========ORIGINAL COLUMNS ENDS HERE===========

        // ===========FOR QA TESTING ONLY===========
        {
          name: 'Practice',
          dataIndex: 'checker',
          class: 'flex-1 mt-4 items-center',
          flex: '1 0 0',
          slotName: 'checker',
          eventName: 'checkClicked',
          minWidth: '100px',
          maxWidth: '200px',
          sortable: false
        },
        {
          name: 'Job Parts',
          dataIndex: 'invoiceable_job_parts',
          class: 'flex-initial',
          slotName: 'invoiceable_job_parts',
          flex: '1 0 0',
          minWidth: '100px',
          maxWidth: '1000px',
          sortable: false
        }
        // ===========FOR QA TESTING ONLY ENDS HERE===========
      ],
      jobPartsColumns: [
        // ===========ORIGINAL COLUMNS===========
        // {
        // 	name: "Check",
        // 	dataIndex: "checker",
        // 	class: "flex items-center justify-center",
        // 	slotName: "checker",
        // 	flex: '1 0 0',
        // 	minWidth: '90px',
        // 	maxWidth: '100px',
        // 	eventName: "checkClicked"
        // },
        // {
        // 	name: "Job Part Number",
        // 	dataIndex: "job_part_number",
        // 	flex: '1 0 0',
        // 	minWidth: '90px',
        // 	maxWidth: '200px',
        // 	class: "flex items-center justify-center",
        // 	sortable: false
        // },
        // {
        // 	name: "Approved At / Completed At",
        // 	slot: true,
        // 	dataIndex: "approved_at",
        // 	flex: '1 0 0',
        // 	minWidth: '90px',
        // 	maxWidth: '200px',
        // 	class: "flex items-center justify-center localDate",
        // 	slotName: "approved_completed_at"
        // },
        // {
        // 	name: "Total",
        // 	dataIndex: "total",
        // 	flex: '1 0 0',
        // 	minWidth: '90px',
        // 	maxWidth: '200px',
        // 	class: "flex items-center justify-center currency",
        // 	sortable: false
        // },
        // {
        // 	name: "Status",
        // 	slot: true,
        // 	dataIndex: "status",
        // 	flex: '1 0 0',
        // 	minWidth: '90px',
        // 	maxWidth: '200px',
        // 	slotName: "status_slot",
        // 	class: "flex items-center justify-center",
        // 	sortable: true
        // },
        // ===========ORIGINAL COLUMNS ENDS HERE===========

        // ===========FOR QA TESTING ONLY===========
        {
          name: "Check",
          dataIndex: "checker",
          slotName: "checker",
          eventName: "checkClicked",
          class:"text-center",
          sortable: false
        },
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: false
        },
        {
          name: "Approved At / Completed At",
          slot: true,
          dataIndex: "approved_at",
          slotName: "approved_completed_at",
          class:"text-center",
          sortable: true
        },
        {
          name: "Total",
          dataIndex: "total",
          class:"text-center",
          sortable: false
        },
        {
          name: "Status",
          slot: true,
          dataIndex: "status",
          slotName: "status_slot",
          class:"text-center",
          sortable: true,
        },
        {
          name: "With Disputes",
          slot: true,
          dataIndex: "job_part_items_disputed_at",
          slotName: "job_part_items_disputed_at_slot",
          class:"text-center",
          sortable: true,
        },
        // ===========FOR QA TESTING COLUMNS ENDS HERE===========
      ]
    }
  },

  computed: {
    authAdminPermissions () {
      return this.$store.getters["permissions"]
    },
    
    loadingBillablePractices () {
      return this.$store.state.billings.loading_billable_practices
    },

    allBillablePractices () {
      return this.$store.state.billings.billable_practices
    },

    itemCount () {
      return this.$store.state.billings.billable_practices_count
    },

    pageCount () {
      return Math.ceil(this.itemCount / this.practiceParams.limit)
    },

    totalPages () {
      return Math.ceil(this.itemCount / this.practiceParams.limit)
    },

    total () {
      return this.allBillablePractices.length
    },
  },

  watch: {
    billing_period_date_start: function (value) {
      if(value !== null) {
        let billing_period_date_start_index = this.formError.findIndex(
          item => item.field === "billing_period_date_start"
        )
        let errors = this.formError.filter(
          item => ["billing_period_date_start"].includes(item.field)
        )
        this.formError.splice(billing_period_date_start_index, errors.length)
      }
    },
    billing_period_date_end: function (value) {
      if(value !== null) {
        let billing_period_date_end_index = this.formError.findIndex(
          item => item.field === "billing_period_date_end"
        )
        let errors = this.formError.filter(
          item => ["billing_period_date_end"].includes(item.field)
        )
        this.formError.splice(billing_period_date_end_index, errors.length)
      }
    },
    due_date: function (value) {
      if(value !== null) {
        let due_date_index = this.formError.findIndex(
          item => item.field === "due_date"
        )
        let errors = this.formError.filter(
          item => ["due_date"].includes(item.field)
        )
        this.formError.splice(due_date_index, errors.length)
      }
    },
    invoiceableDateStart: function (value) {
      if (value > this.invoiceableDateEnd) {
        this.invoiceableDateEnd = ""
      }
      this.practiceParams.practice_invoiceable_date_start = value
    },

    invoiceableDateEnd: function (value) {
      this.practiceParams.practice_invoiceable_date_end = value
      this.getBillablePractices()
    },

    search () {
      this.searchSubmit()
    },

    $route () {
      this.getBillablePractices()
    },

    alphabeticalOrder: function (value) {
      if (value === true) {
        this.practiceParams.order_by = ["practice_name:asc"]
      } else {
        this.practiceParams.order_by = ["created_at:desc"]
      }
      this.getBillablePractices()
    },

    orderAlphabeticalAsc: function (value) {
      if (value === true) {
        this.practiceParams.order_by = ["practice_name:asc"]
        this.orderAlphabeticalDesc = false
      } else {
        this.practiceParams.order_by = ["created_at:desc"]
      }

      this.getBillablePractices()
    },

    orderAlphabeticalDesc: function (value) {
      if (value === true) {
        this.practiceParams.order_by = ["practice_name:desc"]
        this.orderAlphabeticalAsc = false
      } else {
        this.practiceParams.order_by = ["created_at:desc"]
      }

      this.getBillablePractices()
    },

    showIndependentSpokesOnly: function (value) {
      if (value === true) {
        this.practiceParams.billable_spoke = true
      } else {
        this.practiceParams.billable_spoke = null
      }

      this.getBillablePractices()
    },

    showDependentSpokesOnly: function (value) {
      if (value === true) {
        this.practiceParams.billable_spoke = false
      } else {
        this.practiceParams.billable_spoke = null
      }

      this.getBillablePractices()
    },

    showStandAloneOnly: function (value) {
      if (value === true) {
        this.practiceParams.type.push("Stand Alone")
      } else {
        const index = this.practiceParams.type.findIndex(type => {
          return type === "Stand Alone"
        })
        if (index > -1) {
          this.practiceParams.type.splice(index, 1)
        }
      }

      this.getBillablePractices()
    },

    showHealthBoardsOnly: function (value) {
      if (value === true) {
        this.practiceParams.hub_type.push("Type 2")
      } else {
        const index = this.practiceParams.hub_type.findIndex(hub_type => {
          return hub_type === "Type 2"
        })
        if (index > -1) {
          this.practiceParams.hub_type.splice(index, 1)
        }
      }
      this.getBillablePractices()
    },

    showDisputed (value) {
      if (value === true) {
        this.practiceParams.practice_invoiceable_status = [
          ...this.practiceParams.practice_invoiceable_status,
          'Disputed'
        ]
        this.getBillablePractices()
      } else if (value === false) {
        this.practiceParams.practice_invoiceable_status = this.practiceParams.practice_invoiceable_status.filter(item => item !== 'Disputed')
        this.getBillablePractices()
      }
      
      
    },

    showCancelled (value) {
      if (value === true) {
        this.practiceParams.practice_invoiceable_status = [
          ...this.practiceParams.practice_invoiceable_status,
          'Cancelled'
        ]
        this.getBillablePractices()
      } else if (value === false) {
        this.practiceParams.practice_invoiceable_status = this.practiceParams.practice_invoiceable_status.filter(item => item !== 'Cancelled')
        this.getBillablePractices()
      }
    },

    showCompleted (value) {
      if (value === true) {
        this.practiceParams.practice_invoiceable_status = [
          ...this.practiceParams.practice_invoiceable_status,
          'Completed'
        ]
        this.getBillablePractices()
      } else if (value === false) {
        this.practiceParams.practice_invoiceable_status = this.practiceParams.practice_invoiceable_status.filter(item => item !== 'Completed')
        this.getBillablePractices()
      }
    },

    showInvoiced (value) {
      if (value === true) {
        this.practiceParams.practice_invoiceable_status = [
          ...this.practiceParams.practice_invoiceable_status,
          'Invoiced'
        ]
        this.getBillablePractices()
      } else if (value === false) {
        this.practiceParams.practice_invoiceable_status = this.practiceParams.practice_invoiceable_status.filter(item => item !== 'Invoiced')
        this.getBillablePractices()
      }
    },
  },

  async asyncData ({ store, error }) {
    try {
      const authAdminPermissions = store.getters["permissions"]

      if (authAdminPermissions.includes('Create Hubzz Invoices') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

    } catch(err) {
      error({ statusCode: 404 })
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      })
    }
  },

  created () {
    this.$axios.$get(`/api/v1/admin/tax-rates`).then(res => {
      this.practiceTaxRate = res.data.tax_rates.practice_tax_rate
      this.practiceTaxRateFormatted = res.data.tax_rates.practice_tax_rate_formatted
    })
    this.$store.commit("practices/CLEAR_PRACTICES_COUNT")
    this.$store.commit("practices/CLEAR_PRACTICES")
    this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES_COUNT")
    this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES")
    this.getBillablePractices()
  },

  methods: {
    chosenJobPartsPerPractice (practice) {
      return this.chosenPracticeJobParts.filter(item => item.practice_id === practice.id).length
    },

    toggleCheckPracticeCheckAll (item) {
      const index = this.chosenPractices.findIndex(practice => {
        return practice.id === item.id
      })

      if (index > -1) {
        this.chosenPractices.splice(index, 1)
        this.removeAll(item)
      } else {
        this.chosenPractices.push(item)
        this.addAll(item.practice_invoiceable_job_parts)
      }
    },

    removeAll (practice) {
      console.log('removing', practice.id)
      this.chosenPracticeJobParts = this.chosenPracticeJobParts.filter(
        jobPart => jobPart.practice_id !== practice.id
      )
      console.log('removing', this.chosenPracticeJobParts)
    },
    
    addAll (jobParts) {
      console.log('adding', jobParts)
      jobParts.forEach(item => {
        const index = this.chosenPracticeJobParts.findIndex(jobPart => {
          return jobPart.id === item.id
        })

        if (!(index > -1)) {
          this.chosenPracticeJobParts.push(item)
        }
      })
    },

    async createBulkBillingChecked () {
      this.$store.commit("billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES", true)

      let chosenPracticeIds = this.chosenPracticeJobParts.map(item => item.practice_id)

      chosenPracticeIds = [...new Set(chosenPracticeIds)]

      let practiceInvoiceDatas = await chosenPracticeIds.map(practiceId => {
        const chosenJobParts = this.chosenPracticeJobParts.filter(
          jobPart => jobPart.practice_id === practiceId
        )

        const items = chosenJobParts.map(jobPart => {
          const jobPartTotalFinalPaidHoursInMinutes = jobPart.job_part_total_final_paid_hours_in_minutes

          const jobPartTotalFinalPaidHours = parseFloat(jobPartTotalFinalPaidHoursInMinutes / 60).toFixed(2)

          const praticeRate = jobPart.practice_rate.toFixed(2)

          const jobPartTotalFinalPaidHourOnly = Math.floor(jobPartTotalFinalPaidHoursInMinutes / 60)

          const jobPartTotalFinalPaidMinuteOnly = jobPartTotalFinalPaidHoursInMinutes % 60

          return {
            type: "Job Part - " + jobPart.invoice_status,
            job_part_id: jobPart.id,
            total_hours: jobPartTotalFinalPaidHours,
            description:
              jobPart.job_part_number +
              " for £" +
              praticeRate +
              " for a total time of " +
              jobPartTotalFinalPaidHourOnly +
              (jobPartTotalFinalPaidHourOnly > 1 ? " hours " : " hour ") + 
              (jobPartTotalFinalPaidMinuteOnly > 0 ? " and " + jobPartTotalFinalPaidMinuteOnly + (jobPartTotalFinalPaidMinuteOnly > 1 ? " minutes " : " minute ") : "") +
              " from " +
              this.$moment(jobPart.date_start).format('DD/MM/YYYY') +
              " to " +
              this.$moment(jobPart.date_end).format('DD/MM/YYYY'),
            total: parseFloat(jobPartTotalFinalPaidHours * praticeRate).toFixed(2),
          }
        })

        // const vatRegistered = chosenJobParts.filter(item => item.practice_vat_registered === true).length > 0 ? true : false

        const untaxed_total_amount = items.reduce((total_amount, item) => total_amount + parseFloat(item.total), 0)

        const tax_amount = Math.abs(untaxed_total_amount * parseFloat(this.practiceTaxRateFormatted)) 

        const total_amount = untaxed_total_amount + tax_amount

        return {
          practice_id: practiceId,
          items,
          date_start: this.billing_period_date_start,
          date_end: this.billing_period_date_end,
          total_amount,
          tax_amount,
          due_date: this.due_date
        }
      })

      practiceInvoiceDatas = await practiceInvoiceDatas.filter(
        practice => practice.items.length > 0
      )

      await this.$axios
        .post(`/api/v1/admin/practice-invoices/create-bulk`, {
          practice_invoice_datas: practiceInvoiceDatas
        })
        .then(() => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Invoices Successfully Generated"
          })
          this.reset()
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })
          this.$store.commit(
            "billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES",
            false
          )
        })
        .finally(() => {
          this.$store.commit(
            "billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES",
            false
          )
        })	
      
      // this.$store.commit(
      // 	"billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES",
      // 	false
      // )
    },

    goToPage (page) {
      if (page < 1) {
        return
      }

      if (page > this.pageCount) {
        return
      }

      const query = {
        ...this.$router.query,
        page
      }

      if (page === 1) {
        delete query.page
      }

      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
        this.loading = true
      }

      this.$router.push({ query })
    },

    searchSubmit: debounce(function (page, order_by) {
      this.chosenPractices = []
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

      this.getBillablePractices()

      this.$router.push({ query })
    }, 500),

    toggleCheckChosenPractices (item) {
      const index = this.chosenPractices.findIndex(practice => {
        return practice.id === item.id
      })
      if (index > -1) {
        this.chosenPractices.splice(index, 1)
      } else {
        this.chosenPractices.push(item)
      }
    },

    toggleCheckJobParts (item) {
      const index = this.chosenPracticeJobParts.findIndex(jobPart => {
        return jobPart.id === item.id
      })

      if (index > -1) {
        this.chosenPracticeJobParts.splice(index, 1)
      } else {
        this.chosenPracticeJobParts.push(item)
      }
    },

    async getBillablePractices () {
      const params = {
        has_sage_ref: true,
        id: this.practiceParams.id,
        limit: this.practiceParams.limit,
        search: this.search,
        order_by: this.practiceParams.order_by,
        offset: this.practiceParams.offset,
        status: this.practiceParams.status,
        type: this.practiceParams.type,
        hub_type: this.practiceParams.hub_type,
        billable_spoke: this.practiceParams.billable_spoke,
        practice_invoiceable_date_start: this.practiceParams.practice_invoiceable_date_start,
        practice_invoiceable_date_end: this.practiceParams.practice_invoiceable_date_end,
        practice_invoiceable: this.practiceParams.practice_invoiceable,
        practice_invoiceable_status: this.practiceParams.practice_invoiceable_status,
        show_completed: this.showCompleted,
        show_disputed: this.showDisputed,
        show_invoiced: this.showInvoiced,
        show_cancelled: this.showCancelled,
        verified: this.verified,
      }

      this.$store.commit( "billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES", true)

      await Promise.all([
        this.$store.dispatch("billings/fetchBillablePractices", {
          ...params,
          countOnly: true
        }),

        this.$store.dispatch("billings/fetchBillablePractices", {
          ...params,
        }),
      ])

      this.$store.commit( "billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES", false)
    },

    sortData: function (toSortBy) {
      if ((toSortBy = this.sortBy)) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
      }
      this.sortBy = toSortBy
    },

    typeStyle (status) {
      switch (status) {
        case "Hub":
          return "text-red-500 "
        case "Spoke":
          return "text-blue-500"
        case "Stand Alone":
          return "text-indigo-600"
        default:
          return
      }
    },

    hubTypeStyle (hubType) {
      switch (hubType) {
        case "Type 1":
          return "bg-red-500 text-white px-4 py-1"
        case "Type 2":
          return "bg-purple-500 text-white px-4 py-1"
        default:
          return
      }
    },

    pagechanged (page) {
      this.practiceParams.offset = this.practiceParams.limit * (page - 1)
      this.currentPage = page
      this.getBillablePractices()
    },

    reset () {
      this.invoiceableDateEnd = null
      this.practiceParams.practice_invoiceable_date_start = null
      this.practiceParams.practice_invoiceable_date_end = null;
      (this.practiceParams.type = []),
        (this.practiceParams.hub_type = []),
        (this.practiceParams.billable_spoke = null),
        (this.practiceParams.verified = true),
        (this.billing_period_date_start = null)
      this.billing_period_date_end = null
      this.search = ""
      this.chosenPracticeJobParts = []
      this.due_date = ""
      this.showCompleted = false
      this.showDisputed = false
      this.showIndependentSpokesOnly = false
      this.showDependentSpokesOnly = false
      this.showStandAloneOnly = false
      this.showHealthBoardsOnly = false
      this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES_COUNT")
      this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES")
      this.getBillablePractices()
    },

    clearInvoiceableJobParts () {
      this.chosenPracticeJobParts = []
      this.chosenPracticesFinalization = []
      this.showSessionsModal = false
    },

    sorted (order_by) {
      // go back to page 1
      this.currentPage = 1
      // let query = {
      // 	...this.$router.query,
      // 	order_by
      // }
      this.practiceParams.order_by = order_by
      this.getBillablePractices()
    },

    statusStyle (status) {
      switch (status) {
        case "Updated":
          return "text-center w-full text-orange-500"
        case "Disputed":
          return "text-center w-full text-red-500"
        case "Invoiced":
          return "text-center w-full text-teal-500"
        case "To Be Invoiced":
          return "text-center w-full text-indigo-600"
        case "Completed":
          return "text-center w-full text-green-600"
        case "Approved":
          return "text-center w-full text-blue-600"
        case "Cancelled":
          return "text-center w-full text-red-600"
        default:
          return
      }
    },

    goToTab () {
      if (this.$route.name.includes('bulk-billings')) {
        this.$router.push(`/billings/hubzz-billing`)
      } else {
        this.$router.push(`/billings/hubzz-billing/bulk-billings`)
      }
    },
  },
}
</script>

<style>
.md\:table-cell:first-child {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.md\:table-cell:last-child {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.sessions-modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 25px;
  width: 1300px;
  max-width: 95%;
  max-height: 90%;
  overflow: auto;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}
@media screen and (min-width: 768px) {
  .sessions-modal {
    max-height: 90%;
  }
}
.stripe-gray {
  background-color: #f8f8f8;
}

</style>
