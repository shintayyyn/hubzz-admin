<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Job Locum Users
    </div>

    <ContentManagementTable
      :limit="limit"
      :items="jobLocumUsers"
      :getItemKey="(item) => `${item.job_id}-${item.locum_user_id}`"
      :getItemLink="(item) => true ? null : `/content-management/job-locum-users/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-job-locum-users'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/job-locum-users"
    />
  
    <nuxt-child
      @jobLocumUserCreated="jobLocumUserCreatedHandler"
      @jobLocumUserUpdated="jobLocumUserUpdatedHandler"
      @jobLocumUserDeleted="jobLocumUserDeletedHandler"
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
        jobLocumUsers: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.jobLocumUsers.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.jobLocumUsers.length, 0)
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
            title: 'Job Number',
            key: 'job_job_number',
            sort_key: 'job_job_number',
            column: (item) => item.job_job_number,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Original',
            key: 'original',
            sort_key: 'original',
            column: (item) => item.original ? 'Yes' : 'No',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Old Job ID',
            key: 'old_job_id',
            sort_key: 'old_job_id',
            column: (item) => item.old_job_id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Old Job Number',
            key: 'old_job_job_number',
            sort_key: 'old_job_job_number',
            column: (item) => item.old_job_job_number,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          // {
          //   title: 'New Job ID',
          //   key: 'new_job_id',
          //   sort_key: 'new_job_id',
          //   column: (item) => item.new_job_id,
          //   justify: 'end',
          //   flexGrow: 0,
          //   flexShrink: 0,
          // },
          // {
          //   title: 'New Job Number',
          //   key: 'new_job_job_number',
          //   sort_key: 'new_job_job_number',
          //   column: (item) => item.new_job_job_number,
          //   justify: 'end',
          //   flexGrow: 0,
          //   flexShrink: 0,
          // },
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
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Locum Matched',
            key: 'locum_user_matched',
            sort_key: 'locum_user_matched',
            column: (item) => item.locum_user_matched ? 'Yes' : 'No',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Allocated',
            key: 'allocated',
            sort_key: 'allocated',
            column: (item) => item.allocated ? 'Yes' : 'No',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Locum Allocated',
            key: 'locum_allocated',
            sort_key: 'locum_allocated',
            column: (item) => item.locum_allocated ? 'Yes' : 'No',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Applied At',
            key: 'applied_at',
            sort_key: 'applied_at',
            column: (item) => item.applied_at ? this.$moment(item.applied_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Applied Update Accepted Until',
            key: 'applied_update_accepted_until',
            sort_key: 'applied_update_accepted_until',
            column: (item) => item.applied_update_accepted_until ? this.$moment(item.applied_update_accepted_until, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Applied Update Accepted',
            key: 'applied_update_accepted',
            sort_key: 'applied_update_accepted',
            column: (item) => item.applied_update_accepted === true
              ? 'Yes'
              : item.applied_update_accepted === false
                ? 'No'
                : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Applied Update Accepted At',
            key: 'applied_update_accepted_at',
            sort_key: 'applied_update_accepted_at',
            column: (item) => item.applied_update_accepted_at ? this.$moment(item.applied_update_accepted_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm') : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Notify Not Accept Applied Updated Jobs',
            key: 'notify_not_accept_applied_updated_jobs',
            sort_key: 'notify_not_accept_applied_updated_jobs',
            column: (item) => item.notify_not_accept_applied_updated_jobs === true
              ? 'Yes'
              : item.notify_not_accept_applied_updated_jobs === false
                ? 'No'
                : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Appointed Locum ID',
            key: 'appointed_to_locum_user_id',
            sort_key: 'appointed_to_locum_user_id',
            column: (item) => item.appointed_to_locum_user_id,
            justify: 'end',
            flexGrow: 0,
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
        this.jobLocumUsers = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/job-locum-users/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/job-locum-users', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.job_locum_users
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              jobLocumUsers,
            ] = results

            this.count = count
            this.jobLocumUsers = jobLocumUsers
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

        this.$axios.get('/api/v1/admin/job-locum-users', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.job_locum_users.forEach((jobLocumUser) => {
            this.jobLocumUsers.push(jobLocumUser)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      jobLocumUserCreatedHandler (data) {
        const {
          jobLocumUser
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.jobLocumUsers.length < this.limit) {
            this.jobLocumUsers.push(jobLocumUser)
          }
        }
      },

      jobLocumUserUpdatedHandler (data) {
        const {
          jobLocumUser
        } = data

        const index = this.jobLocumUsers.findIndex(({ id }) => id === jobLocumUser.id)

        if (index > -1) {
          this.jobLocumUsers.splice(index, 1, jobLocumUser)
        }
      },

      jobLocumUserDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.jobLocumUsers.findIndex((jobLocumUser) => jobLocumUser.id === id)

          if (index > -1) {
            this.jobLocumUsers.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredJobs(1)
            }
          }
        }
      },
    },

  }
</script>
