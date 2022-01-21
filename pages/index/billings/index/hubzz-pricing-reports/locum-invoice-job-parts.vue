
<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl">
        Hours Approved
      </div>
  
      <div class="text-sm md:text-lg">
        Rep-030
      </div>

      <div
        class="flex-col justify-start items-start w-full border p-3 rounded-lg flex my-2"
      >
        <div class="flex flex-row w-full">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="practiceNameIncludes"
              placeholder="Search by Practice Name"
              type="text"
              label="Practice Name"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="locumInvoiceStatus"
              class="w-full mr-2"
              :type="'select'"
              :name="'locumInvoiceStatus'"
              :placeholder="'Filter by Locum Invoice Status'"
              :items="[
                {label: 'Invoiced', value: 'Invoiced'},
                {label: 'Approved', value: 'Approved'}, 
                {label: 'To Be Invoiced', value: 'To Be Invoiced'},
                {label: 'Disputed', value: 'Disputed'},
              ]"
              :label="'Locum Invoice Status'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="hubzzInvoiceStatus"
              class="w-full mr-2"
              :type="'select'"
              :name="'hubzzInvoiceStatus'"
              :placeholder="'Filter by HUBZZ Invoice Status'"
              :items="[
                {label: 'Paid', value: 'Paid'},
                {label: 'To Be Invoiced', value: 'To Be Invoiced'}, 
                {label: 'Invoiced', value: 'Invoiced'},
                {label: 'Invoiced Before Approval', value: 'Invoiced Before Approval'},
              ]"
              :label="'HUBZZ Invoice Status'"
            />
          </div>
        </div>
        
        

        <div class="flex flex-row w-full">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="dateStart"
              label="Job Part Date Start"
              format="YYYY-MM-DD"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="dateEnd"
              label="Job Part Date End"
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
        :items="locumInvoiceJobParts"
        :getItemKey="(item) => item.job_part_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="(value) => orderBy = value"
      />

      <div v-if="!loading && locumInvoiceJobParts.length === 0 && !practiceNameIncludes" class="w-full flex justify-center">
        The are no Hours Approved.
      </div>

      <div v-if="!loading && locumInvoiceJobParts.length === 0 && practiceNameIncludes" class="w-full flex justify-center">
        No Practices Found.
      </div>

      <div class="w-full flex flex-wrap justfify-between items-center">
        <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
          <div class="w-full md:w-auto text-center md:text-left">
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
        class="flex-wrap justify-start items-center w-full p-3 flex my-2"
      >
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || locumInvoiceJobParts.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="locumInvoiceJobParts.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
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
        count: 0,
        downloading: false,
        locumInvoiceJobParts: [],
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

        practiceNameIncludes: '',
        areaPostcode: '',
        dateStart: '',
        dateEnd: '',
        locumInvoiceStatus: '',
        hubzzInvoiceStatus: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
        const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.locumInvoiceJobParts.length), this.count)
        
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
            column: (_, index) => this.offset + index + 1,
            justify: 'start',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Practice',
            key: 'practice_name',
            sort_key: 'practice_name',
            column: (item) => item.practice_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Number',
            key: 'job_part_number',
            sort_key: 'job_part_number',
            column: (item) => item.job_part_number,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Start',
            key: 'date_start',
            sort_key: 'date_start',
            column: (item) => item.date_start ? this.$moment(item.date_start, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date End',
            key: 'date_end',
            sort_key: 'date_end',
            column: (item) => item.date_end ? this.$moment(item.date_end, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Total Hours',
            key: 'final_hours',
            sort_key: 'final_hours',
            column: (item) => (parseFloat(item.final_hours)/60).toFixed(2),
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Locum Invoice Status',
            key: 'invoice_status',
            sort_key: 'invoice_status',
            column: (item) => item.invoice_status,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'HUBZZ Invoice Status',
            key: 'hubzz_invoice_status',
            sort_key: 'hubzz_invoice_status',
            column: (item) => item.hubzz_invoice_status ? item.hubzz_invoice_status : "N/A",
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
        this.getLocumInvoiceJobParts()
      },

      limit () {
        this.page = 1
        this.getLocumInvoiceJobParts()
      },

      activePage () {
        this.getLocumInvoiceJobParts()
      },
    },

    mounted () {      
     const {
        practice_name_includes: practiceNameIncludes,
        locum_invoice_status: locumInvoiceStatus,
        hubzz_invoice_status: hubzzInvoiceStatus,
        date_start: dateStart,
        date_end: dateEnd,
        order_by: orderBy = [],
        page,
      } = this.$route.query

      this.practiceNameIncludes = practiceNameIncludes ? practiceNameIncludes : ''
      this.dateStart = dateStart ? dateStart : ''
      this.dateEnd = dateEnd ? dateEnd : ''
      this.locumInvoiceStatus = locumInvoiceStatus ? this.locumInvoiceStatus: ''
      this.hubzzInvoiceStatus = hubzzInvoiceStatus ? this.hubzzInvoiceStatus: ''

      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getLocumInvoiceJobParts()
    },

    methods: {
      filterReset () {
        this.practiceNameIncludes = ''
        this.locumInvoiceStatus = ''
        this.hubzzInvoiceStatus = ''
        this.dateStart = ''
        this.dateEnd = ''

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
          locum_invoice_status: this.locumInvoiceStatus ? this.locumInvoiceStatus: undefined,
          hubzz_invoice_status: this.hubzzInvoiceStatus ? this.hubzzInvoiceStatus: undefined,
          date_start: this.dateStart ? this.dateStart : undefined,
          date_end: this.dateEnd ? this.dateEnd : undefined,
          order_by: this.orderBy ? this.orderBy : undefined,
          page: undefined,
        }

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.$router.replace({ query })
        }
        
        this.getLocumInvoiceJobParts()
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

        this.getLocumInvoiceJobParts()
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

        this.getLocumInvoiceJobParts()
      },

      getLocumInvoiceJobParts () {
        this.loading = true
        this.locumInvoiceJobParts = []

        const params = {
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
          locum_invoice_status: this.locumInvoiceStatus ? this.locumInvoiceStatus: undefined,
          hubzz_invoice_status: this.hubzzInvoiceStatus ? this.hubzzInvoiceStatus: undefined,
          date_start: this.dateStart ? this.dateStart : undefined,
          date_end: this.dateEnd ? this.dateEnd : undefined,
        }
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/locum-invoice-job-parts/count', {
            params
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/locum-invoice-job-parts', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_invoice_job_parts
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            locumInvoiceJobParts,
          ] = results

          this.count = count
          this.locumInvoiceJobParts = locumInvoiceJobParts
        }).catch((err) => {
          console.log('err.response ? err.response.data : err', err.response ? err.response.data : err)
          this.$nuxt.error(err.response ? err.response.data : err)
        }).finally(() => {
          this.loading = false
        })
      },

      downloadCsv () {
        this.downloading = true
        const params = {
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
          locum_invoice_status: this.locumInvoiceStatus ? this.locumInvoiceStatus: undefined,
          hubzz_invoice_status: this.hubzzInvoiceStatus ? this.hubzzInvoiceStatus: undefined,
          date_start: this.dateStart ? this.dateStart : undefined,
          date_end: this.dateEnd ? this.dateEnd : undefined,
          order_by: this.orderBy ? this.orderBy : undefined,
          limit: 999,
          offset: 0,
        }

        this.$axios.post('/api/v1/admin/reports/locum-invoice-job-parts/generate-key', {
          filename: `hoursApproved.csv`,
        }, {
          params: {
            ...params,
          },
        }).then((responses) => {
          console.log('responses', responses)
          const token = responses.data.data.token

          window.open(`${process.env.API_URL}/api/v1/admin/reports/locum-invoice-job-parts/csv?token=${token}`)
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
