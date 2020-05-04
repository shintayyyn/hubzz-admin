<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Job Parts
    </div>

    <div class="flex flex-col md:flex-row justify-between md:items-center">
      <div class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search jobPart number, title"
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
      :items="jobParts"
      :getItemKey="(item) => item.id"
      :getItemLink="(item) => `/content-management/job-parts/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-job-parts'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/job-parts"
    />
  
    <nuxt-child
      @jobPartCreated="jobPartCreatedHandler"
      @jobPartUpdated="jobPartUpdatedHandler"
      @jobPartDeleted="jobPartDeletedHandler"
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
        jobParts: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.jobParts.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.jobParts.length, 0)
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
            title: 'ID',
            key: 'id',
            sort_key: 'id',
            column: (item) => item.id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Job Type',
            key: 'job_type',
            sort_key: 'job_type',
            column: (item) => item.job ? item.job.type : '',
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Part Number',
            key: 'job_part_number',
            sort_key: 'job_part_number',
            column: (item) => item.job_part_number,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Title',
            key: 'job_title',
            sort_key: 'job_title',
            column: (item) => item.job_title,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Practice Name',
            key: 'practice_name',
            sort_key: 'practice_name',
            column: (item) => item.practice_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Practice Code',
            key: 'practice_code',
            sort_key: 'practice_code',
            column: (item) => item.practice_code,
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
        ]
      },

      pages () {
        return Math.max(Math.ceil(this.count / this.limit), 1)
      },
    },

    watch: {
      orderBy () {
        this.activePage = 1
        this.getJobParts()
      },

      limit () {
        this.activePage = 1
        this.getJobParts()
      },

      activePage () {
        this.getJobParts()
      },
    },

    mounted () {
      this.search = ''
      this.getJobParts()
    },
    
    methods: {
      searchSubmit: debounce(function () {
        this.activePage = 1
        this.getJobParts()
      }, 500),

      getJobParts () {
        this.loading = true
        // this.count = 0
        this.jobParts = []

        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/job-parts/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/job-parts', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.job_parts
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              jobParts,
            ] = results

            this.count = count
            this.jobParts = jobParts
          }
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      loadMoredJobParts (limit) {
        const params = {}

        const search = this.search

        if (search) {
          params.search = search
        }

        this.$axios.get('/api/v1/admin/job-parts', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.job_parts.forEach((jobPart) => {
            this.jobParts.push(jobPart)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },

      jobPartCreatedHandler (data) {
        const {
          jobPart
        } = data

        if (this.search === '') {
          this.count++

          if (this.activePage === this.pages && this.jobParts.length < this.limit) {
            this.jobParts.push(jobPart)
          }
        }
      },

      jobPartUpdatedHandler (data) {
        const {
          jobPart
        } = data

        const index = this.jobParts.findIndex(({ id }) => id === jobPart.id)

        if (index > -1) {
          this.jobParts.splice(index, 1, jobPart)
        }
      },

      jobPartDeletedHandler (data) {
        const {
          id,
        } = data

        this.count--

        if (this.activePage > this.pages) {
          this.activePage = this.pages
        } else {
          const index = this.jobParts.findIndex((jobPart) => jobPart.id === id)

          if (index > -1) {
            this.jobParts.splice(index, 1)

            if (this.offset < this.count) {
              this.loadMoredJobParts(1)
            }
          }
        }
      },
    },

  }
</script>
