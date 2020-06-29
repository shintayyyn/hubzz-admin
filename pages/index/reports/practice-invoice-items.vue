
<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/reports" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl text-white">
        Invoices
      </div>
  
      <div class="text-sm md:text-lg text-white">
        Rep-031
      </div>

      <div
        class="flex-col justify-start items-start w-full shadow-lg p-3 rounded-lg flex bg-waterloo text-white my-2"
      >
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="practiceNameIncludes"
            placeholder="Search Practice Name"
            type="text"
            label="Practice Name"
          />
        </div>

        <div class="flex flex-row w-full">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="dateStart"
              label="Invoice Date Start"
              format="YYYY-MM-DD"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="dateEnd"
              label="Invoice Date End"
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
        :items="locumInvoiceJobParts"
        :getItemKey="(item) => item.practice_invoice_item_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="(value) => orderBy = value"
      />

      <ReportPagination
        :count="count" 
        :pages="pages" 
        :page="activePage"
        @page="setPage" 
      />

      <div
        class="flex-wrap justify-start items-center w-full p-3 flex my-2"
      >
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading"
            class="bg-sunglow hover:bg-sunglow-dark px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            @click="downloadCsv"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      <div v-if="false" class="text-white"> 
        <span>Count: {{ count }}</span>
        <br>
        <span>Order By: {{ orderBy.join(',') }}</span>
        <br>
        <span>Page {{ activePage }} of {{ pages }} pages</span>
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
      }
    },

    computed: {
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
            title: 'Practice',
            key: 'practice_name',
            sort_key: 'practice_name',
            column: (item) => item.practice_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'SAGE Reference',
            key: 'sage_ref',
            sort_key: 'sage_ref',
            column: (item) => item.sage_ref,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Invoice Date',
            key: 'issued_at',
            sort_key: 'issued_at',
            column: (item) => item.issued_at ? this.$moment(item.issued_at, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
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
            title: 'Invoice Number',
            key: 'invoice_number',
            sort_key: 'invoice_number',
            column: (item) => item.invoice_number,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Start',
            key: 'date_start',
            sort_key: 'date_start',
            column: (item) => item.date_start ? this.$moment(item.date_start, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date End',
            key: 'date_end',
            sort_key: 'date_end',
            column: (item) => item.date_end ? this.$moment(item.date_end, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Profession',
            key: 'profession_name',
            sort_key: 'profession_name',
            column: (item) => item.profession_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Total Hours',
            key: 'final_hours',
            sort_key: 'final_hours',
            column: (item) => item.final_hours,
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          // {
          //   title: '£ Amount',
          //   key: 'practice_name',
          //   sort_key: 'practice_name',
          //   column: (item) => item.practice_name,
          //   justify: 'start',
          //   flexGrow: 1,
          //   flexShrink: 0,
          // },
          // {
          //   title: '£ Discount',
          //   key: 'practice_name',
          //   sort_key: 'practice_name',
          //   column: (item) => item.practice_name,
          //   justify: 'start',
          //   flexGrow: 1,
          //   flexShrink: 0,
          // },
          {
            title: 'Total £',
            key: 'total_amount',
            sort_key: 'total_amount',
            column: (item) => '£' + item.total_amount,
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
      orderBy () {
        this.getPracticeInvoiceItems()
      },

      limit () {
        this.page = 1
        this.getPracticeInvoiceItems()
      },

      activePage () {
        this.getPracticeInvoiceItems()
      },
    },

    mounted () {      
     const {
        practice_name_includes: practiceNameIncludes,
        date_start: dateStart,
        date_end: dateEnd,
        order_by: orderBy = [],
        page,
      } = this.$route.query

      this.practiceNameIncludes = practiceNameIncludes ? practiceNameIncludes : ''
      this.dateStart = dateStart ? dateStart : ''
      this.dateEnd = dateEnd ? dateEnd : ''

      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getPracticeInvoiceItems()
    },

    methods: {
      filterReset () {
        this.practiceNameIncludes = ''
        this.dateStart = ''
        this.dateEnd = ''

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
          date_start: this.dateStart ? this.dateStart : undefined,
          date_end: this.dateEnd ? this.dateEnd : undefined,
          order_by: this.orderBy ? this.orderBy : undefined,
          page: undefined,
        }

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.$router.replace({ query })
        }
        
        this.getPracticeInvoiceItems()
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

        this.getPracticeInvoiceItems()
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

        this.getPracticeInvoiceItems()
      },

      getPracticeInvoiceItems () {
        this.loading = true
        this.locumInvoiceJobParts = []

        const params = {
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
          date_start: this.dateStart ? this.dateStart : undefined,
          date_end: this.dateEnd ? this.dateEnd : undefined,
        }
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/practice-invoice-items/count', {
            params
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/practice-invoice-items', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.practice_invoice_items
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
          date_start: this.dateStart ? this.dateStart : undefined,
          date_end: this.dateEnd ? this.dateEnd : undefined,
          order_by: this.orderBy,
          limit: 999,
          offset: 0,
        }

        this.$axios.post('/api/v1/admin/reports/practice-invoice-items/generate-key', {
          filename: `practiceInvoices.csv`,
        }, {
          params: {
            ...params,
          },
        }).then((responses) => {
          console.log('responses', responses)
          const token = responses.data.data.token

          window.open(`${process.env.API_URL}/api/v1/admin/reports/practice-invoice-items/csv?token=${token}`)
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
