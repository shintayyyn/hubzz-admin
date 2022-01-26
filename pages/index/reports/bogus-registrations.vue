<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl ">
        Bogus Registrations
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-022
      </div>

      <div
        class="flex-wrap justify-start items-start w-full border p-3 rounded-lg flex  my-2"
      >
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="nameIncludes"
            placeholder="Search by Name"
            type="text"
            label="Full Name"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="domain"
            class="w-full mr-2"
            :type="'select'"
            :name="'status'"
            :placeholder="'Filter by Domain'"
            :items="[{label: 'Practice', value: 'Practice'}, {label: 'Locum', value: 'Locum'}]"
            :label="'Domain'"
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
        <!-- make this watch, then get -->
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
        :items="bogusRegistrations"
        :getItemKey="(item) => item.id"
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
            :disabled="downloading || bogusRegistrations.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="bogusRegistrations.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
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
      AppButton,
    },

    data () {
      return {
        loading: false,
        count: 0,
        downloading: false,
        bogusRegistrations: [],
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

        nameIncludes: '',
        domain: '',
        downloadToken: null,
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },
      itemCountInfo () {
        const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
        const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.bogusRegistrations.length), this.count)
        
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
            title: 'User Id',
            key: 'id',
            sort_key: null,
            column: (item) => item.id,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Full Name',
            key: 'full_name',
            sort_key: 'full_name',
            column: (item) => item.full_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Domain',
            key: 'domain',
            sort_key: 'domain',
            column: (item) => item.domain,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          // {
          //   title: 'Domain',
          //   key: 'domain',
          //   sort_key: 'domain',
          //   column: (item) => item.domain,
          //   justify: 'start',
          //   flexGrow: 1,
          //   flexShrink: 0,
          // },
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
        this.getBogusRegistrations()
      },

      limit () {
        this.page = 1
        this.getBogusRegistrations()
      },

      activePage () {
        this.getBogusRegistrations()
      },
    },

    mounted () {      
      const {
        name_includes: nameIncludes,
        domain: domain,
        order_by: orderBy = [],
        page,
      } = this.$route.query

      this.nameIncludes = nameIncludes ? nameIncludes : ''
      this.domain = domain ? domain : ''

      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getBogusRegistrations()
    },

    methods: {
      filterReset () {
        this.nameIncludes = ''
        this.domain = ''

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          name_includes: this.nameIncludes ? this.nameIncludes : undefined,
          domain: this.domain ? this.domain : undefined,
          order_by: this.orderBy ? this.orderBy : undefined,
          page: undefined,
        }

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.$router.replace({ query })
        }
        
        this.getBogusRegistrations()
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

        this.getBogusRegistrations()
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

        this.getBogusRegistrations()
      },

      getBogusRegistrations () {
        this.loading = true
        this.bogusRegistrations = []

        const params = {
          name_includes: this.nameIncludes ? this.nameIncludes : '',
          domain: this.domain ? this.domain : '',
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/reports/bogus-registrations/count', {
            params
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get(`/api/v1/admin/reports/bogus-registrations`, {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.bogus_registrations
          }),

          this.$axios.post('/api/v1/admin/reports/bogus-registrations/generate-key', {
            filename: `bogusRegistrations.csv`,
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
            bogusRegistrations,
            downloadToken,
          ] = results

          this.count = count
          this.bogusRegistrations = bogusRegistrations
          this.downloadToken = downloadToken     
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err.response ? err.response.data : err)
        }).finally(() => {
          this.loading = false
        })
      },

      downloadCsv () {
        window.open(`${process.env.API_URL}/api/v1/admin/reports/bogus-registrations/csv?token=${this.downloadToken}`)
      },
    },

  }
</script>
