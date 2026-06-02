<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl">
        Locums in an Area
      </div>
      <div class="text-sm md:text-lg">
        Rep-019
      </div>

      <div class="flex-wrap justify-start items-center w-full border p-3 rounded-lg flex my-2">
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput v-model="area" placeholder="Search Area" type="text" label="Area" />
        </div>
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput v-model="profession" placeholder="Search Profession" type="text" label="Profession" />
        </div>
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <AppButton label="Reset" :in-style="'padding:5px 14px;margin-bottom:5px'" @click="filterReset" />
          <AppButton class="mx-2" label="Submit" :in-style="'padding:5px 14px;margin-bottom:5px'" @click="filterSearch" />
        </div>
      </div>

      <ReportTable
        :limit="limit"
        :items="locumsInAnArea"
        :getItemKey="(item, index) => offset + index + 1"
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
            :disabled="downloading || locumsInAnArea.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="locumsInAnArea.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
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
import AppInput from '@/components/Base/AppInput'

const API_BASE = '/api/v1/admin/reports/locums-in-an-area'

export default {
  components: { ReportTable, ReportPagination, AppButton, AppInput },

  watchQuery: ['order_by'],

  data() {
    return {
      loading: false,
      count: 0,
      downloading: false,
      locumsInAnArea: [],
      orderBy: [],
      orderByProcessed: '',
      limit: 10,
      activePage: 1,
      area: '',
      profession: '',
      downloadToken: null
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },

    filterParams() {
      return {
        area_includes: this.area || undefined,
        profession: this.profession || undefined
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
      const lastItem = Math.min(this.offset + (this.loading ? this.limit : this.locumsInAnArea.length), this.count)
      return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
    },

    columnDetails() {
      return [
        {
          title: 'Area',
          key: 'area',
          sort_key: 'area',
          column: item => item.area,
          justify: 'left',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Profession',
          key: 'profession',
          sort_key: 'profession',
          column: item => item.profession,
          justify: 'left',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Number of Locums Registered',
          key: 'number_locums_registered',
          sort_key: 'number_locums_registered',
          column: item => item.number_locums_registered,
          justify: 'left',
          flexGrow: 1,
          flexShrink: 0
        },
        {
          title: 'Status',
          key: 'status',
          sort_key: 'status',
          column: item => item.status,
          justify: 'left',
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
      this.getLocumsInAnArea()
    },

    limit() {
      this.page = 1
      this.getLocumsInAnArea()
    },

    activePage() {
      this.getLocumsInAnArea()
    }
  },

  mounted() {
    const { area, profession, order_by: orderBy = [], page } = this.$route.query

    this.area = area || ''
    this.profession = profession || ''
    this.orderBy = orderBy
    this.activePage = page ? Number.parseInt(page) : 1

    this.getLocumsInAnArea()
  },

  methods: {
    filterReset() {
      this.area = ''
      this.profession = ''
      this.filterSearch()
    },

    filterSearch() {
      this.activePage = 1

      const query = {
        ...this.$route.query,
        area: this.area || undefined,
        profession: this.profession || undefined,
        order_by: this.orderBy || undefined,
        page: undefined
      }

      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
        this.$router.replace({ query })
      }

      this.getLocumsInAnArea()
    },

    setPage(page) {
      this.activePage = page

      this.$router.replace({
        query: {
          ...this.$route.query,
          page: this.activePage === 1 ? undefined : this.activePage
        }
      })

      this.getLocumsInAnArea()
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

      this.getLocumsInAnArea()
    },

    getLocumsInAnArea() {
      this.loading = true
      this.locumsInAnArea = []

      const params = this.filterParams

      Promise.all([
        this.$axios.get(`${API_BASE}/count`, { params }).then(res => res.data.data.count),

        this.$axios
          .get(API_BASE, {
            params: { ...params, order_by: this.orderBy, limit: this.limit, offset: this.offset }
          })
          .then(res => res.data.data.locums_in_an_area),

        this.$axios
          .post(`${API_BASE}/generate-key`, { filename: 'locumsInAnArea.csv' }, { params: { ...params, order_by: this.orderBy } })
          .then(res => res.data.data.token)
      ])
        .then(([count, locumsInAnArea, downloadToken]) => {
          this.count = count
          this.locumsInAnArea = locumsInAnArea
          this.downloadToken = downloadToken
        })
        .catch(err => {
          console.log('err', err)
          this.$nuxt.error(err)
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
