<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Locum Available Jobs
    </div>

    <ContentManagementTable
      :limit="limit"
      :items="locumAvailableJobs"
      :getItemKey="(item) => `${item.id}-${item.locum_user_id}`"
      :getItemLink="(item) => true ? null : `/content-management/locum-available-jobs/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-locum-available-jobs'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/locum-available-jobs"
    />
  
    <nuxt-child
      @locumAvailableJobCreated="locumAvailableJobCreatedHandler"
      @locumAvailableJobUpdated="locumAvailableJobUpdatedHandler"
      @locumAvailableJobDeleted="locumAvailableJobDeletedHandler"
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
        locumAvailableJobs: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.locumAvailableJobs.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.locumAvailableJobs.length, 0)
      },

      columnDetails () {
        return [
          {
            title: 'Job ID',
            key: 'id',
            sort_key: 'id',
            column: (item) => item.id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Job Number',
            key: 'job_number',
            sort_key: 'job_number',
            column: (item) => item.job_number,
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
            title: 'Title',
            key: 'title',
            sort_key: 'title',
            column: (item) => item.title,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Practice Name',
            key: 'job_practice_name',
            sort_key: 'job_practice_name',
            column: (item) => item.job_practice_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Practice Code',
            key: 'job_practice_code',
            sort_key: 'job_practice_code',
            column: (item) => item.job_practice_code,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Locum Status',
            key: 'job_locum_status',
            sort_key: 'job_locum_status',
            column: (item) => item.job_locum_status,
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
            title: 'Locum Status',
            key: 'locum_user_status',
            sort_key: 'locum_user_status',
            column: (item) => item.locum_user ? item.locum_user.status : '',
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
        this.count = 0
        this.locumAvailableJobs = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/locum-available-jobs/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/locum-available-jobs', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.locum_available_jobs
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              locumAvailableJobs,
            ] = results

            this.count = count
            this.locumAvailableJobs = locumAvailableJobs
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

        this.$axios.get('/api/v1/admin/locum-available-jobs', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.locumAvailableJobs.forEach((locumAvailableJob) => {
            this.locumAvailableJobs.push(locumAvailableJob)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      locumAvailableJobCreatedHandler (data) {
        const {
          locumAvailableJob
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.locumAvailableJobs.length < this.limit) {
            this.locumAvailableJobs.push(locumAvailableJob)
          }
        }
      },

      locumAvailableJobUpdatedHandler (data) {
        const {
          locumAvailableJob
        } = data

        const index = this.locumAvailableJobs.findIndex(({ id }) => id === locumAvailableJob.id)

        if (index > -1) {
          this.locumAvailableJobs.splice(index, 1, locumAvailableJob)
        }
      },

      locumAvailableJobDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.locumAvailableJobs.findIndex((locumAvailableJob) => locumAvailableJob.id === id)

          if (index > -1) {
            this.locumAvailableJobs.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredJobs(1)
            }
          }
        }
      },
    },

  }
</script>
