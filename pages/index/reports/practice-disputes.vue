<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div
        class="flex-wrap justify-start items-start w-full border p-3 rounded-lg flex my-2"
      >
        <div class="flex flex-row w-full ">
          <div class=" w-full lg:w-1/3 md:w-1/3">
            <div>
              <label for="start" class="">Filter until Month/Year of Invoice Approval:</label>
            </div>
            <div>
              <!-- <input 
                id="start" 
                v-model="monthYear" 
                class="text-black" 
                type="month" 
                name="start" 
                :max="this.$moment().subtract(1, 'month').format('YYYY-MM')"
              > -->
              <AppMonthYear
                v-model="monthYear"
                :isBefore="true"
              />
            </div>
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
      
      <div class="text-lg md:text-2xl ">
        Practice Disputes
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-032
      </div>

      <div v-if="false">
        <div>
          <label class="">Limit: </label>
          <select v-model="limit">
            <option v-for="limit in limits" :key="`limit_${limit}`" :value="limit">
              {{ limit }}
            </option>
          </select>
        </div>
        <div>
          <label class="">Page: </label>
          <select v-model="activePage">
            <option v-for="page in pages" :key="`page_${page}`" :value="page">
              {{ page }}
            </option>
          </select>
        </div>
      </div>

      <ReportTable
        :limit="limit"
        :items="practiceDisputes"
        :getItemKey="(item) => item.practice_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="setOrderBy"
      />

      <div class="w-full flex flex-wrap justfify-between items-center">
        <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
          <div class="text-gray-500 w-full md:w-auto text-center md:text-left">
            <div class="whitespace-no-wrap">
              {{ itemCountInfo }}
            </div>
            <div class="whitespace-no-wrap">
              Page: {{ activePage }} / {{ pages }}
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
            :disabled="downloading"
            class="bg-sunglow hover:bg-sunglow-dark px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            @click="downloadCsv"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      <div v-if="true" class=""> 
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
  import AppButton from '@/components/Base/AppButton'
  import AppMonthYear from '@/components/Base/AppMonthYear'
  export default {
    components: {
      ReportTable,
      ReportPagination,
      AppButton,
      AppMonthYear,
    },

    data () {
      return {
        loading: false,
        count: 0,
        practiceDisputes: [],
        downloading: false,
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

        monthYear:'',
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },
      itemCountInfo () {
        const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
        const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.practiceDisputes.length), this.count)
        
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
            title: 'Practice',
            key: 'practice_name',
            sort_key: 'practice_name',
            column: (item) => item.practice_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Practice Age (In Months)',
            key: 'practice_months_old',
            sort_key: 'practice_months_old',
            column: (item) => item.practice_months_old ? parseFloat(item.practice_months_old).toFixed(2) : 'N/A',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Disputed Job Parts Count',
            key: 'practice_id',
            sort_key: null,
            column: (item) => item.disputed_job_parts_total,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Average Disputes for this Month',
            key: 'practice_id',
            sort_key: null,
            column: (item) => item.monthly_average_disputes > 0 ? item.monthly_average_disputes.toFixed(2) : 'N/A',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Average Days Spent Settling Disputes per Invoice',
            key: 'practice_id',
            sort_key: null,
            column: (item) => item.ave_days_spent_resolve_disputes !== null  ? `${item.ave_days_spent_resolve_disputes > 1 ? item.ave_days_spent_resolve_disputes.toFixed(2) : 'Less Than 1'} Day(s)` : 'N/A',
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
        this.getPracticeDisputes()
      },

      limit () {
        this.page = 1
        this.getPracticeDisputes()
      },

      activePage () {
        this.getPracticeDisputes()
      },
    },

    mounted () {      
      this.monthYear = this.$moment().subtract(1, 'month')
      this.getPracticeDisputes()
    },

    methods: {
      filterReset () {
        this.monthYear = this.$moment().subtract(1, 'month')
        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          month: this.$moment(this.monthYear).format('MMMM'),
          year: this.$moment(this.monthYear).format('YYYY'),
          last_date_of_month:this.$moment(this.monthYear).endOf('month'),
          order_by: this.orderBy ? this.orderBy : undefined,
          page: undefined,
        }

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.$router.replace({ query })
        }
        
        this.getPracticeDisputes()
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

        this.getPracticeDisputes()
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

        this.getPracticeDisputes()
      },

      getPracticeDisputes () {
        this.loading = true
        this.practiceDisputes = []

        const params = {
          month: this.$moment(this.monthYear).format('MMMM'),
          year: this.$moment(this.monthYear).format('YYYY'),
          last_date_of_month:this.$moment(this.monthYear).endOf('month').format('YYYY-MM-DD'),
        }
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/practice-disputes/count',{
            params
          }).then((responses) => {
            console.log('response', responses.data.data.count)
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/practice-disputes', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            console.log('response', responses.data.data.practice_disputes)
            return responses.data.data.practice_disputes
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            practiceDisputes,
          ] = results

          this.count = count
          this.practiceDisputes = practiceDisputes
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
          month: this.$moment(this.monthYear).format('MMMM'),
          year: this.$moment(this.monthYear).format('YYYY'),
          last_date_of_month:this.$moment(this.monthYear).endOf('month').format('YYYY-MM-DD'),
        }

        this.$axios.post('/api/v1/admin/reports/practice-disputes/generate-key', {
          filename: `practiceDisputes.csv`,
        }, {
          params: {
            ...params,
          },
        }).then((responses) => {
          const token = responses.data.data.token

          window.open(`${process.env.API_URL}/api/v1/admin/reports/practice-disputes/csv?token=${token}`)
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
