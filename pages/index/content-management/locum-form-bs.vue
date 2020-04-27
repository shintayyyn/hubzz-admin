<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Locum Form Bs
    </div>

    <ContentManagementTable
      :limit="limit"
      :items="locumFormBs"
      :getItemKey="(item) => item.id"
      :getItemLink="(item) => true ? null : `/content-management/locum-form-bs/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-locum-form-bs'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/locum-form-bs"
    />
  
    <nuxt-child
      @locumFormBCreated="locumFormBCreatedHandler"
      @locumFormBUpdated="locumFormBUpdatedHandler"
      @locumFormBDeleted="locumFormBDeletedHandler"
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
        locumFormBs: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.locumFormBs.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.locumFormBs.length, 0)
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
        this.getLocumFormBs()
      },

      limit () {
        this.activePage = 1
        this.getLocumFormBs()
      },

      activePage () {
        this.getLocumFormBs()
      },
    },

    mounted () {
      this.search = ''
      this.getLocumFormBs()
    },
    
    methods: {
      searchSubmit: debounce(function () {
        this.activePage = 1
        this.getLocumFormBs()
      }, 500),

      getLocumFormBs () {
        this.loading = true
        // this.count = 0
        this.locumFormBs = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/locum-form-bs/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/locum-form-bs', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_form_bs
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              locumFormBs,
            ] = results

            this.count = count
            this.locumFormBs = locumFormBs
          }
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      loadMoredLocumFormBs (limit) {
        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        this.$axios.get('/api/v1/admin/locum-form-bs', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.locumFormBs.forEach((locumFormB) => {
            this.locumFormBs.push(locumFormB)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      locumFormBCreatedHandler (data) {
        const {
          locumFormB
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.locumFormBs.length < this.limit) {
            this.locumFormBs.push(locumFormB)
          }
        }
      },

      locumFormBUpdatedHandler (data) {
        const {
          locumFormB
        } = data

        const index = this.locumFormBs.findIndex(({ id }) => id === locumFormB.id)

        if (index > -1) {
          this.locumFormBs.splice(index, 1, locumFormB)
        }
      },

      locumFormBDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.locumFormBs.findIndex((locumFormB) => locumFormB.id === id)

          if (index > -1) {
            this.locumFormBs.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredLocumFormBs(1)
            }
          }
        }
      },
    },

  }
</script>
