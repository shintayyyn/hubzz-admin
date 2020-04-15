<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Practices
    </div>

    <ContentManagementTable
      :limit="limit"
      :items="practices"
      :getItemKey="(item) => item.id"
      :getItemLink="(item) => true ? null : `/content-management/practices/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-practices'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/practices"
    />
  
    <nuxt-child
      @practiceCreated="practiceCreatedHandler"
      @practiceUpdated="practiceUpdatedHandler"
      @practiceDeleted="practiceDeletedHandler"
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
        practices: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.practices.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.practices.length, 0)
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
            title: 'Name',
            key: 'name',
            sort_key: 'name',
            column: (item) => item.name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Code',
            key: 'code',
            sort_key: 'code',
            column: (item) => item.code,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Verified',
            key: 'verified',
            sort_key: 'verified',
            column: (item) => item.verified ? 'Yes' : 'No',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'First Actived At',
            key: 'first_actived_at',
            sort_key: 'first_actived_at',
            column: (item) => item.first_actived_at ? this.$moment(item.first_actived_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
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
            title: 'Parent Name',
            key: 'parent_practice_name',
            sort_key: 'parent_practice_name',
            column: (item) => item.parent_practice ? item.parent_practice.name : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Parent Code',
            key: 'parent_practice_code',
            sort_key: 'parent_practice_code',
            column: (item) => item.parent_practice ? item.parent_practice.code : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Parent Status',
            key: 'parent_practice_status',
            sort_key: 'parent_practice_status',
            column: (item) => item.parent_practice ? item.parent_practice.status : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Created At',
            key: 'created_at',
            sort_key: 'created_at',
            column: (item) => item.created_at ? this.$moment(item.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
        ]
      },

      pages () {
        return Math.max(Math.ceil(this.count / this.limit), 0)
      },
    },

    watch: {
      orderBy () {
        this.activePage = 1
        this.getPractices()
      },

      limit () {
        this.activePage = 1
        this.getPractices()
      },

      activePage () {
        this.getPractices()
      },
    },

    mounted () {
      this.search = ''
      this.getPractices()
    },
    
    methods: {
      searchSubmit: debounce(function () {
        this.activePage = 1
        this.getPractices()
      }, 500),

      getPractices () {
        this.loading = true
        this.count = 0
        this.practices = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/practices/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/practices', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.practices
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              practices,
            ] = results

            this.count = count
            this.practices = practices
          }
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      loadMoredPractices (limit) {
        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        this.$axios.get('/api/v1/admin/practices', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.practices.forEach((practice) => {
            this.practices.push(practice)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      practiceCreatedHandler (data) {
        const {
          practice
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.practices.length < this.limit) {
            this.practices.push(practice)
          }
        }
      },

      practiceUpdatedHandler (data) {
        const {
          practice
        } = data

        const index = this.practices.findIndex(({ id }) => id === practice.id)

        if (index > -1) {
          this.practices.splice(index, 1, practice)
        }
      },

      practiceDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.practices.findIndex((practice) => practice.id === id)

          if (index > -1) {
            this.practices.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredPractices(1)
            }
          }
        }
      },
    },

  }
</script>
