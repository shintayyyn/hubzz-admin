<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl">
        Jobs not Filled
      </div>
      <div class="text-sm md:text-lg">
        Rep-025
      </div>

      <div class="flex-col justify-start items-start w-full border p-3 rounded-lg flex my-2">
        <div class="flex flex-row w-full items-center">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput v-model="practiceNameIncludes" placeholder="Search by Practice Name" type="text" label="Practice Name" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput v-model="areaPostCode" placeholder="Search Area Postcode" type="text" label="Area Postcode" />
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

        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <AppButton label="Reset" :in-style="'padding:5px 14px;margin-bottom:5px'" @click="filterReset" />
          <AppButton class="mx-2" label="Submit" :in-style="'padding:5px 14px;margin-bottom:5px'" @click="filterSearch" />
        </div>
      </div>

      <ReportTable
        :limit="limit"
        :items="unfilledJobs"
        :getItemKey="item => item.job_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="value => (orderBy = value)"
      />

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
        <ReportPagination :count="count" :pages="pages" :page="activePage" @page="setPage" />
      </div>

      <div v-if="authAdminPermissions.includes('Generate Reports')" class="flex-wrap justify-start items-center w-full p-3 flex my-2">
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || unfilledJobs.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="unfilledJobs.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
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

const API_BASE = '/api/v1/admin/reports/unfilled-jobs'

export default {
  components: { ReportTable, ReportPagination, AppInput, AppButton, AppDate },

  data() {
    return {
      loading: false,
      count: 0,
      downloading: false,
      unfilledJobs: [],
      orderBy: [],
      orderByProcessed: '',
      limit: 10,
      activePage: 1,
      practiceNameIncludes: '',
      dateStart: '',
      dateEnd: '',
      areaPostCode: '',
      downloadToken: null
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },

    filterParams() {
      return {
        practice_name_includes: this.practiceNameIncludes || '',
        date_start: this.dateStart || '',
        date_end: this.dateEnd || '',
        area_includes: this.areaPostCode || ''
      }
    },

    offset() {
      return this.activePage * this.limit - this.limit
    },

    pages() {
      return Math.max(Math.ceil(this.count / this.limit), 1)
    },

    itemCountInfo() {
      const firstItem = Math.min(this.offset + 1, this.count)
      const lastItem = Math.min(this.offset + (this.loading ? this.limit : this.unfilledJobs.length), this.count)
      return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
    },

    columnDetails() {
      return [
        {
          title: '#',
          key: 'index',
          sort_key: null,
          column: (_, index) => this.offset + index + 1,
          justify: 'end',
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
          title: 'Job Number',
          key: 'job_number',
          sort_key: 'job_number',
          column: item => item.job_number,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Profession',
          key: 'profession',
          sort_key: 'profession',
          column: item => item.profession,
          justify: 'start',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Date Start',
          key: 'date_start',
          sort_key: 'date_start',
          column: item => (item.date_start ? this.$moment(item.date_start, 'YYYY-MM-DD').format('DD/MM/YYYY') : null),
          justify: 'center',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Date End',
          key: 'date_end',
          sort_key: 'date_end',
          column: item => (item.date_end ? this.$moment(item.date_end, 'YYYY-MM-DD').format('DD/MM/YYYY') : null),
          justify: 'center',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Total Hours',
          key: 'total_hours',
          sort_key: 'total_hours',
          column: item => parseFloat(item.total_hours / 60).toFixed(2) + ' Hours',
          justify: 'end',
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
        }
      ]
    }
  },

  watch: {
    orderBy(value) {
      let replaced = ''
      if (value.length > 0) {
        replaced = value[0]
          .replace(/_/g, ' ')
          .replace(/:/g, ' - ')
          .replace(/(^\w{1})|(\s{1}\w{1})/g, word => word.toUpperCase())
          .replace('Desc', 'Descending')
          .replace('Asc', 'Ascending')
      }
      this.orderByProcessed = replaced
      this.getUnfilledJobs()
    },

    limit() {
      this.page = 1
      this.getUnfilledJobs()
    },

    activePage() {
      this.getUnfilledJobs()
    }
  },

  mounted() {
    const {
      practice_name_includes: practiceNameIncludes,
      date_start: dateStart,
      date_end: dateEnd,
      area_includes: areaPostCode,
      order_by: orderBy = ['job_id:desc'],
      page
    } = this.$route.query

    this.practiceNameIncludes = practiceNameIncludes || ''
    this.areaPostCode = areaPostCode || ''
    this.dateStart = dateStart || ''
    this.dateEnd = dateEnd || ''
    this.orderBy = orderBy
    this.activePage = page ? Number.parseInt(page) : 1

    this.getUnfilledJobs()
  },

  methods: {
    filterReset() {
      this.practiceNameIncludes = ''
      this.areaPostCode = ''
      this.dateStart = ''
      this.dateEnd = ''
      this.filterSearch()
    },

    filterSearch() {
      this.activePage = 1

      const query = {
        ...this.$route.query,
        practiceNameIncludes: this.practiceNameIncludes || '',
        areaPostCode: this.areaPostCode || '',
        dateStart: this.dateStart || '',
        dateEnd: this.dateEnd || '',
        order_by: this.orderBy || undefined,
        page: undefined
      }

      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
        this.$router.replace({ query })
      }

      this.getUnfilledJobs()
    },

    setPage(page) {
      this.activePage = page

      this.$router.replace({
        query: {
          ...this.$route.query,
          page: this.activePage === 1 ? undefined : this.activePage
        }
      })

      this.getUnfilledJobs()
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

      this.getUnfilledJobs()
    },

    getUnfilledJobs() {
      this.loading = true
      this.unfilledJobs = []

      const params = this.filterParams

      Promise.all([
        this.$axios.get(`${API_BASE}/count`, { params }).then(res => res.data.data.count),

        this.$axios
          .get(API_BASE, {
            params: { ...params, order_by: this.orderBy, limit: this.limit, offset: this.offset }
          })
          .then(res => res.data.data.unfilled_jobs),

        this.$axios
          .post(`${API_BASE}/generate-key`, { filename: 'unfilledJobs.csv' }, { params: { ...params, order_by: this.orderBy } })
          .then(res => res.data.data.token)
      ])
        .then(([count, unfilledJobs, downloadToken]) => {
          this.count = count
          this.unfilledJobs = unfilledJobs
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
      window.open(`${process.env.API_URL}${API_BASE}/csv?token=${this.downloadToken}`)
    }
  }
}
</script>
