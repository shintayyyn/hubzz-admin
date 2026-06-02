<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl">
        Locums Declined
      </div>

      <div class="text-sm md:text-lg">
        Rep-023
      </div>

      <div class="flex flex-wrap justify-start items-center w-full border p-3 rounded-lg my-2">
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput v-model="locumNameIncludes" placeholder="Search Locum Name" type="text" label="Locum Name" />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput v-model="practiceNameIncludes" placeholder="Search by Practice Name" type="text" label="Practice Name" />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput v-model="areaPostCode" placeholder="Search Area Post Code" type="text" label="Area Postcode" />
        </div>

        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <AppButton label="Reset" :in-style="'padding:5px 14px;margin-bottom:5px'" @click="filterReset" />

          <AppButton class="mx-2" label="Submit" :in-style="'padding:5px 14px;margin-bottom:5px'" @click="filterSearch" />
        </div>
      </div>

      <div v-if="false">
        <div>
          <label>Limit:</label>
          <select v-model="limit">
            <option v-for="limitOption in limits" :key="`limit_${limitOption}`" :value="limitOption">
              {{ limitOption }}
            </option>
          </select>
        </div>

        <div>
          <label>Page:</label>
          <select v-model="activePage">
            <option v-for="page in pages" :key="`page_${page}`" :value="page">
              {{ page }}
            </option>
          </select>
        </div>
      </div>

      <ReportTable
        :limit="limit"
        :items="declinedJobs"
        :getItemKey="(item, index) => offset + index + 1"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="orderBy = $event"
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

      <div v-if="authAdminPermissions.includes('Generate Reports')" class="flex flex-wrap justify-start items-center w-full p-3 my-2">
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading || declinedJobs.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="declinedJobs.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
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

export default {
  components: {
    ReportTable,
    ReportPagination,
    AppInput,
    AppButton
  },

  data() {
    return {
      loading: false,
      count: 0,
      downloading: false,
      declinedJobs: [],
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

      locumNameIncludes: '',
      practiceNameIncludes: '',
      areaPostCode: '',
      downloadToken: null
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters.permissions
    },

    filterParams() {
      const { locumNameIncludes, practiceNameIncludes, areaPostCode } = this

      return {
        locum_name_includes: locumNameIncludes || '',
        practice_name_includes: practiceNameIncludes || '',
        area_includes: areaPostCode || ''
      }
    },

    itemCountInfo() {
      const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)

      const lastItem = Math.min(this.limit * this.activePage - this.limit + (this.loading ? this.limit : this.declinedJobs.length), this.count)

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
          justify: 'end',
          flexGrow: 0,
          flexShrink: 0
        },
        {
          title: 'Locum',
          key: 'locum_user_name',
          sort_key: 'locum_user_name',
          column: item => item.locum_user_name,
          justify: 'start',
          flexGrow: 1,
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
          title: 'Area',
          key: 'area',
          sort_key: 'area',
          column: item => item.area,
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
          title: 'Date',
          key: 'date',
          sort_key: 'date',
          column: item => (item.date ? this.$moment(item.date, 'YYYY-MM-DD').format('DD/MM/YYYY') : null),
          justify: 'center',
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
          title: 'Reason',
          key: 'reason',
          sort_key: 'reason',
          column: item => item.reason,
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
      this.getDeclinedJobs()
    },

    limit() {
      this.activePage = 1
      this.getDeclinedJobs()
    },

    activePage() {
      this.getDeclinedJobs()
    }
  },

  mounted() {
    const {
      locum_name_includes: locumNameIncludes,
      practice_name_includes: practiceNameIncludes,
      area_includes: areaPostCode,
      order_by: orderBy = [],
      page
    } = this.$route.query

    Object.assign(this, {
      locumNameIncludes: locumNameIncludes || '',
      practiceNameIncludes: practiceNameIncludes || '',
      areaPostCode: areaPostCode || '',
      orderBy,
      activePage: page ? Number.parseInt(page) : 1
    })

    this.getDeclinedJobs()
  },

  methods: {
    resetFilters() {
      Object.assign(this, {
        locumNameIncludes: '',
        practiceNameIncludes: '',
        areaPostCode: ''
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
        ...this.$route.query,
        locum_name_includes: this.locumNameIncludes || undefined,
        practice_name_includes: this.practiceNameIncludes || undefined,
        area_includes: this.areaPostCode || undefined,
        order_by: this.orderBy || undefined,
        page: undefined
      }

      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
        this.$router.replace({ query })
      }

      this.getDeclinedJobs()
    },

    setPage(page) {
      this.activePage = page

      this.$router.replace({
        query: {
          ...this.$route.query,
          page: this.activePage === 1 ? undefined : this.activePage
        }
      })

      this.getDeclinedJobs()
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

      this.getDeclinedJobs()
    },

    getDeclinedJobs() {
      this.loading = true
      this.declinedJobs = []

      const params = this.filterParams

      Promise.all([
        this.$axios
          .get('/api/v1/admin/reports/declined-jobs/count', {
            params
          })
          .then(response => response.data.data.count),

        this.$axios
          .get('/api/v1/admin/reports/declined-jobs', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset
            }
          })
          .then(response => response.data.data.declined_jobs),

        this.$axios
          .post(
            '/api/v1/admin/reports/declined-jobs/generate-key',
            {
              filename: 'declinedJobs.csv'
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
        .then(([count, declinedJobs, downloadToken]) => {
          this.count = count
          this.declinedJobs = declinedJobs
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
      window.open(`${process.env.API_URL}/api/v1/admin/reports/declined-jobs/csv?token=${this.downloadToken}`)
    }
  }
}
</script>
