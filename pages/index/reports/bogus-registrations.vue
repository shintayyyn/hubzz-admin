<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/reports" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl text-white">
        Bogus Registrations
      </div>
  
      <div class="text-sm md:text-lg text-white">
        Rep-022
      </div>

      <div
        class="flex-wrap justify-start items-start w-full shadow-lg p-3 rounded-lg flex bg-waterloo text-white my-2"
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
        :items="bogusRegistrations"
        :getItemKey="(item) => item.id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="(value) => orderBy = value"
      />

      <div class="w-full flex flex-wrap justfify-between items-center">
        <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
          <div class="text-white w-full md:w-auto text-center md:text-left">
            <div class="whitespace-no-wrap">
              {{ itemCountInfo }}
            </div>
            <div class="whitespace-no-wrap">
              Page: {{ activePage }} / {{ pages }}
            </div>
            <div class="whitespace-no-wrap">
              Order By: {{ orderBy.join(',') }}
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
        bogusRegistrations: [],
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

        nameIncludes: '',
        domain: '',
      }
    },

    computed: {
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
            column: (item, index) => this.offset + index + 1,
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
            flexGrow: 0,
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
          {
            title: 'Domain',
            key: 'domain',
            sort_key: 'domain',
            column: (item) => item.domain,
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
        this.getLocumReferrals()
      },

      limit () {
        this.page = 1
        this.getLocumReferrals()
      },

      activePage () {
        this.getLocumReferrals()
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

      this.getLocumReferrals()
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
        
        this.getLocumReferrals()
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

        this.getLocumReferrals()
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

        this.getLocumReferrals()
      },

      getLocumReferrals () {
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
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            bogusRegistrations,
          ] = results

          this.count = count
          this.bogusRegistrations = bogusRegistrations          
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err.response ? err.response.data : err)
        }).finally(() => {
          this.loading = false
        })
      },
    },

  }
</script>
