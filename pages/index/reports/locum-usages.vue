<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/reports" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl text-white">
        Locum Usages
      </div>
  
      <div class="text-sm md:text-lg text-white">
        Rep-029
      </div>

      <div
        class="flex-wrap justify-start items-start w-full shadow-lg p-3 rounded-lg flex bg-waterloo text-white my-2"
      >
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
            v-model="areaPostCode"
            placeholder="Search Area Post Code"
            type="text"
            label="Area Postcode"
          />
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
        :items="locumUsages"
        :getItemKey="(item) => `${item.locum_user_id}-${item.practice_id}`"
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


      <div v-if="true" class="text-white"> 
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
  export default {
    components: {
      ReportTable,
      ReportPagination,
      AppInput,
      AppButton,
    },

    data () {
      return {
        loading: false,
        count: 0,
        downloading: false,
        locumUsages: [],
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

        locumNameIncludes: '',
        areaPostCode: '',
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
            title: 'Locum',
            key: 'locum_user_name',
            sort_key: 'locum_user_name',
            column: (item) => item.locum_user_name,
            justify: 'start',
            flexGrow: 1,
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
            title: 'Total Hours Assigned/Completed or Approved',
            key: 'completed_terminated_job_part_total_hours',
            sort_key: 'completed_terminated_job_part_total_hours',
            column: (item) => item.completed_terminated_job_part_total_hours.toFixed(2),
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Hour',
            key: 'min_rate_per_hour',
            sort_key: 'min_rate_per_hour',
            column: (item) => item.min_rate_per_hour.toFixed(2),
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Half Day Session',
            key: 'min_rate_per_half_day_session',
            sort_key: 'min_rate_per_half_day_session',
            column: (item) => item.min_rate_per_half_day_session.toFixed(2),
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Whole Day Session',
            key: 'min_rate_per_whole_day_session',
            sort_key: 'min_rate_per_whole_day_session',
            column: (item) => item.min_rate_per_whole_day_session.toFixed(2),
            justify: 'end',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Marked as Favourite',
            key: 'locum_is_favorite_of_practice',
            sort_key: 'locum_is_favorite_of_practice',
            column: (item) => item.locum_is_favorite_of_practice ? 'Yes' : 'No',
            justify: 'center',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Area',
            key: 'locum_postcode',
            sort_key: 'locum_postcode',
            column: (item) => item.locum_postcode,
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
        this.getPracticeLocums()
      },

      limit () {
        this.page = 1
        this.getPracticeLocums()
      },

      activePage () {
        this.getPracticeLocums()
      },
    },

    mounted () {      
      const {
        locum_name_includes: locumNameIncludes,
        area: areaPostCode,
        order_by: orderBy = [],
        page,
      } = this.$route.query

      this.locumNameIncludes = locumNameIncludes ? locumNameIncludes : ''
      this.areaPostCode = areaPostCode ? areaPostCode : ''

      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getPracticeLocums()
    },

    methods: {
      filterReset () {
        this.locumNameIncludes = ''
        this.areaPostCode = ''

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
          area: this.areaPostCode ? this.areaPostCode : undefined,
          order_by: this.orderBy ? this.orderBy : undefined,
          page: undefined,
        }

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.$router.replace({ query })
        }
        
        this.getPracticeLocums()
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

        this.getPracticeLocums()
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

        this.getPracticeLocums()
      },

      getPracticeLocums () {
        this.loading = true
        this.locumUsages = []

         const params = {
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : '',
          area: this.areaPostCode ? this.areaPostCode : '',
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/reports/locum-usages/count', {
            params
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/locum-usages', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_usages
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            locumUsages,
          ] = results

          this.count = count
          this.locumUsages = locumUsages
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
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : '',
          area: this.areaPostCode ? this.areaPostCode : '',
          order_by: this.orderBy,
          limit: 999,
          offset: 0,
        }

        this.$axios.post('/api/v1/admin/reports/locum-usages/generate-key', {
          filename: `locumUsages.csv`,
        }, {
          params: {
            ...params,
          },
        }).then((responses) => {
          console.log('responses', responses)
          const token = responses.data.data.token

          window.open(`${process.env.API_URL}/api/v1/admin/reports/locum-usages/csv?token=${token}`)
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
