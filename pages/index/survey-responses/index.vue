<template>
  <section class="flex-1 flex-col py-2 px-2">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-yellow-500 mb-2 pt-1">
      <nuxt-link
        v-for="tab in domainTabs"
        :key="tab.domain"
        :to="tab.to"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="tab.active ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
      >
        {{ tab.label }}
      </nuxt-link>
    </div>

    <section class="flex-1 flex flex-col overflow-y-auto">
      <div class="flex flex-col md:flex-row md:items-center">
        <div class="flex flex-col w-full justify-start mb-2">
          <div class="flex">
            <div class="flex w-full">
              <div class="md:w-4/12">
                <AppInputSmall
                  v-model="search"
                  :type="'text'"
                  :name="'search'"
                  :button="true"
                  :buttonLabel="'Search'"
                  :placeholder="
                    surveyDomain === 'Locum' ? 'Search Locum ID, Name, Email' : 'Search Practice User ID, Name, Email / Practice ID, Name'
                  "
                  @click="searchSubmit()"
                />
              </div>

              <div class="mx-1 my-2">
                <AppButton
                  label="Filters"
                  icon="caret-down"
                  :rotate="filterModal ? 180 : ''"
                  :customTheme="'border-2 border-gray-400 rounded-lg font-bold text-gray-600'"
                  labelClass="flex-row-reverse mr-2"
                  iconWidth="10"
                  @click="filterModal = !filterModal"
                />
              </div>

              <template v-if="filterModal">
                <div class="mx-1 my-2">
                  <AppButton
                    label="Apply"
                    :customTheme="'bg-orange-400 hover:bg-orange-500 text-gray-700 border border-gray-400 rounded'"
                    @click="submitFilters()"
                  />
                </div>
                <div class="mx-1 my-2">
                  <AppButton
                    label="Clear"
                    :customTheme="'bg-gray-400 hover:bg-gray-500 text-black border border-gray-400 rounded'"
                    @click="filterReset"
                  />
                </div>
              </template>
            </div>
          </div>

          <div class="flex flex-col flex-wrap justify-start items-start w-full rounded-lg -mt-3" :class="filterModal ? 'flex' : 'hidden'">
            <div class="text-gray-800 w-full md:w-4/12 mr-2">
              <AppInputSmall
                v-model="locumProfessionId"
                :type="'select'"
                :name="'locum_profession'"
                :placeholder="'Locum Profession'"
                :items="locumProfessionSelection"
              />
            </div>
            <div class="flex items-end mx-2">
              <div class="text-gray-800">
                <AppDate v-model="dateSubmittedStart" :name="'date_start'" :label="'Date Submitted Start'" isBefore />
              </div>
              <div class="mx-2 text-gray-800">
                <AppDate v-model="dateSubmittedEnd" :name="'date_end'" :label="'Date Submitted End'" isBefore />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppTableNew
        v-if="count !== 0"
        :total="count"
        :items="surveyResponses"
        :currentPage="currentPage"
        :perPage="limit"
        :columns="columns"
        :loading="gettingSurveyResponses"
        :routerLink="`/survey-responses`"
        :orderBy="orderBy"
        :customWidth="'800'"
        :min-height="'55vh'"
        @pagechanged="pageChangedHandler"
        @sorted="_orderBy => (orderBy = _orderBy)"
        @limitchanged="limitChangedHandler"
      >
        <template v-slot:status_slot="slotProps">
          <div class="text-center text-xs" :class="statusStyle(slotProps.item.status)">
            {{ slotProps.item.status }}
          </div>
        </template>
        <template v-slot:compliance_slot="slotProps">
          <div class="text-center text-xs" :class="complianceStatusStyle(slotProps.item.compliance_status)">
            {{ slotProps.item.compliance_status }}
          </div>
        </template>
        <template v-slot:registration_type_slot="slotProps">
          <div class="text-center text-xs">
            {{ registrationType(slotProps.item.referrer_domain) }}
          </div>
        </template>
      </AppTableNew>

      <div v-if="count === 0 && !gettingSurveyResponses" class="mt-2 w-full text-center">
        <span>{{ hasFilter ? 'No survey responses found.' : 'No survey responses.' }}</span>
      </div>

      <div class="flex-wrap justify-start items-center w-full p-3 flex my-2">
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || count === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="count === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-sunglow hover:bg-sunglow-dark cursor-pointer'"
            @click="downloadCsv"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      <nuxt-child @updateLocumUsers="getAllSurveyResponses" />
    </section>
  </section>
</template>

<script>
import debounce from 'lodash.debounce'
import AppTableNew from '@/components/Base/AppTableNew'
import AppInputSmall from '@/components/Base/AppInputSmall'
import AppDate from '@/components/Base/AppDate'
import AppButton from '@/components/Base/AppButton'

const API_BASE = '/api/v1/admin/survey-responses'

const LOCUM_COLUMNS = [
  {
    name: 'Survey Response ID',
    dataIndex: 'id',
    class: 'md:text-center',
    sortable: true,
    flex: '1 0 0',
    minWidth: '100px',
    maxWidth: '140px',
    width: 200
  },
  { name: 'User ID', dataIndex: 'user_id', class: 'md:text-center', sortable: true, flex: '1 0 0', minWidth: '100px', maxWidth: '140px', width: 200 },
  { name: 'Locum Name', dataIndex: 'user_name', class: 'md:text-center', sortable: true, flex: '1 0 0', minWidth: '120px', maxWidth: '550px' },
  {
    name: 'Profession',
    dataIndex: 'locum_profession_name',
    class: 'md:text-center',
    sortable: true,
    flex: '1 0 0',
    minWidth: '120px',
    maxWidth: '550px'
  },
  { name: 'E-Mail Address', dataIndex: 'user_email', class: 'md:text-center', sortable: true, flex: '1 0 0', minWidth: '120px', maxWidth: '550px' },
  {
    name: 'Date Submitted',
    dataIndex: 'created_at_in_gb_formatted',
    class: 'md:text-center',
    sortable: true,
    flex: '1 0 0',
    minWidth: '100px',
    maxWidth: '170px',
    width: 200
  }
]

const PRACTICE_COLUMNS = [
  {
    name: 'Survey Response ID',
    dataIndex: 'id',
    class: 'md:text-center',
    sortable: true,
    flex: '1 0 0',
    minWidth: '100px',
    maxWidth: '140px',
    width: 200
  },
  {
    name: 'Practice ID',
    dataIndex: 'practice_id',
    class: 'md:text-center',
    sortable: true,
    flex: '1 0 0',
    minWidth: '100px',
    maxWidth: '140px',
    width: 200
  },
  { name: 'Practice Name', dataIndex: 'practice_name', class: 'md:text-center', sortable: true, flex: '1 0 0', minWidth: '120px', maxWidth: '550px' },
  {
    name: 'Practice User ID',
    dataIndex: 'user_id',
    class: 'md:text-center',
    sortable: true,
    flex: '1 0 0',
    minWidth: '100px',
    maxWidth: '140px',
    width: 200
  },
  {
    name: 'Practice User Name',
    dataIndex: 'user_name',
    class: 'md:text-center',
    sortable: true,
    flex: '1 0 0',
    minWidth: '120px',
    maxWidth: '550px'
  },
  { name: 'E-Mail Address', dataIndex: 'user_email', class: 'md:text-center', sortable: true, flex: '1 0 0', minWidth: '120px', maxWidth: '550px' },
  {
    name: 'Date Submitted',
    dataIndex: 'created_at_in_gb_formatted',
    class: 'md:text-center',
    sortable: true,
    flex: '1 0 0',
    minWidth: '100px',
    maxWidth: '170px',
    width: 200
  }
]

const STATUS_STYLES = {
  Active: 'text-green-700',
  Inactive: 'text-gray-700',
  Deactivated: 'text-black',
  'Account Suspension': 'text-red-600',
  'Compliance Suspension': 'text-red-600',
  Dormant: 'text-gray-500',
  Bogus: 'text-gray-600'
}

const COMPLIANCE_STYLES = {
  Empty: 'text-gray-400',
  Incomplete: 'text-orange-600',
  Pending: 'text-yellow-800',
  Expiring: 'text-red-400',
  Expired: 'text-red-500',
  Rejected: 'text-orange-700',
  Compliant: 'text-green-700'
}

const REGISTRATION_TYPES = {
  Practice: 'Referred by Practice',
  Locum: 'Referred by Locum'
}

const CSV_FILENAMES = {
  Locum: 'survey_locum_responses.csv',
  Practice: 'survey_practice_responses.csv'
}

export default {
  components: { AppTableNew, AppInputSmall, AppButton, AppDate },

  data() {
    return {
      gettingSurveyResponses: false,
      currentPage: 1,
      filterStatus: null,
      filterCompliances: null,
      search: '',
      limit: 15,
      orderBy: ['created_at_in_gb_formatted:desc'],
      count: 0,
      surveyResponses: [],

      locumProfessionId: null,
      professions: [],

      filterModal: false,
      dateSubmittedStart: null,
      dateSubmittedEnd: null,

      downloading: false,
      downloadToken: null
    }
  },

  computed: {
    surveyDomain() {
      return this.$route.query.survey_domain || 'Locum'
    },

    domainTabs() {
      const currentName = this.$route.name
      const currentDomain = this.$route.query.survey_domain
      return [
        {
          domain: 'Locum',
          label: 'Locum',
          to: '/survey-responses',
          active: currentName === 'index-survey-responses' && (!currentDomain || currentDomain === 'Locum')
        },
        {
          domain: 'Practice',
          label: 'Practice',
          to: '/survey-responses?survey_domain=Practice',
          active: currentName === 'index-survey-responses' && currentDomain === 'Practice'
        }
      ]
    },

    locumProfessionSelection() {
      return this.professions.map(({ name, id }) => ({ label: name, value: id }))
    },

    columns() {
      return this.surveyDomain === 'Locum' ? LOCUM_COLUMNS : PRACTICE_COLUMNS
    },

    offset() {
      return this.limit * (this.currentPage - 1)
    },

    hasFilter() {
      return this.search || this.filterStatus || this.filterCompliances
    },

    activeFilters() {
      const filters = {}
      if (this.surveyDomain) filters.survey_domain = this.surveyDomain
      if (this.search) filters.search = this.search
      if (this.locumProfessionId) filters.locum_profession_id = this.locumProfessionId
      if (this.dateSubmittedStart) filters.date_submitted_start = this.dateSubmittedStart
      if (this.dateSubmittedEnd) filters.date_submitted_end = this.dateSubmittedEnd
      return filters
    },

    orderByValue: {
      get() {
        return this.orderBy.length > 0 ? this.orderBy[0] : null
      },
      set(orderBy) {
        this.orderBy = [orderBy]
      }
    }
  },

  watch: {
    search() {
      this.searchSubmit()
    },

    orderBy() {
      this.currentPage = 1
      this.getAllSurveyResponses()
    },

    surveyDomain() {
      this.currentPage = 1
      this.getAllSurveyResponses()
    }
  },

  mounted() {
    this.count = 0
    this.surveyResponses = []
    this.getAllSurveyResponses()

    this.$axios
      .get('/api/v1/admin/professions')
      .then(response => {
        this.professions = response.data.data.professions
      })
      .catch(this.errorHandler)
  },

  methods: {
    downloadCsv() {
      window.open(`${process.env.API_URL}${API_BASE}/csv?token=${this.downloadToken}`)
    },

    submitFilters() {
      this.currentPage = 1
      this.getAllSurveyResponses()
    },

    errorHandler(err) {
      const message = err.response?.data?.message || (err.request ? 'Something went wrong!' : err.message)

      if (message) {
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: message })
      }
    },

    getAllSurveyResponses() {
      const filters = this.activeFilters
      const filename = CSV_FILENAMES[this.surveyDomain] ?? 'survey_responses.csv'

      this.gettingSurveyResponses = true

      Promise.all([
        this.$axios.get(`${API_BASE}/count`, { params: filters }).then(res => res.data.data.count),

        this.$axios
          .get(API_BASE, {
            params: { ...filters, order_by: this.orderBy, limit: this.limit, offset: this.offset }
          })
          .then(res => res.data.data.survey_responses),

        this.$axios.post(`${API_BASE}/generate-key`, { filename }, { params: filters }).then(res => res.data.data.token)
      ])
        .then(([count, surveyResponses, downloadToken]) => {
          this.count = count
          this.surveyResponses = surveyResponses
          this.downloadToken = downloadToken
        })
        .catch(this.errorHandler)
        .finally(() => {
          this.gettingSurveyResponses = false
        })
    },

    searchSubmit: debounce(function() {
      this.currentPage = 1
      this.getAllSurveyResponses()
    }, 500),

    filterReset() {
      this.search = null
      this.locumProfessionId = null
      this.filterStatus = null
      this.filterCompliances = null
      this.dateSubmittedStart = null
      this.dateSubmittedEnd = null
      this.getAllSurveyResponses()
    },

    pageChangedHandler(page) {
      this.currentPage = page
      this.getAllSurveyResponses()
    },

    limitChangedHandler(limit) {
      this.currentPage = 1
      this.limit = limit
      this.getAllSurveyResponses()
    },

    statusStyle(status) {
      return STATUS_STYLES[status]
    },

    complianceStatusStyle(status) {
      return COMPLIANCE_STYLES[status]
    },

    registrationType(type) {
      return REGISTRATION_TYPES[type] ?? 'Organic'
    }
  }
}
</script>

<style>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
.page-button-disabled {
  background: linear-gradient(to top, #6b717e, #6b7386);
  cursor: not-allowed;
}
.page-button:active {
  transform: translate(2px, 2px);
}
</style>
