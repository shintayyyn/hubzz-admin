<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/locums/compliance-reports" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl text-white">
        Locum Lead Time for Compliance Completed
      </div>
  
      <div class="text-sm md:text-lg text-white">
        Rep-017
      </div>

      <div class="flex-col justify-start items-start w-full shadow-lg p-3 rounded-lg flex bg-waterloo text-white my-2">
        <div class="flex flex-col md:flex-row w-full">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="locumNameIncludes"
              placeholder="Search Locum Name"
              type="text"
              label="Locum Name"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="complianceStatus"
              :type="'select'"
              label="Compliance Status"
              :name="'compliance_status'"
              :placeholder="'Select...'"
              :items="complianceStatusSelectionList"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="minCompliancePercentage"
              placeholder="0.00"
              type="number"
              label="Min % Compliant"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="maxCompliancePercentage"
              placeholder="100.00"
              type="number"
              label="Max % Compliant"
            />
          </div>
        </div>

        <div class="flex flex-col md:flex-row w-full">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="registeredDateStart"
              label="Date Registered Start"
              format="YYYY-MM-DD"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="registeredDateEnd"
              label="Date Registered End"
              format="YYYY-MM-DD"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="approvedDateStart"
              label="Date of Approved Start"
              format="YYYY-MM-DD"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="approvedDateEnd"
              label="Date of Approved End"
              format="YYYY-MM-DD"
            />
          </div>
        </div>

        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <AppButton
            label="Reset"
            :in-style="'padding:5px 14px;margin-bottom:5px'"
            @click="filterReset"
          />

          <AppButton
            class="mx-2"
            label="Submit"
            :in-style="'padding:5px 14px;margin-bottom:5px'"
            @click="filterSearch"
          />
        </div>
      </div>

      <div v-if="false">
        <div>
          <label class="text-white">Limit: </label>

          <select v-model="limit">
            <option v-for="limitOption in limits" :key="`limit_${limitOption}`" :value="limitOption">
              {{ limitOption }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-white">Page: </label>

          <select v-model="activePage">
            <option v-for="page in pages" :key="`page_${page}`" :value="page">
              {{ page }}
            </option>
          </select>
        </div>
      </div>

      <ReportTable
        :limit="limit"
        :items="locumCompletedCompliances"
        :getItemKey="item => item.locum_user_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="setOrderBy"
      />

      <div class="w-full flex flex-wrap justfify-between items-center">
        <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
          <div class="text-white w-full md:w-auto text-center md:text-left">
            <div class="whitespace-no-wrap">
              {{ itemCountInfo }}
            </div>

            <div class="whitespace-no-wrap">
              Page: {{ activePage }} / {{ pages }}
            </div>
            <div class="whitespace-no-wrap">
              Order By: {{ orderByProcessed }}
            </div>
          </div>
        </div>

        <ReportPagination
          :count="count" 
          :pages="pages" 
          :page="activePage"
          @page="setPage" 
        />
      </div>

      <div class="flex-wrap justify-start items-center w-full p-3 flex my-2">
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || locumCompletedCompliances.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="locumCompletedCompliances.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
            @click="downloadCsv"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ReportTable from '@/components/Reports/ReportTable'
  import ReportPagination from '@/components/Reports/ReportPagination'
  import AppInput from '@/components/Base/AppInput'
  import AppButton from '@/components/Base/AppButton'
  import AppDate from '@/components/Base/AppDate'

  export default {
    components: {
      ReportTable,
      ReportPagination,
      AppInput,
      AppButton,
      AppDate,
    },

    data () {
      return {
        loading: false,
        downloading: false,
        count: 0,
        locumCompletedCompliances: [],
        orderBy: [],
        orderByProcessed: '',
        orderBys: [
          {
            title: 'Practice Name (Ascending)',
            column: 'practice_name',
            direction: 'asc',
          },
          {
            title: 'Practice Name (Descending)',
            column: 'practice_name',
            direction: 'desc',
          },
        ],
        limit: 10,
        limits: [
          1,
          2,
          3,
          4,
          5,
          10,
          15,
          20,
          25,
        ],
        activePage: 1,

        locumNameIncludes: '',
        registeredDateStart: '',
        registeredDateEnd: '',
        approvedDateStart: '',
        approvedDateEnd: '',
        complianceStatus: '',
        complianceStatusSelectionList: [
          {
            label: 'All',
            value: '',
          },
          {
            label: 'Empty',
            value: 'Empty',
          },
          {
            label: 'Incomplete',
            value: 'Incomplete',
          },
          {
            label: 'Pending',
            value: 'Pending',
          },
          {
            label: 'Expiring',
            value: 'Expiring',
          },
          {
            label: 'Expired',
            value: 'Expired',
          },
          {
            label: 'Rejected',
            value: 'Rejected',
          },
          {
            label: 'Compliant',
            value: 'Compliant',
          },
        ],
        minCompliancePercentage: '',
        maxCompliancePercentage: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
        const lastItem = Math.min(
          (this.limit * this.activePage) - this.limit
          +
          (this.loading ? this.limit : this.locumCompletedCompliances.length),
          this.count
        )
        
        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return this.activePage * this.limit - this.limit
      },

      columnDetails () {
        return [
          {
            title: '#',
            key: 'index',
            sort_key: null,
            column: (item, index) => this.offset + index + 1,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
          },
          {
            title: 'ID',
            key: 'locum_user_id',
            sort_key: 'locum_user_id',
            column: item => item.locum_user_id,
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
          },
          {
            title: 'Locum Name',
            key: 'locum_user_name',
            sort_key: 'locum_user_name',
            column: item => item.locum_user_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Registered',
            key: 'date_registered_in_gb_formatted',
            sort_key: 'date_registered',
            column: item => item.date_registered_in_gb_formatted,
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
          },
          {
            title: 'Compliance Status',
            key: 'compliance_status',
            sort_key: 'compliance_status',
            column: item => item.compliance_status,
            justify: 'start',
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
          },
          {
            title: 'Date of Approved',
            key: 'first_actived_at_in_gb_formatted',
            sort_key: 'first_actived_at',
            column: item => item.first_actived_at_in_gb_formatted || 'N/A',
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
          },
          {
            title: '% Compliant',
            key: 'compliance_percentage',
            sort_key: 'compliance_percentage',
            column: item => item.compliance_percentage,
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
          },
        ]
      },

      pages () {
        return Math.max(Math.ceil(this.count / this.limit), 1)
      },
    },

    watch: {
      limit () {
        this.page = 1
        this.getLocumCompletedCompliances()
      },
      orderBy (value) {
        let replaced = ''
        if(value.length > 0) {
          replaced = value[0].replace(/_/g, ' ')
          replaced = replaced.replace(/:/g, ' - ')
          replaced = replaced.replace(/(^\w{1})|(\s{1}\w{1})/g, word => word.toUpperCase())
          replaced = replaced.replace('Desc', 'Descending')
          replaced = replaced.replace('Asc', 'Ascending')
        } 
        this.orderByProcessed = replaced
        this.getLocumCompletedCompliances()
      },
    },

    mounted () {      
     const {
        locum_name_includes: locumNameIncludes,
        min_compliance_percentage: minCompliancePercentage,
        max_compliance_percentage: maxCompliancePercentage,
        compliance_status: complianceStatus,
        registered_at_date_start: registeredDateStart,
        registered_at_date_end: registeredDateEnd,
        approved_at_date_start: approvedDateStart,
        approved_at_date_end: approvedDateEnd,
        order_by: orderBy = [],
        page,
      } = this.$route.query

      this.locumNameIncludes = locumNameIncludes ? locumNameIncludes : ''
      this.minCompliancePercentage = minCompliancePercentage ? minCompliancePercentage : ''
      this.maxCompliancePercentage = maxCompliancePercentage ? maxCompliancePercentage : ''
      this.complianceStatus = complianceStatus ? complianceStatus : ''
      this.registeredDateStart = registeredDateStart ? registeredDateStart : ''
      this.registeredDateEnd = registeredDateEnd ? registeredDateEnd : ''
      this.approvedDateStart = approvedDateStart ? approvedDateStart : ''
      this.approvedDateEnd = approvedDateEnd ? approvedDateEnd : ''

      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getLocumCompletedCompliances()
    },

    methods: {
      filterReset () {
        this.locumNameIncludes = ''
        this.complianceStatus = ''
        this.minCompliancePercentage = ''
        this.maxCompliancePercentage = ''
        this.registeredDateStart = ''
        this.registeredDateEnd = ''
        this.approvedDateStart = ''
        this.approvedDateEnd = ''

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
          min_compliance_percentage: this.minCompliancePercentage ? this.minCompliancePercentage : undefined,
          max_compliance_percentage: this.maxCompliancePercentage ? this.maxCompliancePercentage : undefined,
          compliance_status: this.complianceStatus ? this.complianceStatus : undefined,
          registered_at_date_start: this.registeredDateStart ? this.registeredDateStart : undefined,
          registered_at_date_end: this.registeredDateEnd ? this.registeredDateEnd : undefined,
          approved_at_date_start: this.approvedDateStart ? this.approvedDateStart : undefined,
          approved_at_date_end: this.approvedDateEnd ? this.approvedDateEnd : undefined,
          order_by: this.orderBy ? this.orderBy : undefined,
          page: undefined,
        }

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.$router.replace({ query })
        }
        
        this.getLocumCompletedCompliances()
      },

      setPage (page) {
        this.activePage = page

        if (this.activePage === 1) {
          this.$router.replace({
            query: {
              ...this.$route.query,
              page: undefined,
            }
          })
        } else {
          this.$router.replace({
            query: {
              ...this.$route.query,
              page: this.activePage,
            }
          })
        }

        this.getLocumCompletedCompliances()
      },

      setOrderBy (orderBy) {
        this.orderBy = orderBy
        this.activePage = 1

        this.$router.replace({
          query: {
            ...this.$route.query,
            order_by: this.orderBy,
            page: undefined,
          }
        })

        this.getLocumCompletedCompliances()
      },

      getLocumCompletedCompliances () {
        this.loading = true
        this.locumCompletedCompliances = []

        const params = {
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
          min_compliance_percentage: this.minCompliancePercentage ? this.minCompliancePercentage : undefined,
          max_compliance_percentage: this.maxCompliancePercentage ? this.maxCompliancePercentage : undefined,
          compliance_status: this.complianceStatus ? this.complianceStatus : undefined,
          registered_at_date_start: this.registeredDateStart ? this.registeredDateStart : undefined,
          registered_at_date_end: this.registeredDateEnd ? this.registeredDateEnd : undefined,
          approved_at_date_start: this.approvedDateStart ? this.approvedDateStart : undefined,
          approved_at_date_end: this.approvedDateEnd ? this.approvedDateEnd : undefined,
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/reports/locum-completed-compliances/count', {
            params: {
              ...params,
            },
          }).then(responses => responses.data.data.count),

          this.$axios.get('/api/v1/admin/reports/locum-completed-compliances', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then(responses => responses.data.data.locum_completed_compliances),

          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            locumCompletedCompliances,
          ] = results

          this.count = count
          this.locumCompletedCompliances = locumCompletedCompliances
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      downloadCsv () {
        this.downloading = true
        const params = {
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
          min_compliance_percentage: this.minCompliancePercentage ? this.minCompliancePercentage : undefined,
          max_compliance_percentage: this.maxCompliancePercentage ? this.maxCompliancePercentage : undefined,
          compliance_status: this.complianceStatus ? this.complianceStatus : undefined,
          registered_at_date_start: this.registeredDateStart ? this.registeredDateStart : undefined,
          registered_at_date_end: this.registeredDateEnd ? this.registeredDateEnd : undefined,
          approved_at_date_start: this.approvedDateStart ? this.approvedDateStart : undefined,
          approved_at_date_end: this.approvedDateEnd ? this.approvedDateEnd : undefined,
          order_by: this.orderBy,
          limit: 999,
          offset: 0,
        }

        this.$axios.post('/api/v1/admin/reports/locum-completed-compliances/generate-key', {
          filename: `locumCompletedComplianceDocumentsReport.csv`,
        }, {
          params: {
            ...params,
          },
        }).then((responses) => {
          const token = responses.data.data.token

          window.open(`${process.env.API_URL}/api/v1/admin/reports/locum-completed-compliances/csv?token=${token}`)
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err.response ? err.response.data : err)
        }).finally(() => {
          this.downloading = false
        })
      },
    },

  }
</script>
