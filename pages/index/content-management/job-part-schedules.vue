<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
    <div class="text-xl md:text-2xl text-white">
      Job Part Schedules
    </div>

    <div class="px-2 flex flex-col md:flex-row justify-between md:items-center">
      <div v-if="false" class="flex py-2">
        <div class="relative">
          <input
            v-model="search"
            style="width: 280px;"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search"
            @keyup.enter="searchSubmit"
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

      <div class="flex flex-col w-full justify-end">
        <div
          class="md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end md:py-2 py-0"
        >
          <label class="text-sm text-white md:pr-2">Has Late</label>
          <select
            id="grid-state"
            v-model="filterHasLate"
            class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option :value="null">
              All
            </option>
            <option :value="true">
              Yes
            </option>
            <option :value="false">
              No
            </option>
          </select>
        </div>
      </div>
    </div>

    <ContentManagementTable
      :limit="limit"
      :items="jobPartSchedules"
      :getItemKey="item => item.id"
      :getItemLink="item => `/content-management/job-part-schedules/${item.id}`"
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
      v-if="$route.name !== 'index-content-management-job-part-schedules'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/content-management/job-part-schedules"
    />
  
    <nuxt-child />
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
        jobPartSchedules: [],
        orderBy: [],
        limit: 10,
        activePage: 1,
        search: '',
        filterHasLate: null,
      }
    },

    computed: {
      itemCountInfo () {
        const firstItem = Math.min(this.limit * this.activePage - this.limit + 1, this.count)
        const lastItem = Math.min(this.limit * this.activePage - this.limit + this.jobPartSchedules.length, this.count)
        

        return `Showing ${firstItem} to ${lastItem} of ${this.count} items`
      },

      offset () {
        return Math.max(this.activePage * this.limit - this.limit + this.jobPartSchedules.length, 0)
      },

      columnDetails () {
        return [
          {
            title: 'ID',
            key: 'id',
            sort_key: 'id',
            column: item => item.id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Date',
            key: 'date',
            sort_key: 'date',
            column: item => item.date,
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Time Start',
            key: 'time_start',
            sort_key: 'time_start',
            column: item => item.time_start,
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Time End',
            key: 'time_end',
            sort_key: 'time_end',
            column: item => item.time_end,
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Original Hours In Minutes',
            key: 'original_hours_in_minutes',
            sort_key: 'original_hours_in_minutes',
            column: item => item.original_hours_in_minutes,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Rate',
            key: 'rate',
            sort_key: 'rate',
            column: item => item.rate,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Rate Type',
            key: 'locum_detail_rate_type_name',
            sort_key: 'locum_detail_rate_type_name',
            column: item => item.locum_detail_rate_type_name,
            justify: 'start',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Shift',
            key: 'shift_name',
            sort_key: 'shift_name',
            column: item => item.shift_name,
            justify: 'start',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Final Time Start',
            key: 'final_time_start',
            sort_key: 'final_time_start',
            column: item => item.final_time_start,
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Final Time End',
            key: 'final_time_end',
            sort_key: 'final_time_end',
            column: item => item.final_time_end,
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Final Hours In Minutes',
            key: 'final_hours_in_minutes',
            sort_key: 'final_hours_in_minutes',
            column: item => item.final_hours_in_minutes,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Late Hours In Minutes',
            key: 'late_hours_in_minutes',
            sort_key: 'late_hours_in_minutes',
            column: item => item.late_hours_in_minutes,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Has Late',
            key: 'has_late',
            sort_key: 'has_late',
            column: item => item.has_late ? 'Yes' : 'No',
            justify: 'center',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Late Hours Reasons',
            key: 'late_hours_reason',
            sort_key: 'late_hours_reason',
            column: item => item.late_hours_reason,
            justify: 'start',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Absent Reason',
            key: 'absent_reason',
            sort_key: 'absent_reason',
            column: item => item.absent_reason,
            justify: 'start',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Job Part ID',
            key: 'job_part_id',
            sort_key: 'job_part_id',
            column: item => item.job_part_id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Job Part Number',
            key: 'job_part_number',
            sort_key: 'job_part_number',
            column: item => item.job_part_number,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Part Status',
            key: 'job_part_status',
            sort_key: 'job_part_status',
            column: item => item.job_part_status,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job ID',
            key: 'job_id',
            sort_key: 'job_id',
            column: item => item.job_id,
            justify: 'end',
            flexGrow: 0,
            flexShrink: 0,
          },
          {
            title: 'Job Number',
            key: 'job_number',
            sort_key: 'job_number',
            column: item => item.job_number,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Status',
            key: 'job_status',
            sort_key: 'job_status',
            column: item => item.job_status,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Apoointed Locum ID',
            key: 'appointed_to_locum_user_id',
            sort_key: 'appointed_to_locum_user_id',
            column: item => item.appointed_to_locum_user_id,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Apoointed Locum',
            key: 'appointed_to_locum_user_name',
            sort_key: 'appointed_to_locum_user_name',
            column: item => item.appointed_to_locum_user_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Title',
            key: 'job_title',
            sort_key: 'job_title',
            column: item => item.job_title,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Practice Name',
            key: 'job_practice_name',
            sort_key: 'job_practice_name',
            column: item => item.job_practice_name,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Practice Code',
            key: 'job_practice_code',
            sort_key: 'job_practice_code',
            column: item => item.job_practice_code,
            justify: 'start',
            flexGrow: 1,
            flexShrink: 0,
          },
          {
            title: 'Job Type',
            key: 'job_type',
            sort_key: 'job_type',
            column: item => item.job_type,
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
        if (this.activePage === 1) {
          this.getJobParts()
        } else {
          this.activePage = 1
        }
      },

      limit () {
        if (this.activePage === 1) {
          this.getJobParts()
        } else {
          this.activePage = 1
        }
      },

      activePage () {
        this.getJobParts()
      },

      filterHasLate () {
        if (this.activePage === 1) {
          this.getJobParts()
        } else {
          this.activePage = 1
        }
      },
    },

    mounted () {
      this.search = ''
      this.filterHasLate = null
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
        this.jobPartSchedules = []

        const params = {
          has_late: this.filterHasLate,
        }

        const search = this.search

        if (search) {
          params.search = search
        }

        Promise.all([
          this.$axios.get('/api/v1/admin/job-part-schedules/count', {
            params: {
              ...params,
            }
          }).then((responses) => {
            return responses.data.data.count
          }),
          this.$axios.get('/api/v1/admin/job-part-schedules', {
            params: {
              ...params,
              order_by: this.orderBy,
              limit: this.limit,
              offset: this.offset,
            },
          }).then((responses) => {
            return responses.data.data.job_part_schedules
          }),
          new Promise((resolve) => setTimeout(resolve, 500))
        ]).then((results) => {
          if (!search || search === this.search) {
            const [
              count,
              jobPartSchedules,
            ] = results

            this.count = count
            this.jobPartSchedules = jobPartSchedules
          }
        }).catch((err) => {
          console.log('err', err)
          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },

      loadMoredJobParts (limit) {
        const params = {
          has_late: this.filterHasLate,
        }

        const search = this.search

        if (search) {
          params.search = search
        }

        this.$axios.get('/api/v1/admin/job-part-schedules', {
          params: {
            ...params,
            order_by: this.orderBy,
            limit,
            offset: this.offset,
          },
        }).then((responses) => {
          responses.data.data.job_part_schedules.forEach((jobPartSchedule) => {
            this.jobPartSchedules.push(jobPartSchedule)
          })
        }).catch((err) => {
          console.log('err', err)
        })
      },
    },

  }
</script>
