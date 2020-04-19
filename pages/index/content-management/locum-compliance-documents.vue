<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Locum Compliance Documents
    </div>

    <div v-if="false" class="flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search name"
            style="width: 250px;"
            @keyup="searchSubmit"
          >
          <button
            v-if="search"
            class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1"
            @click="(search = ''), searchSubmit()"
          >
            <svgicon
              name="times-solid"
              height="12"
              width="12"
              class="text-white hover:text-yellow-500 fill-current -mx-2 md:-mx-6"
            />
          </button>
        </div>
      </div>
    </div>

    <ContentManagementTable
      :limit="limit"
      :items="locumComplianceDocuments"
      :getItemKey="(item) => item.id"
      :getItemLink="(item) => true ? null : `/content-management/locum-compliance-documents/${item.id}`"
      :columnDetails="columnDetails"
      :orderBy="orderBy"
      :loading="loading"
      @setOrderBy="(value) => orderBy = value"
    />

    <div class="w-full flex flex-wrap justfify-between items-center">
      <div class="flex-1 flex flex-wrap justify-between pt-2 md:py-2 text-sm">
        <div class="text-gray-500 w-full md:w-auto text-center md:text-left">
          <div class="whitespace-no-wrap">
            {{ itemCountInfo }}
          </div>
          <div class="whitespace-no-wrap">
            Page: {{ Math.min(activePage, pages) }} / {{ pages }}
          </div>
        </div>
      </div>

      <ContentManagementPagination
        :count="count"
        :pages="pages"
        :page="activePage"
        :maxPage="7"
        @page="(page) => activePage = page"
      />
    </div>

    <nuxt-link
      v-if="$route.name !== 'index-content-management-locum-compliance-documents'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/locum-compliance-documents"
    />
  
    <nuxt-child
      @locumComplianceDocumentCreated="locumComplianceDocumentCreatedHandler"
      @locumComplianceDocumentUpdated="locumComplianceDocumentUpdatedHandler"
      @locumComplianceDocumentDeleted="locumComplianceDocumentDeletedHandler"
    />
  </div>
</template>

<script>
  import debounce from "lodash.debounce"

  import ContentManagementTable from '@/components/ContentManagement/ContentManagementTable'
  import ContentManagementPagination from '@/components/ContentManagement/ContentManagementPagination'

  export default {
    components: {
      ContentManagementTable,
      ContentManagementPagination,
    },

    data () {
      return {
        loading: false,
        count: 0,
        locumComplianceDocuments: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.locumComplianceDocuments.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.locumComplianceDocuments.length, 0)
      },

      columnDetails () {
        return [
          {
            title: 'ID',
            key: 'id',
            sort_key: 'id',
            column: (item) => item.id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Type',
            key: 'type',
            sort_key: 'type',
            column: (item) => item.type,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Locum ID',
            key: 'locum_user_id',
            sort_key: 'locum_user_id',
            column: (item) => item.locum_user ? item.locum_user.id : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Locum Email',
            key: 'locum_user_email',
            sort_key: 'locum_user_email',
            column: (item) => item.locum_user ? item.locum_user.email : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Locum Name',
            key: 'locum_user_name',
            sort_key: 'locum_user_name',
            column: (item) => item.locum_user ? item.locum_user.name : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Compliance Document',
            key: 'compliance_document_name',
            sort_key: 'compliance_document_name',
            column: (item) => item.compliance_document ? item.compliance_document.name : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Country',
            key: 'country_name',
            sort_key: 'country_name',
            column: (item) => item.country ? item.country.name : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Has Reference',
            key: 'has_reference',
            sort_key: 'has_reference',
            column: (item) => item.has_reference ? 'Yes' : 'No',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Reference',
            key: 'reference',
            sort_key: 'reference',
            column: (item) => item.reference,
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
          {
            title: 'Expired At',
            key: 'expired_at',
            sort_key: 'expired_at',
            column: (item) => item.expired_at_formatted,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Verified At',
            key: 'verified_at',
            sort_key: 'verified_at',
            column: (item) => item.verified_at_formatted,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Rejected At',
            key: 'rejected_at',
            sort_key: 'rejected_at',
            column: (item) => item.rejected_at_formatted,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Note',
            key: 'note',
            sort_key: 'note',
            column: (item) => item.note,
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
        this.activePage = 1
        this.getLocumComplianceDocuments()
      },

      limit () {
        this.activePage = 1
        this.getLocumComplianceDocuments()
      },

      activePage () {
        this.getLocumComplianceDocuments()
      },
    },

    mounted () {
      this.search = ''
      this.getLocumComplianceDocuments()
    },
    
    methods: {
      searchSubmit: debounce(function () {
        this.activePage = 1
        this.getLocumComplianceDocuments()
      }, 500),

      getLocumComplianceDocuments () {
        this.loading = true
        // this.count = 0
        this.locumComplianceDocuments = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/locum-compliance-documents/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/locum-compliance-documents', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_compliance_documents
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              locumComplianceDocuments,
            ] = results

            this.count = count
            this.locumComplianceDocuments = locumComplianceDocuments
          }
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      loadMoredLocumComplianceDocuments (limit) {
        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        this.$axios.get('/api/v1/admin/locum-compliance-documents', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.locumComplianceDocuments.forEach((locumComplianceDocument) => {
            this.locumComplianceDocuments.push(locumComplianceDocument)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      locumComplianceDocumentCreatedHandler (data) {
        const {
          locumComplianceDocument
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.locumComplianceDocuments.length < this.limit) {
            this.locumComplianceDocuments.push(locumComplianceDocument)
          }
        }
      },

      locumComplianceDocumentUpdatedHandler (data) {
        const {
          locumComplianceDocument
        } = data

        const index = this.locumComplianceDocuments.findIndex(({ id }) => id === locumComplianceDocument.id)

        if (index > -1) {
          this.locumComplianceDocuments.splice(index, 1, locumComplianceDocument)
        }
      },

      locumComplianceDocumentDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.locumComplianceDocuments.findIndex((locumComplianceDocument) => locumComplianceDocument.id === id)

          if (index > -1) {
            this.locumComplianceDocuments.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredLocumComplianceDocuments(1)
            }
          }
        }
      },
    },

  }
</script>
