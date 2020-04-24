<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Job Applicant Locum Users
    </div>

    <ContentManagementTable
      :limit="limit"
      :items="jobApplicantLocumUsers"
      :getItemKey="(item) => `${item.id}-${item.locum_user_id}`"
      :getItemLink="(item) => true ? null : `/content-management/job-applicant-locum-users/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-job-applicant-locum-users'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/job-applicant-locum-users"
    />
  
    <nuxt-child
      @jobApplicantLocumUserCreated="jobApplicantLocumUserCreatedHandler"
      @jobApplicantLocumUserUpdated="jobApplicantLocumUserUpdatedHandler"
      @jobApplicantLocumUserDeleted="jobApplicantLocumUserDeletedHandler"
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
        jobApplicantLocumUsers: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.jobApplicantLocumUsers.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.jobApplicantLocumUsers.length, 0)
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
            title: 'Applicant Locum ID',
            key: 'applicant_locum_user_id',
            sort_key: 'applicant_locum_user_id',
            column: (item) => item.applicant_locum_user_id,
            justify: 'end',
            flexGrow: 0,
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
            column: (item) => item.notify_not_accept_applied_updated_jobs ? 'Yes' : 'No',
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
        this.jobApplicantLocumUsers = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/job-applicant-locum-users/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/job-applicant-locum-users', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.job_applicant_locum_users
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              jobApplicantLocumUsers,
            ] = results

            this.count = count
            this.jobApplicantLocumUsers = jobApplicantLocumUsers
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

        this.$axios.get('/api/v1/admin/job-applicant-locum-users', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.job_applicant_locum_users.forEach((jobApplicantLocumUser) => {
            this.jobApplicantLocumUsers.push(jobApplicantLocumUser)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      jobApplicantLocumUserCreatedHandler (data) {
        const {
          jobApplicantLocumUser
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.jobApplicantLocumUsers.length < this.limit) {
            this.jobApplicantLocumUsers.push(jobApplicantLocumUser)
          }
        }
      },

      jobApplicantLocumUserUpdatedHandler (data) {
        const {
          jobApplicantLocumUser
        } = data

        const index = this.jobApplicantLocumUsers.findIndex(({ id }) => id === jobApplicantLocumUser.id)

        if (index > -1) {
          this.jobApplicantLocumUsers.splice(index, 1, jobApplicantLocumUser)
        }
      },

      jobApplicantLocumUserDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.jobApplicantLocumUsers.findIndex((jobApplicantLocumUser) => jobApplicantLocumUser.id === id)

          if (index > -1) {
            this.jobApplicantLocumUsers.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredJobs(1)
            }
          }
        }
      },
    },

  }
</script>
