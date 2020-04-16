<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Locum Invoices
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
      :items="locumInvoices"
      :getItemKey="(item) => item.id"
      :getItemLink="(item) => true ? null : `/content-management/locum-invoices/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-locum-invoices'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/locum-invoices"
    />
  
    <nuxt-child
      @locumInvoiceCreated="locumInvoiceCreatedHandler"
      @locumInvoiceUpdated="locumInvoiceUpdatedHandler"
      @locumInvoiceDeleted="locumInvoiceDeletedHandler"
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
        locumInvoices: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.locumInvoices.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.locumInvoices.length, 0)
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
            title: 'Invoice Number',
            key: 'invoice_number',
            sort_key: 'invoice_number',
            column: (item) => item.invoice_number,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Part Number',
            key: 'job_part_number',
            sort_key: 'job_part_number',
            column: (item) => item.item && item.item.job_part ? item.item.job_part.job_part_number : '',
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
            title: 'Issued At',
            key: 'issued_at',
            sort_key: 'issued_at',
            column: (item) => item.issued_at ? this.$moment(item.issued_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Approved At',
            key: 'approved_at',
            sort_key: 'approved_at',
            column: (item) => item.approved_at ? this.$moment(item.approved_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Paid At',
            key: 'paid_at',
            sort_key: 'paid_at',
            column: (item) => item.paid_at ? this.$moment(item.paid_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY') : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Date Created',
            key: 'date_created',
            sort_key: 'date_created',
            column: (item) => item.date_created ? this.$moment(item.date_created, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
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
        this.getLocumInvoices()
      },

      limit () {
        this.activePage = 1
        this.getLocumInvoices()
      },

      activePage () {
        this.getLocumInvoices()
      },
    },

    mounted () {
      this.search = ''
      this.orderBy = [
        'date_created:desc',
      ]
      // this.getLocumInvoices()
    },
    
    methods: {
      searchSubmit: debounce(function () {
        this.activePage = 1
        this.getLocumInvoices()
      }, 500),

      getLocumInvoices () {
        this.loading = true
        this.count = 0
        this.locumInvoices = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/locum-invoice-payloads/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/locum-invoice-payloads', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_invoices
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              locumInvoices,
            ] = results

            this.count = count
            this.locumInvoices = locumInvoices
          }
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      loadMoredLocumInvoices (limit) {
        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        this.$axios.get('/api/v1/admin/locum-invoice-payloads', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.locumInvoices.forEach((locumInvoice) => {
            this.locumInvoices.push(locumInvoice)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      locumInvoiceCreatedHandler (data) {
        const {
          locumInvoice
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.locumInvoices.length < this.limit) {
            this.locumInvoices.push(locumInvoice)
          }
        }
      },

      locumInvoiceUpdatedHandler (data) {
        const {
          locumInvoice
        } = data

        const index = this.locumInvoices.findIndex(({ id }) => id === locumInvoice.id)

        if (index > -1) {
          this.locumInvoices.splice(index, 1, locumInvoice)
        }
      },

      locumInvoiceDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.locumInvoices.findIndex((locumInvoice) => locumInvoice.id === id)

          if (index > -1) {
            this.locumInvoices.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredLocumInvoices(1)
            }
          }
        }
      },
    },

  }
</script>
