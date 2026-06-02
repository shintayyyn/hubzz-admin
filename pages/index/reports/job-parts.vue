<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl ">
        Session Notifications
      </div>

      <div class="text-sm md:text-lg ">
        Rep-028
      </div>

      <div class="flex-col justify-start items-start w-full border p-3 rounded-lg flex  my-2">
        <div class="flex flex-row w-full items-center">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput v-model="practiceNameIncludes" placeholder="Search by Practice Name" type="text" label="Practice Name" />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput v-model="areaPostCode" placeholder="Search Area Postcode" type="text" label="Area Postcode" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput v-model="status" type="select" name="status" placeholder="Filter by Status" :label="'Status'" :items="statusOptions" />
          </div>
        </div>

        <div class="flex flex-row w-full items-center">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate v-model="dateStart" label="Date Start" format="YYYY-MM-DD" />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate v-model="dateEnd" label="Date End" format="YYYY-MM-DD" />
          </div>
        </div>
        <div class="flex flex-row w-full items-center">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput v-model="minRate" placeholder="0.00" type="number" label="Min Rate" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput v-model="maxRate" placeholder="0.00" type="number" label="Max Rate" />
          </div>
        </div>

        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <AppButton label="Reset" :in-style="'padding:5px 14px;margin-bottom:5px'" @click="filterReset" />

          <AppButton class="mx-2" label="Submit" :in-style="'padding:5px 14px;margin-bottom:5px'" @click="filterSearch" />
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
        :items="jobParts"
        :getItemKey="item => item.job_part_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="value => (orderBy = value)"
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
        <ReportPagination :count="count" :pages="pages" :page="activePage" @page="setPage" />
      </div>

      <div v-if="authAdminPermissions.includes('Generate Reports')" class="flex-wrap justify-start items-center w-full p-3 flex my-2">
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || jobParts.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="jobParts.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
            @click="downloadCsv"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
            <span>{{ downloading ? 'Downloading...' : 'Download CSV' }}</span>
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
    AppDate
  },

  data() {
    return {
      loading: false,
      downloading: false,
      count: 0,
      jobParts: [],
      orderBy: [],
      orderByProcessed: '',

      orderBys: [
        {
          title: 'Practice Name (Ascending)',
          column: 'practice_name',
          direction: 'asc'
        },
        {
          title: 'Practice Name (Descending)',
          column: 'practice_name',
          direction: 'desc'
        }
      ],

      limit: 10,

      limits: [1, 2, 3, 4, 5, 10, 15, 20, 25],

      activePage: 1,

      practiceNameIncludes: '',
      dateStart: '',
      dateEnd: '',
      areaPostCode: '',
      status: '',
      minRate: '',
      maxRate: '',

      downloadToken: null,
      statusOptions: [
        { label: 'Live', value: 'Live' },
        { label: 'Updated', value: 'Updated' },
        { label: 'Applied', value: 'Applied' },
        { label: 'Allocated', value: 'Allocated' },
        { label: 'Ongoing', value: 'Ongoing' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Withdrawn', value: 'Withdrawn' },
        { label: 'Cancelled', value: 'Cancelled' },
        { label: 'Rejected', value: 'Rejected' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Unfilled', value: 'Unfilled' }
      ]
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters.permissions
    },

    filterParams() {
      const { practiceNameIncludes, dateStart, dateEnd, areaPostCode, status, minRate, maxRate } = this

      return {
        practice_name_includes: practiceNameIncludes || '',
        date_start: dateStart || '',
        date_end: dateEnd || '',
        area_includes: areaPostCode || '',
        status: status || '',
        min_rate: minRate || '',
        max_rate: maxRate || ''
      }
    },

    itemCountInfo() {
      const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)

      const lastItem = Math.min(this.limit * this.activePage - this.limit + (this.loading ? this.limit : this.jobParts.length), this.count)

      return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
    },

    offset() {
      return this.activePage * this.limit - this.limit
    },

    columnDetails() {
      return [
        {
          title: '#',
          key: 'index',
          sort_key: null,
          column: (_, index) => this.offset + index + 1,
          justify: 'start',
          flexGrow: 0,
          flexShrink: 0
        },
        {
          title: 'Practice',
          key: 'practice_name',
          sort_key: 'practice_name',
          column: item => item.practice_name,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Job Part Number',
          key: 'job_part_number',
          sort_key: 'job_part_number',
          column: item => item.job_part_number,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Area',
          key: 'area',
          sort_key: 'area',
          column: item => item.area,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Date Start',
          key: 'date_start',
          sort_key: 'date_start',
          column: item => (item.date_start ? this.$moment(item.date_start, 'YYYY-MM-DD').format('DD/MM/YYYY') : null),
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Date End',
          key: 'date_end',
          sort_key: 'date_end',
          column: item => (item.date_end ? this.$moment(item.date_end, 'YYYY-MM-DD').format('DD/MM/YYYY') : null),
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Total Hours',
          key: 'final_hours',
          sort_key: 'final_hours',
          column: item => `${item.job_part_total_final_hours.toFixed(2)}`,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Profession',
          key: 'profession_name',
          sort_key: 'profession_name',
          column: item => item.profession_name,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Rates',
          key: 'rates',
          sort_key: 'rate',
          column: item => item.job_part_rate_ranged_formatted,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Rate Type',
          key: 'rate_type_name',
          sort_key: 'rate_type_name',
          column: item => item.job_part_rate_type_names_formatted,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Status',
          key: 'status',
          sort_key: 'status',
          column: item => item.status,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        }
      ]
    },

    pages() {
      return Math.max(Math.ceil(this.count / this.limit), 1)
    }
  },

  watch: {
    orderBy(value) {
      this.orderByProcessed = this.formatOrderBy(value)
      this.getJobParts()
    },

    limit() {
      this.activePage = 1
      this.getJobParts()
    },

    activePage() {
      this.getJobParts()
    }
  },

  mounted() {
    const {
      practice_name_includes,
      date_start,
      date_end,
      area_includes,
      order_by = ['date_start:desc'],
      status,
      min_rate,
      max_rate,
      page
    } = this.$route.query

    Object.assign(this, {
      practiceNameIncludes: practice_name_includes || '',
      areaPostCode: area_includes || '',
      dateStart: date_start || '',
      dateEnd: date_end || '',
      status: status || '',
      minRate: min_rate || '',
      maxRate: max_rate || '',
      orderBy: order_by,
      activePage: Number.parseInt(page) || 1
    })

    this.getJobParts()
  },

  methods: {
    resetFilters() {
      Object.assign(this, {
        practiceNameIncludes: '',
        areaPostCode: '',
        dateStart: '',
        dateEnd: '',
        status: '',
        minRate: '',
        maxRate: ''
      })
    },

    formatOrderBy(value = []) {
      if (!value.length) {
        return ''
      }

      return value[0]
        .replace(/_/g, ' ')
        .replace(/:/g, ' - ')
        .replace(/(^\w{1})|(\s\w{1})/g, word => word.toUpperCase())
        .replace('Desc', 'Descending')
        .replace('Asc', 'Ascending')
    },

    filterReset() {
      this.resetFilters()
      this.filterSearch()
    },

    filterSearch() {
      this.activePage = 1

      const query = {
        ...this.filterParams,
        order_by: this.orderBy || undefined,
        page: undefined
      }

      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
        this.$router.replace({ query })
      }

      this.getJobParts()
    },

    setPage(page) {
      this.activePage = page

      this.$router.replace({
        query: {
          ...this.$route.query,
          page: this.activePage === 1 ? undefined : this.activePage
        }
      })

      this.getJobParts()
    },

    setOrderBy(orderBy) {
      this.orderBy = orderBy
      this.activePage = 1

      this.$router.replace({
        query: {
          ...this.$route.query,
          order_by: this.orderBy,
          page: undefined
        }
      })

      this.getJobParts()
    },

    getJobParts() {
      this.loading = true
      this.jobParts = []

      const params = this.filterParams

      Promise.all([
        this.$axios
          .get('/api/v1/admin/reports/job-parts/count', {
            params
          })
          .then(response => response.data.data.count),

        this.$axios
          .get('/api/v1/admin/reports/job-parts', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset
            }
          })
          .then(response => response.data.data.job_parts),

        this.$axios
          .post(
            '/api/v1/admin/reports/job-parts/generate-key',
            {
              filename: 'sessionNotification.csv'
            },
            {
              params: {
                ...params,
                order_by: this.orderBy
              }
            }
          )
          .then(response => response.data.data.token)
      ])
        .then(([count, jobParts, downloadToken]) => {
          this.count = count
          this.jobParts = jobParts
          this.downloadToken = downloadToken
        })
        .catch(err => {
          console.log('err.response ? err.response.data : err', err.response ? err.response.data : err)

          this.$nuxt.error(err.response ? err.response.data : err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    downloadCsv() {
      window.open(`${process.env.API_URL}/api/v1/admin/reports/job-parts/csv?token=${this.downloadToken}`)
    }
  }
}
</script>
