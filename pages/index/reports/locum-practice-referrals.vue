<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl ">
        Locum Practice Referrals
      </div>

      <div class="text-sm md:text-lg ">
        Rep-021
      </div>

      <div class="flex-wrap justify-start items-center w-full border p-3 rounded-lg flex my-2">
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
            <option v-for="(item, index) in limits" :key="`limit_${index}`" :value="item">
              {{ item }}
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
        :items="locumPracticeReferrals"
        :getItemKey="item => item.id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="value => (orderBy = value)"
      />

      <div class="w-full flex flex-wrap justify-between items-center">
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
            :disabled="downloading || !locumPracticeReferrals.length"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="!locumPracticeReferrals.length ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
            @click="downloadCsv"
          >
            <svgicon name="cloud-download" width="21" height="21" class="fill-current mr-2" />
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
      downloading: false,
      count: 0,
      locumPracticeReferrals: [],
      orderBy: [],
      orderByProcessed: '',
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
      const normalize = v => v || ''

      return {
        locum_name_includes: normalize(this.locumNameIncludes),
        practice_name_includes: normalize(this.practiceNameIncludes),
        area_includes: normalize(this.areaPostCode)
      }
    },

    offset() {
      return this.activePage * this.limit - this.limit
    },

    itemCountInfo() {
      const start = Math.min(this.offset + 1, this.count)
      const end = Math.min(this.offset + (this.loading ? this.limit : this.locumPracticeReferrals.length), this.count)

      return `Showing ${start} to ${end} of ${this.count} items`
    },

    columnDetails() {
      return [
        {
          title: '#',
          key: 'index',
          sort_key: null,
          column: (_, i) => this.offset + i + 1,
          justify: 'end',
          flexGrow: 0,
          flexShrink: 0
        },
        {
          title: 'Locum Name',
          key: 'locum_name',
          sort_key: 'locum_name',
          column: i => i.locum_name,
          justify: 'start',
          flexGrow: 1
        },
        {
          title: 'Practice Name',
          key: 'practice_name',
          sort_key: 'practice_name',
          column: i => i.practice_name,
          justify: 'start',
          flexGrow: 1
        },
        {
          title: 'Area',
          key: 'area',
          sort_key: 'area',
          column: i => i.area,
          justify: 'start',
          flexGrow: 1
        },
        {
          title: 'Date Registered',
          key: 'date_practice_registered',
          sort_key: 'date_practice_registered',
          column: i => this.$moment(i.date_practice_registered, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          justify: 'center',
          flexGrow: 1
        }
      ]
    },

    pages() {
      return Math.max(Math.ceil(this.count / this.limit), 1)
    }
  },

  watch: {
    orderBy() {
      this.orderByProcessed = this.formatOrderBy(this.orderBy)
      this.getLocumPracticeReferrals()
    },

    limit() {
      this.activePage = 1
      this.getLocumPracticeReferrals()
    },

    activePage() {
      this.getLocumPracticeReferrals()
    }
  },

  mounted() {
    const { locum_name_includes, practice_name_includes, area, order_by = [], page } = this.$route.query

    this.locumNameIncludes = locum_name_includes || ''
    this.practiceNameIncludes = practice_name_includes || ''
    this.areaPostCode = area || ''

    this.orderBy = order_by
    this.activePage = page ? Number.parseInt(page) : 1

    this.getLocumPracticeReferrals()
  },

  methods: {
    formatOrderBy(value = []) {
      if (!value.length) return ''

      return value[0]
        .replace(/_/g, ' ')
        .replace(/:/g, ' - ')
        .replace(/(^\w{1})|(\s{1}\w{1})/g, w => w.toUpperCase())
        .replace('Desc', 'Descending')
        .replace('Asc', 'Ascending')
    },

    buildQuery(extra = {}) {
      return {
        ...this.$route.query,
        ...this.filterParams,
        order_by: this.orderBy || undefined,
        ...extra
      }
    },

    filterReset() {
      this.locumNameIncludes = ''
      this.practiceNameIncludes = ''
      this.areaPostCode = ''
      this.filterSearch()
    },

    filterSearch() {
      this.activePage = 1

      const query = this.buildQuery({ page: undefined })

      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
        this.$router.replace({ query })
      }

      this.getLocumPracticeReferrals()
    },

    setPage(page) {
      this.activePage = page

      this.$router.replace({
        query: {
          ...this.$route.query,
          page: this.activePage === 1 ? undefined : this.activePage
        }
      })

      this.getLocumPracticeReferrals()
    },

    getLocumPracticeReferrals() {
      this.loading = true
      this.locumPracticeReferrals = []

      const params = this.filterParams

      Promise.all([
        this.$axios.get('/api/v1/admin/reports/locum-practice-referrals/count', { params }).then(r => r.data.data.count),

        this.$axios
          .get('/api/v1/admin/reports/locum-practice-referrals', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset
            }
          })
          .then(r => r.data.data.locum_practice_referrals),

        this.$axios
          .post(
            '/api/v1/admin/reports/locum-practice-referrals/generate-key',
            { filename: 'locumPracticeReferrals.csv' },
            { params: { ...params, order_by: this.orderBy } }
          )
          .then(r => r.data.data.token)
      ])
        .then(([count, list, token]) => {
          this.count = count
          this.locumPracticeReferrals = list
          this.downloadToken = token
        })
        .catch(err => {
          this.$nuxt.error(err.response ? err.response.data : err)
        })
        .finally(() => {
          this.loading = false
        })
    },

    downloadCsv() {
      window.open(`${process.env.API_URL}/api/v1/admin/reports/locum-practice-referrals/csv?token=${this.downloadToken}`)
    }
  }
}
</script>
