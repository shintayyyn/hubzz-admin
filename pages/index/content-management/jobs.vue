<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Jobs
    </div>

    <div class="flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search job number, title"
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
      :items="jobs"
      :getItemKey="(item) => item.id"
      :getItemLink="(item) => `/content-management/jobs/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-jobs'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/jobs"
    />
  
    <nuxt-child
      @jobCreated="jobCreatedHandler"
      @jobUpdated="jobUpdatedHandler"
      @jobDeleted="jobDeletedHandler"
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
        jobs: [],
        orderBy: [
          'created_at:desc',
        ],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.jobs.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.jobs.length, 0)
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
            title: 'Job Number',
            key: 'job_number',
            sort_key: 'job_number',
            column: (item) => item.job_number,
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
            title: 'Status',
            key: 'status',
            sort_key: 'status',
            column: (item) => item.status,
            justify: 'start',
            flexGrow: 1,
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
            title: 'Old Job Number',
            key: 'old_job_job_number',
            sort_key: 'old_job_job_number',
            column: (item) => item.old_job ? item.old_job.job_number : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Updated',
            key: 'updated',
            sort_key: 'updated',
            column: (item) => item.updated ? 'Yes' : 'No',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'New Job Number',
            key: 'new_job_job_number',
            sort_key: 'new_job_job_number',
            column: (item) => item.new_job ? item.new_job.job_number : '',
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
        this.jobs = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/job-payloads/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/job-payloads', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.jobs
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              jobs,
            ] = results

            this.count = count
            this.jobs = jobs
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

        this.$axios.get('/api/v1/admin/job-payloads', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.jobs.forEach((job) => {
            this.jobs.push(job)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      jobCreatedHandler (data) {
        const {
          job
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.jobs.length < this.limit) {
            this.jobs.push(job)
          }
        }
      },

      jobUpdatedHandler (data) {
        const {
          job
        } = data

        const index = this.jobs.findIndex(({ id }) => id === job.id)

        if (index > -1) {
          this.jobs.splice(index, 1, job)
        }
      },

      jobDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.jobs.findIndex((job) => job.id === id)

          if (index > -1) {
            this.jobs.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredJobs(1)
            }
          }
        }
      },
    },

  }
</script>
