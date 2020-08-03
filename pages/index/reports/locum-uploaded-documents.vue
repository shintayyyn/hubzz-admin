<template>
  <div class="report-modal p-4 md:p-8 shadow-lg">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/reports" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="text-lg md:text-2xl text-white">
        Onboarding - Documents Uploaded
      </div>
  
      <div class="text-sm md:text-lg text-white">
        Rep-015
      </div>

      <div
        class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg flex bg-waterloo text-white my-2"
      >
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="locumNameIncludes"
            placeholder="Search Locum Name"
            type="text"
            label="Locum Name"
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
        :items="locumUploadedDocuments"
        :getItemKey="(item) => item.locum_user_id"
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
      <div
        class="flex-wrap justify-start items-center w-full p-3 flex my-2"
      >
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading"
            class="bg-sunglow hover:bg-sunglow-dark px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
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

    data () {
      return {
        loading: false,
        downloading: false,
        count: 0,
        locumUploadedDocuments: [],
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

        locumNameIncludes: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
        const lastItem = Math.min((this.limit * this.activePage) - this.limit + (this.loading ? this.limit : this.locumUploadedDocuments.length), this.count)
        
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
            title: 'Locum',
            key: 'locum_user_name',
            sort_key: 'locum_user_name',
            column: (item) => item.locum_user_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Registered',
            key: 'date_registered',
            sort_key: 'date_registered',
            column: (item) => this.$moment(item.date_registered, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Documents Not Approved',
            key: 'documents_not_approved_count',
            sort_key: 'documents_not_approved_count',
            column: (item) => item.documents_not_approved_count,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Documents Not Uploaded',
            key: 'documents_not_uploaded_count',
            sort_key: 'documents_not_uploaded_count',
            column: (item) => item.documents_not_uploaded_count,
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
        this.getLocumUploadedDocuments()
      },

      limit () {
        this.page = 1
        this.getLocumUploadedDocuments()
      },

      activePage () {
        this.getLocumUploadedDocuments()
      },
    },

    mounted () {      
      const {
        locum_name_includes: locumNameIncludes,
        order_by: orderBy = [],
        page,
      } = this.$route.query

      this.locumNameIncludes = locumNameIncludes ? locumNameIncludes : ''

      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getLocumUploadedDocuments()
    },

    methods: {
      filterReset () {
        this.locumNameIncludes = ''

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
          order_by: this.orderBy ? this.orderBy : undefined,
          page: undefined,
        }

        if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
          this.$router.replace({ query })
        }

        this.getLocumUploadedDocuments()
      },

      setPage (page) {
        this.activePage = page

        if (this.activePage === 1) {
          this.$router.replace({
            query: {
              ...this.$route.query,
              order_by: this.orderBy,
              page: undefined,
            }
          })
        } else {
          this.$router.replace({
            query: {
              ...this.$route.query,
              page: this.activePage,
              order_by: this.orderBy,
            }
          })
        }

        this.getLocumUploadedDocuments()
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

        this.getLocumUploadedDocuments()
      },

      getLocumUploadedDocuments () {
        this.loading = true
        this.locumUploadedDocuments = []

        const params = {
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
        }
        Promise.all([
          this.$axios.get('/api/v1/admin/reports/locum-uploaded-documents/count', {
            params
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/reports/locum-uploaded-documents', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_uploaded_documents
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          const [
            count,
            locumUploadedDocuments,
          ] = results

          this.count = count
          this.locumUploadedDocuments = locumUploadedDocuments
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      downloadCsv () {
        this.downloading = true
        const params = {
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
          order_by: this.orderBy,
          limit: 999,
          offset: 0,
        }

        this.$axios.post('/api/v1/admin/reports/locum-uploaded-documents/generate-key', {
          filename: `locumUploadedDocumentsReport.csv`,
        }, {
          params: {
            ...params,
          },
        }).then((responses) => {
          const token = responses.data.data.token

          window.open(`${process.env.API_URL}/api/v1/admin/reports/locum-uploaded-documents/csv?token=${token}`)
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
