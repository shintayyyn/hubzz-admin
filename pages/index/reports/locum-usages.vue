<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl ">
        Locum Usages
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-029
      </div>

      <div
        class="flex-wrap justify-start items-center w-full border p-3 rounded-lg flex my-2"
      >
        <div class="flex flex-row w-full items-center">
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
        </div>

        <div class="flex flex-row w-full items-center">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="dateStart"
              label="Date Start"
              format="YYYY-MM-DD"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="dateEnd"
              label="Date End"
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
          <label class="">Limit: </label>
          <select v-model="limit">
            <option v-for="limitOption in limits" :key="`limit_${limitOption}`" :value="limitOption">
              {{ limitOption }}
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
        :items="locumUsages"
        :getItemKey="item => `${item.locum_user_id}-${item.practice_id}`"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="(value) => orderBy = value"
      />

      <div class="w-full flex flex-wrap justfify-between items-center">
        <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
          <div class=" w-full md:w-auto text-center md:text-left">
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
            :disabled="downloading || locumUsages.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="locumUsages.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
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
        locumUsages: [],
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
        locumNameIncludes: '',
        areaPostCode: '',
        dateStart: '',
        dateEnd: '',
        downloadToken: null,
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },
      itemCountInfo () {
        const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
        const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.locumUsages.length), this.count)
        
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
            title: 'Locum',
            key: 'locum_user_name',
            sort_key: 'locum_user_name',
            column: item => item.locum_user_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Practice',
            key: 'practice_name',
            sort_key: 'practice_name',
            column: item => item.practice_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Total Hours Assigned/Completed or Approved',
            key: 'completed_terminated_job_part_total_hours',
            sort_key: 'completed_terminated_job_part_total_hours',
            column: item => (parseFloat(item.job_part_total_final_paid_hours_in_minutes) / 60).toFixed(2),
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Hour',
            key: 'min_rate_per_hour',
            sort_key: 'min_rate_per_hour',
            column: item => `£ ${item.min_rate_per_hour}`,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Half Day Session',
            key: 'min_rate_per_half_day_session',
            sort_key: 'min_rate_per_half_day_session',
            column: item => `£ ${item.min_rate_per_half_day_session}`,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Min Rate per Whole Day Session',
            key: 'min_rate_per_whole_day_session',
            sort_key: 'min_rate_per_whole_day_session',
            column: item => `£ ${item.min_rate_per_whole_day_session}`,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Locum is Marked as Favourite by Practice',
            key: 'locum_is_favorite_of_practice',
            sort_key: 'locum_is_favorite_of_practice',
            column: item => item.locum_is_favorite_of_practice ? 'Yes' : 'No',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Practice is Marked as Favourite of Locum',
            key: 'practice_is_favorite_of_locum',
            sort_key: 'practice_is_favorite_of_locum',
            column: item => item.practice_is_favorite_of_locum ? 'Yes' : 'No',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Area',
            key: 'postcode',
            sort_key: 'postcode',
            column: item => item.postcode,
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
        practice_name_includes: practiceNameIncludes,
        locum_name_includes: locumNameIncludes,
        area_includes: areaPostCode,
        order_by: orderBy = [],
        date_start: dateStart,
        date_end: dateEnd,
        page,
      } = this.$route.query

      this.practiceNameIncludes = practiceNameIncludes ? practiceNameIncludes : ''
      this.locumNameIncludes = locumNameIncludes ? locumNameIncludes : ''
      this.areaPostCode = areaPostCode ? areaPostCode : ''
      this.dateStart = dateStart ? dateStart : ''
      this.dateEnd = dateEnd ? dateEnd : ''
      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getPracticeLocums()
    },

    methods: {
      filterReset () {
        this.practiceNameIncludes = ''
        this.locumNameIncludes = ''
        this.areaPostCode = ''
        this.dateStart = ''
        this.dateEnd = ''

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : undefined,
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
          area_includes: this.areaPostCode ? this.areaPostCode : undefined,
          date_start: this.dateStart ? this.dateStart : undefined,
          date_end: this.dateEnd ? this.dateEnd : undefined,
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
          practice_name_includes: this.practiceNameIncludes ? this.practiceNameIncludes : '',
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : '',
          date_start: this.dateStart ? this.dateStart : '',
          date_end: this.dateEnd ? this.dateEnd : '',
          area_includes: this.areaPostCode ? this.areaPostCode : '',
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

          this.$axios.post('/api/v1/admin/reports/locum-usages/generate-key', {
            filename: `locumUsages.csv`,
          }, {
            params: {
              ...params,
            order_by: this.orderBy,
            },
          }).then((responses) => {
            const token = responses.data.data.token

            return token
          })
        ]).then((results) => {
          const [
            count,
            locumUsages,
            downloadToken,
          ] = results

          this.count = count
          this.locumUsages = locumUsages
          this.downloadToken = downloadToken
        }).catch((err) => {
          console.log('err.response ? err.response.data : err', err.response ? err.response.data : err)
          this.$nuxt.error(err.response ? err.response.data : err)
        }).finally(() => {
          this.loading = false
        })
      },

      downloadCsv () {
        window.open(`${process.env.API_URL}/api/v1/admin/reports/locum-usages/csv?token=${this.downloadToken}`)
      },
    },
  }
</script>
