<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/practices/practice-compliance-reports" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl text-white">
        Practice Lead Time for Activation
      </div>
  
      <div class="text-sm md:text-lg text-white">
        Rep-018
      </div>

      <div
        class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg flex bg-waterloo text-white my-2"
      >
        <div class="flex flex-row w-full">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="practiceNameIncludes"
              placeholder="Search Practice Name"
              type="text"
              label="Practice Name"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="practiceStatus"
              class="w-full mr-2"
              :type="'select'"
              :name="'practiceStatus'"
              :placeholder="'Filter by Status'"
              :items="[
                {label: 'Active', value: 'Active'},
                {label: 'Inactive', value: 'Inactive'},
                {label: 'Dormant', value: 'Dormant'},  
                {label: 'Account Suspension', value: 'Account Suspension'},
                {label: 'Compliance Suspension', value: 'Compliance Suspension'},
              ]"
              :label="'Status'"
            />
          </div>
        </div>
        
        <div class="flex flex-row w-full">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="registeredDateStart"
              label="Registered Date Start"
              format="YYYY-MM-DD"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="registeredDateEnd"
              label="Registered Date End"
              format="YYYY-MM-DD"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="approvedDateStart"
              label="Approved Date Start"
              format="YYYY-MM-DD"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="approvedDateEnd"
              label="Approved Date End"
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

      <div v-if="true">
        <div>
          <label class="text-white">Limit: </label>
          <select v-model="limit">
            <option v-for="limit in limits" :key="`limit_${limit}`" :value="limit">
              {{ limit }}
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
        :items="activatedPractices"
        :getItemKey="(item) => item.practice_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="(value) => orderBy = value"
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
      <div
        v-if="authAdminPermissions.includes('Generate Reports')"
        class="flex-wrap justify-start items-center w-full p-3 flex my-2"
      >
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || activatedPractices.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="activatedPractices.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
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
import AppButton from '@/components/Base/AppButton'
import AppDate from '@/components/Base/AppDate'
import AppInput from '@/components/Base/AppInput'
  export default {
    components: {
      ReportTable,
      ReportPagination,
      AppButton,
      AppDate,
      AppInput,
    },

    data () {
      return {
        loading: false,
        count: 0,
        downloading: false,
        activatedPractices: [],
        orderBy: [],
        orderByProcessed: [],
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

        practiceNameIncludes: '',
        practiceStatus: '',
        registeredDateStart: '',
        registeredDateEnd: '',
        approvedDateStart: '',
        approvedDateEnd: '',
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },

      itemCountInfo () {
        const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
        const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.activatedPractices.length), this.count)
        
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
          },
          {
            title: 'Practice Name',
            key: 'practice_name',
            sort_key: 'practice_name',
            column: (item) => item.practice_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Registered',
            key: 'date_registered',
            sort_key: 'date_registered',
            column: (item) => this.$moment(item.date_registered, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Sage Ref',
            key: 'sage_ref',
            sort_key: 'sage_ref',
            column: (item) => item.sage_ref ? item.sage_ref : 'N/A',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          // {
          //   title: 'Nominal Code',
          //   key: 'nominal_code',
          //   sort_key: 'nominal_code',
          //   column: (item) => item.nominal_code ? item.nominal_code : 'N/A',
          //   justify: 'start',
          //   flexGrow: 1,
          //   flexShrink: 0,
          // },
          {
            title: 'Direct Debit Set Up',
            key: 'direct_debit',
            sort_key: 'direct_debit',
            column: (item) => item.direct_debit ? 'Yes' : 'No',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Approved',
            key: 'first_actived_at',
            sort_key: 'first_actived_at',
            column: (item) => item.first_actived_at_in_gb ? this.$moment(item.first_actived_at_in_gb, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Days taken before Approval',
            key: 'days_before_approval',
            sort_key: 'days_before_approval',
            column: (item) => `${item.days_before_approval} Days`,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Status',
            key: 'status',
            sort_key: 'status',
            column: (item) => item.status,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
        ]
      },

      pages () {
        return Math.max(Math.ceil(this.count / this.limit), 1)
      },
    },

    watch: {
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
        this.getActivatedPractices()
      },

      limit () {
        this.page = 1
        this.getActivatedPractices()
      },

      activePage () {
        this.getActivatedPractices()
      },
    },

    mounted () {      
      const {
        practice_name_includes: practiceNameIncludes,
        practice_status: practiceStatus,
        registered_at_date_start: registeredDateStart,
        registered_at_date_end: registeredDateEnd,
        approved_at_date_start: approvedDateStart,
        approved_at_date_end: approvedDateEnd,
        order_by: orderBy = [],
        page,
      } = this.$route.query

      this.practiceStatus = practiceStatus ? practiceStatus : ''
      this.practiceNameIncludes = practiceNameIncludes ? practiceNameIncludes : ''
      this.registeredDateStart = registeredDateStart ? registeredDateStart : ''
      this.registeredDateEnd = registeredDateEnd ? registeredDateEnd : ''
      this.approvedDateStart = approvedDateStart ? approvedDateStart : ''
      this.approvedDateEnd = approvedDateEnd ? approvedDateEnd : ''

      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getActivatedPractices()
    },

    methods: {
      filterReset () {
        this.practiceNameIncludes = ''
        this.practiceStatus = ''
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
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
          practice_status: this.practiceStatus ? this.practiceStatus : undefined,
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
        
        this.getActivatedPractices()
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

        this.getActivatedPractices()
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

        this.getActivatedPractices()
      },

      getActivatedPractices () {
        this.loading = true
        this.activatedPractices = []

        const params = {
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
          practice_status: this.practiceStatus ? this.practiceStatus : undefined,
          registered_at_date_start: this.registeredDateStart ? this.registeredDateStart : undefined,
          registered_at_date_end: this.registeredDateEnd ? this.registeredDateEnd : undefined,
          approved_at_date_start: this.approvedDateStart ? this.approvedDateStart : undefined,
          approved_at_date_end: this.approvedDateEnd ? this.approvedDateEnd : undefined,
        }
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/activated-practices/count', {
            params
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/activated-practices', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.activated_practices
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            activatedPractices,
          ] = results

          this.count = count
          this.activatedPractices = activatedPractices
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
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
          practice_status: this.practiceStatus ? this.practiceStatus : undefined,
          registered_at_date_start: this.registeredDateStart ? this.registeredDateStart : undefined,
          registered_at_date_end: this.registeredDateEnd ? this.registeredDateEnd : undefined,
          approved_at_date_start: this.approvedDateStart ? this.approvedDateStart : undefined,
          approved_at_date_end: this.approvedDateEnd ? this.approvedDateEnd : undefined,
          order_by: this.orderBy,
          limit: 999,
          offset: 0,
        }

        this.$axios.post('/api/v1/admin/reports/activated-practices/generate-key', {
          filename: `activatedPractices.csv`,
        }, {
          params: {
            ...params,
          },
        }).then((responses) => {
          console.log('responses', responses)
          const token = responses.data.data.token

          window.open(`${process.env.API_URL}/api/v1/admin/reports/activated-practices/csv?token=${token}`)
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
