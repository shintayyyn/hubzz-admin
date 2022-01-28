<template>
  <div>
    <div class="page-overlap flex-1 flex flex-col self-end">
      <div class="text-lg md:text-2xl ">
        Onboarding - Documents Uploaded
      </div>
  
      <div class="text-sm md:text-lg ">
        Rep-015
      </div>

      <div class="flex-col justify-start items-center w-full border p-3 rounded-lg flex my-2">
        <div class="flex flex-col md:flex-row w-full items-center">
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
              v-model="notApprovedComplianceDocumentNamesIncludes"
              placeholder="Search Document Not Approved"
              type="text"
              label="Document Not Approved"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="notUploadComplianceDocumentNamesIncludes"
              placeholder="Search Document Not uploaded"
              type="text"
              label="Document Not uploaded"
            />
          </div>
        </div>

        <div class="flex flex-col md:flex-row w-full items-center">
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="registeredDateStart"
              label="Date Registered Start"
              format="YYYY-MM-DD"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppDate
              v-model="registeredDateEnd"
              label="Date Registered End"
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
        :items="locumUploadedDocuments"
        :getItemKey="item => item.locum_user_id"
        :columnDetails="columnDetails"
        :orderBy="orderBy"
        :loading="loading"
        @setOrderBy="setOrderBy"
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

      <div v-if="authAdminPermissions.includes('Generate Reports')" class="flex-wrap justify-start items-center w-full p-3 flex my-2">
        <div class="md:px-1 flex flex-wrap w-full justify-end">
          <button
            :disabled="downloading 
              || locumUploadedDocuments.length === 0"
            class="px-4 py-2 rounded-lg flex items-center text-xs md:text-sm"
            :class="locumUploadedDocuments.length === 0 
              ? 'bg-gray-500' 
              : 'bg-sunglow hover:bg-sunglow-dark'"
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

  export default {
    components: {
      ReportTable,
      ReportPagination,
      AppInput,
      AppButton,
      AppDate,
    },

    data () {
      return {
        loading: false,
        downloading: false,
        count: 0,
        locumUploadedDocuments: [],
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
        notApprovedComplianceDocumentNamesIncludes: '',
        notUploadComplianceDocumentNamesIncludes: '',
        registeredDateStart: '',
        registeredDateEnd: '',
        approvedDateStart: '',
        approvedDateEnd: '',
        complianceStatus: '',
        complianceStatusSelectionList: [
          {
            label: 'All',
            value: '',
          },
          {
            label: 'Empty',
            value: 'Empty',
          },
          {
            label: 'Incomplete',
            value: 'Incomplete',
          },
          {
            label: 'Pending',
            value: 'Pending',
          },
          {
            label: 'Expiring',
            value: 'Expiring',
          },
          {
            label: 'Expired',
            value: 'Expired',
          },
          {
            label: 'Rejected',
            value: 'Rejected',
          },
          {
            label: 'Compliant',
            value: 'Compliant',
          },
        ],
        minCompliancePercentage: '',
        maxCompliancePercentage: '',
        downloadToken: null,
      }
    },

    computed: {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },

      itemCountInfo () {
        const firstItem = Math.min((this.limit * this.activePage) - this.limit + 1, this.count)
        const lastItem = Math.min(
          (this.limit * this.activePage) - this.limit
          +
          (this.loading ? this.limit : this.locumUploadedDocuments.length),
          this.count
        )
        
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
            flexBasis: 'auto',
          },
          {
            title: 'Locum ID',
            key: 'locum_user_id',
            sort_key: 'locum_user_id',
            column: item => item.locum_user_id,
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
          },
          {
            title: 'Locum Name',
            key: 'locum_user_name',
            sort_key: 'locum_user_name',
            column: item => item.locum_user_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Registered',
            key: 'date_registered_in_gb_formatted',
            sort_key: 'date_registered',
            column: item => item.date_registered_in_gb_formatted,
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
          },
          {
            title: 'Documents Not Approved',
            key: 'not_approved_compliance_document_names',
            sort_key: 'not_approved_compliance_document_names',
            column: item => item.not_approved_compliance_document_names || '(none)',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Documents Not uploaded',
            key: 'not_upload_compliance_document_names',
            sort_key: 'not_upload_compliance_document_names',
            column: item => item.not_upload_compliance_document_names || '(none)',
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
      limit () {
        this.page = 1
        this.getLocumUploadedDocuments()
      },
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
      },
    },

    mounted () {      
     const {
        locum_name_includes: locumNameIncludes,
        not_approved_compliance_document_names_includes:
          notApprovedComplianceDocumentNamesIncludes,
        not_upload_compliance_document_names_includes:
          notUploadComplianceDocumentNamesIncludes,
        min_compliance_percentage: minCompliancePercentage,
        max_compliance_percentage: maxCompliancePercentage,
        compliance_status: complianceStatus,
        registered_at_date_start: registeredDateStart,
        registered_at_date_end: registeredDateEnd,
        approved_at_date_start: approvedDateStart,
        approved_at_date_end: approvedDateEnd,
        order_by: orderBy = ['date_registered:desc',],
        page,
      } = this.$route.query

      this.locumNameIncludes = locumNameIncludes ? locumNameIncludes : ''
      this.notApprovedComplianceDocumentNamesIncludes = notApprovedComplianceDocumentNamesIncludes
        ? notApprovedComplianceDocumentNamesIncludes
        : ''
      this.notUploadComplianceDocumentNamesIncludes = notUploadComplianceDocumentNamesIncludes
        ? notUploadComplianceDocumentNamesIncludes
        : ''
      this.minCompliancePercentage = minCompliancePercentage ? minCompliancePercentage : ''
      this.maxCompliancePercentage = maxCompliancePercentage ? maxCompliancePercentage : ''
      this.complianceStatus = complianceStatus ? complianceStatus : ''
      this.registeredDateStart = registeredDateStart ? registeredDateStart : ''
      this.registeredDateEnd = registeredDateEnd ? registeredDateEnd : ''
      this.approvedDateStart = approvedDateStart ? approvedDateStart : ''
      this.approvedDateEnd = approvedDateEnd ? approvedDateEnd : ''

      this.orderBy = orderBy
      this.activePage = page ? Number.parseInt(page) : 1

      this.getLocumUploadedDocuments()
    },

    methods: {
      filterReset () {
        this.locumNameIncludes = ''
        this.notApprovedComplianceDocumentNamesIncludes = ''
        this.notUploadComplianceDocumentNamesIncludes = ''
        this.complianceStatus = ''
        this.minCompliancePercentage = ''
        this.maxCompliancePercentage = ''
        this.registeredDateStart = ''
        this.registeredDateEnd = ''
        this.approvedDateStart = ''
        this.approvedDateEnd = ''

        this.filterSearch()
      },

      filterSearch () {
        this.activePage = 1

        const query = {
          ...this.$route.query,
          locum_name_includes: this.locumNameIncludes ? this.locumNameIncludes : undefined,
          not_approved_compliance_document_names_includes:
            this.notApprovedComplianceDocumentNamesIncludes
              ? this.notApprovedComplianceDocumentNamesIncludes
              : undefined,
          not_upload_compliance_document_names_includes:
            this.notUploadComplianceDocumentNamesIncludes
              ? this.notUploadComplianceDocumentNamesIncludes
              : undefined,
          min_compliance_percentage: this.minCompliancePercentage ? this.minCompliancePercentage : undefined,
          max_compliance_percentage: this.maxCompliancePercentage ? this.maxCompliancePercentage : undefined,
          compliance_status: this.complianceStatus ? this.complianceStatus : undefined,
          registered_at_date_start: this.registeredDateStart ? this.registeredDateStart : undefined,
          registered_at_date_end: this.registeredDateEnd ? this.registeredDateEnd : undefined,
          approved_at_date_start: this.approvedDateStart ? this.approvedDateStart : undefined,
          approved_at_date_end: this.approvedDateEnd ? this.approvedDateEnd : undefined,
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
          not_approved_compliance_document_names_includes:
            this.notApprovedComplianceDocumentNamesIncludes
              ? this.notApprovedComplianceDocumentNamesIncludes
              : undefined,
          not_upload_compliance_document_names_includes:
            this.notUploadComplianceDocumentNamesIncludes
              ? this.notUploadComplianceDocumentNamesIncludes
              : undefined,
          min_compliance_percentage: this.minCompliancePercentage ? this.minCompliancePercentage : undefined,
          max_compliance_percentage: this.maxCompliancePercentage ? this.maxCompliancePercentage : undefined,
          compliance_status: this.complianceStatus ? this.complianceStatus : undefined,
          registered_at_date_start: this.registeredDateStart ? this.registeredDateStart : undefined,
          registered_at_date_end: this.registeredDateEnd ? this.registeredDateEnd : undefined,
          approved_at_date_start: this.approvedDateStart ? this.approvedDateStart : undefined,
          approved_at_date_end: this.approvedDateEnd ? this.approvedDateEnd : undefined,
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/reports/locum-uploaded-documents/count', {
            params: {
              ...params,
            },
          }).then(responses => responses.data.data.count),

          this.$axios.get('/api/v1/admin/reports/locum-uploaded-documents', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then(responses => responses.data.data.locum_uploaded_documents),

          this.$axios.post('/api/v1/admin/reports/locum-uploaded-documents/generate-key', {
            filename: `locumUploadedDocumentsReport.csv`,
          }, {
            params: {
              ...params,
              order_by: this.orderBy,
            },
          }).then((responses) => {
            const token = responses.data.data.token

            return token
          }),
        ]).then((results) => {
          const [
            count,
            locumUploadedDocuments,
            downloadToken,
          ] = results

          this.count = count
          this.locumUploadedDocuments = locumUploadedDocuments
          this.downloadToken = downloadToken
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      downloadCsv () {
        window.open(`${process.env.API_URL}/api/v1/admin/reports/locum-uploaded-documents/csv?token=${this.downloadToken}`)
      },
    },

  }
</script>
