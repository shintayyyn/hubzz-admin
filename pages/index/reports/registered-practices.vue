<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl ">
        Sign Ups Practice
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-027
      </div>

      <div
        class="flex-col justify-start items-start w-full border p-3 rounded-lg flex  my-2"
      >
        <div class="flex flex-row w-full items-center">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="areaPostCode"
              placeholder="Search Area Postcode"
              type="text"
              label="Area Postcode"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="status"
              class="w-full "
              :type="'select'"
              :name="'status'"
              :placeholder="'Filter By Status'"
              :items="[
                {label: 'All', value: ''},
                {label: 'Active', value: 'Active'},
                {label: 'Dormant', value: 'Dormant'},
                {label: 'Inactive', value: 'Inactive'},
                {label: 'Account Suspension', value: 'Account Suspension'},
                {label: 'Bogus', value: 'Bogus'},
                {label: 'Deactivated', value: 'Deactivated'},
              ]"
              :label="'Status'"
            />
          </div>
        </div>
        
        <div class="flex flex-row w-full">
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
        :items="registeredPractices"
        :getItemKey="(item) => item.practice_id"
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
            :disabled="downloading || registeredPractices.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="registeredPractices.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
            @click="downloadCsv"
          >
            <svgicon name="cloud-download" width="21" height="21" color="fill" class="fill-current mr-2" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      <div v-if="false" class=""> 
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
      AppDate
    },

    data () {
      return {
        downloading: false,
        loading: false,
        count: 0,
        registeredPractices: [],
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

        dateStart: '',
        dateEnd: '',
        areaPostCode: '',
        status: '',
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },

      itemCountInfo () {
        const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
        const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.registeredPractices.length), this.count)
        
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
            title: 'Practice Name',
            key: 'practice_name',
            sort_key: 'practice_name',
            column: (item) => item.practice_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Registered',
            key: 'date_registered',
            sort_key: 'date_registered',
            column: (item) => item.date_registered ? this.$moment(item.date_registered, 'YYYY-MM-DD').format('DD/MM/YYYY') : null,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Area',
            key: 'area',
            sort_key: 'area',
            column: (item) => item.area,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Status',
            key: 'status',
            sort_key: 'status',
            column: (item) => item.status,
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
        this.getPractices()
      },

      limit () {
        this.page = 1
        this.getPractices()
      },

      activePage () {
        this.getPractices()
      },
    },

    mounted () {      
      const {
        registered_at_date_start: dateStart,
        registered_at_date_end: dateEnd,
        area_includes: areaPostCode,
        status,
        order_by: orderBy = ['date_registered:desc'],
        page,
      } = this.$route.query

      this.areaPostCode = areaPostCode ? areaPostCode : ''
      this.dateStart = dateStart ? dateStart : ''
      this.dateEnd = dateEnd ? dateEnd : ''
      this.status = status ? status : ''

      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getPractices()
    },

    methods: {
      filterReset () {
        this.areaPostCode = ''
        this.dateStart = ''
        this.dateEnd = ''
        this.status = ''

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          areaPostCode: this.areaPostCode ? this.areaPostCode : '',
          dateStart: this.dateStart ? this.dateStart : '',
          dateEnd: this.dateEnd ? this.dateEnd : '',
          status: this.status ? this.status : '',
          order_by: this.orderBy ? this.orderBy : undefined,
          page: undefined,
        }

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.$router.replace({ query })
        }
        
        this.getPractices()
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

        this.getPractices()
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

        this.getPractices()
      },

      getPractices () {
        this.loading = true
        this.registeredPractices = []

        const params = {
          registered_at_date_start: this.dateStart ? this.dateStart : '',
          registered_at_date_end: this.dateEnd ? this.dateEnd : '',
          area_includes: this.areaPostCode ? this.areaPostCode : '',
          status: this.status ? this.status : '',
        }
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/registered-practices/count', {
            params
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/registered-practices', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.registered_practices
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            registeredPractices,
          ] = results

          this.count = count
          this.registeredPractices = registeredPractices
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
          registered_at_date_start: this.dateStart ? this.dateStart : '',
          registered_at_date_end: this.dateEnd ? this.dateEnd : '',
          area_includes: this.areaPostCode ? this.areaPostCode : '',
          status: this.status ? this.status : '',
          order_by: this.orderBy,
          limit: 999,
          offset: 0,
        }

        this.$axios.post('/api/v1/admin/reports/registered-practices/generate-key', {
          filename: `registeredPractices.csv`,
        }, {
          params: {
            ...params,
          },
        }).then((responses) => {
          console.log('responses', responses)
          const token = responses.data.data.token

          window.open(`${process.env.API_URL}/api/v1/admin/reports/registered-practices/csv?token=${token}`)
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
