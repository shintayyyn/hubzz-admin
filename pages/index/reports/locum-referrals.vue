<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl ">
        Locum Referrals
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-020
      </div>

      <div
        class="flex-wrap justify-start items-center w-full border p-3 rounded-lg flex  my-2"
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
            v-model="referredLocumNameIncludes"
            placeholder="Search Referred Locum Name"
            type="text"
            label="Referred Locum Name"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="areaPostCode"
            placeholder="Search User Area Post Code"
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
        :items="locumReferrals"
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
            :disabled="downloading || locumReferrals.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="locumReferrals.length === 0 ? 'bg-gray-500' : 'bg-sunglow hover:bg-sunglow-dark'"
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
        locumReferrals: [],
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

        locumNameIncludes: '',
        referredLocumNameIncludes: '',
        areaPostCode: '',
        downloadToken: null,
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },
      
      itemCountInfo () {
        const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
        const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.locumReferrals.length), this.count)
        
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
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Locum Name',
            key: 'locum_name',
            sort_key: 'locum_name',
            column: (item) => item.locum_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Referred Locum Name',
            key: 'referral_name',
            sort_key: 'referral_name',
            column: (item) => item.referral_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Profession',
            key: 'profession',
            sort_key: 'profession',
            column: (item) => item.profession,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Area',
            key: 'referral_user_area',
            sort_key: 'referral_user_area',
            column: (item) => item.referral_user_area,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Referral Registered',
            key: 'date_referral_registered',
            sort_key: 'date_referral_registered',
            column: (item) => this.$moment(item.date_referral_registered, 'YYYY-MM-DD').format('DD/MM/YYYY'),
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
        locum_name_includes: locumNameIncludes,
        referral_locum_name_includes: referredLocumNameIncludes,
        area: areaPostCode,
        order_by: orderBy = [],
        page,
      } = this.$route.query

      this.locumNameIncludes = locumNameIncludes ? locumNameIncludes : ''
      this.referredLocumNameIncludes = referredLocumNameIncludes ? referredLocumNameIncludes : ''
      this.areaPostCode = areaPostCode ? areaPostCode : ''

      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getLocumReferrals()
    },

    methods: {
      filterReset () {
        this.locumNameIncludes = ''
        this.referredLocumNameIncludes = ''
        this.areaPostCode = ''

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
          referral_locum_name_includes: this.referredLocumNameIncludes ? this.referredLocumNameIncludes : undefined,
          area: this.areaPostCode ? this.areaPostCode : undefined,
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
        this.locumReferrals = []

        const params = {
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : '',
          referral_locum_name_includes: this.referredLocumNameIncludes ? this.referredLocumNameIncludes : '',
          area_includes: this.areaPostCode ? this.areaPostCode : '',
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/reports/locum-referrals/count', {
            params
          }).then((responses) => {
            return responses.data.data.count
          }),

          this.$axios.get('/api/v1/admin/reports/locum-referrals', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_referrals
          }),

          this.$axios.post('/api/v1/admin/reports/locum-referrals/generate-key', {
            filename: `locumReferrals.csv`,
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
            locumReferrals,
            downloadToken,
          ] = results

          this.count = count
          this.locumReferrals = locumReferrals
          this.downloadToken = downloadToken
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err.response ? err.response.data : err)
        }).finally(() => {
          this.loading = false
        })
      },

      downloadCsv () {
        window.open(`${process.env.API_URL}/api/v1/admin/reports/locum-referrals/csv?token=${this.downloadToken}`)
      },
    },

  }
</script>
