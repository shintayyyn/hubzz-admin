<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Job Locum Users
    </div>

    <ContentManagementTable
      :limit="limit"
      :items="jobUsers"
      :getItemKey="(item) => `${item.job_id}-${item.locum_user_id}`"
      :getItemLink="(item) => true ? null : `/content-management/job-users/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-job-users'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/job-users"
    />
  
    <nuxt-child
      @jobUserCreated="jobUserCreatedHandler"
      @jobUserUpdated="jobUserUpdatedHandler"
      @jobUserDeleted="jobUserDeletedHandler"
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
        jobUsers: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.jobUsers.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.jobUsers.length, 0)
      },

      columnDetails () {
        return [
          {
            title: 'Job ID',
            key: 'job_id',
            sort_key: 'job_id',
            column: (item) => item.job_id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Locum ID',
            key: 'locum_user_id',
            sort_key: 'locum_user_id',
            column: (item) => item.locum_user_id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Locum Qualified',
            key: 'locum_user_qualified',
            sort_key: 'locum_user_qualified',
            column: (item) => item.locum_user_qualified ? 'Yes' : 'No',
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Locum Matched',
            key: 'locum_user_matched',
            sort_key: 'locum_user_matched',
            column: (item) => item.locum_user_matched ? 'Yes' : 'No',
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title:  '',
            key: null,
            sort_key: null,
            column: () => '',
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
        this.getJobs()
      },

      limit () {
        this.activePage = 1
        this.getJobs()
      },

      activePage () {
        this.getJobs()
      },
    },

    mounted () {
      this.search = ''
      this.getJobs()
    },
    
    methods: {
      searchSubmit: debounce(function () {
        this.activePage = 1
        this.getJobs()
      }, 500),

      getJobs () {
        this.loading = true
        // this.count = 0
        this.jobUsers = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/job-users/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/job-users', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.job_users
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              jobUsers,
            ] = results

            this.count = count
            this.jobUsers = jobUsers
          }
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      loadMoredJobs (limit) {
        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        this.$axios.get('/api/v1/admin/job-users', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.job_users.forEach((jobUser) => {
            this.jobUsers.push(jobUser)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      jobUserCreatedHandler (data) {
        const {
          jobUser
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.jobUsers.length < this.limit) {
            this.jobUsers.push(jobUser)
          }
        }
      },

      jobUserUpdatedHandler (data) {
        const {
          jobUser
        } = data

        const index = this.jobUsers.findIndex(({ id }) => id === jobUser.id)

        if (index > -1) {
          this.jobUsers.splice(index, 1, jobUser)
        }
      },

      jobUserDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.jobUsers.findIndex((jobUser) => jobUser.id === id)

          if (index > -1) {
            this.jobUsers.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredJobs(1)
            }
          }
        }
      },
    },

  }
</script>
