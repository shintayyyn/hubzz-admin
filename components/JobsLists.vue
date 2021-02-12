<template>
  <div class="overflow-x-auto xl:overflow-hidden">
    <AppButton
      :label="'Filter'"
      :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
      @click="filterModal = !filterModal"
    />
    <div class="flex" :class="filterModal ? 'flex' : 'hidden'">
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          v-model="job_number"
          class=""
          :type="'text'"
          :name="'job_number'"
          :label="'Job number'"
        />
      </div>
      <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
        <AppInput
          v-model="job_title"
          class=""
          :type="'text'"
          :name="'job_title'"
          :label="'Job title'"
        />
      </div>
    </div>
    <div class="flex" :class="filterModal ? 'flex' : 'hidden'">
      <AppButton
        :label="'Clear'"
        class="mx-1"
        :background="'transparent'"
        :class="'border  hover:bg-gray-700 hover:border-none'"
        @click="clearFilters"
      />
      <AppButton
        :label="'Search'"
        class="mx-1"
        :background="'transparent'"
        :class="'border  hover:bg-gray-700 hover:border-none'"
        @click="filterJobParts"
      />
    </div>
    <div v-if="items.length === 0 && loading === false">
      <div 
        v-if="isFiltered"
        class="mt-10  w-full text-center"
        style="font-family: Nunito"
      >
        Job Not Found.
      </div>
      <div
        v-else-if="!isFiltered"
        class="mt-10  w-full text-center"
        style="font-family: Nunito"
      >
        {{ `No ${status[0]} ${jobDenom} found.` }}
      </div>
    </div>
    <div v-else>
      <AppTableNew
        :total="total"
        :items="items"
        :loading="loading"
        :currentPage="currentPage"
        :perPage="limit"
        :columns="columns"
        :routerLink="routerLink"
        :orderBy="orderBy"
        @pagechanged="pagechanged"
        @sorted="(_orderBy) => orderBy = _orderBy"
      >
        <template v-slot:invoice_status_slot="slotProps">
          <div
            class="py-2 px-4 rounded-lg whitespace-no-wrap text-center mx-2"
            :class="invoiceStatusStyle(slotProps.item.invoice_status)"
          >
            {{ slotProps.item.invoice_status }}
          </div>
        </template>
      </AppTableNew>
    </div>
  </div>
</template>

<script>
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  import AppTableNew from '@/components/Base/AppTableNew'
  export default {
    components: {
      AppInput,
      AppButton,
      AppTableNew,
    },

    props: {
      locumUser: {
        type: Object,
        default: () => null,
      },
      practice: {
        type: Object,
        default: () => null,
      },
      status: {
        type: Array,
        required: true,
      },
      jobDenom: {
        type: String,
        default: 'Jobs',
        required:true,
      },
    },

    data () {
      return {
        loading: false,
        job_number: null,
        job_title: null,
        filterModal: false,
        isFiltered: false,
        totalPages: 0,
        currentPage: 1,
        limit: 15,
        modal: false,
        orderBy: [
          'created_at_in_gb_formatted:desc',
        ],
        defaultColumns: [
          {
						name: this.jobDenom === 'Jobs' ? 'Job Number' : 'Job Part Number',
						dataIndex: this.jobDenom === 'Jobs' ? 'job_number' : 'job_part_number',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '140px',
					},
					{
						name: 'Practice',
						dataIndex: 'practice_name',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
					},
					{
						name: 'Title',
						dataIndex: 'title',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
					},
					{
						name: 'From',
						dataIndex: 'datetime_start_in_gb_formatted',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '550px',
					},
					{
						name: 'To',
						dataIndex: 'datetime_end_in_gb_formatted',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
					},
        ]
      }
    },

    computed: {
      total () {
        const status = this.status[0]
        let count = 0
        switch (status) {
          case 'Allocated':
            count =  this.$store.state.jobs.locum_allocated_jobs_count
            break
          case 'Unsuccessful':
            count =  this.$store.state.jobs.locum_allocated_jobs_count
            break
          case 'Available':
            count =  this.$store.state.jobs.locum_available_jobs_count
            break
          case 'Pending':
            count = this.$store.state.jobs.practice_pending_sessions_count
            break
          case 'Unfilled':
            count = this.$store.state.jobs.practice_unfilled_sessions_count
            break
          case 'Live':
            count = this.$store.state.jobs.practice_available_sessions_count
            break
          case 'Applied':
            if (this.locumUser) {
              count =  this.$store.state.jobs.locum_applied_jobs_count
            } else if (this.practice) {
              count =  this.$store.state.jobs.practice_applied_sessions
            }
            break
          case 'Ongoing':
            if (this.locumUser) {
              count =  this.$store.state.jobs.locum_ongoing_jobs_count
            } else if (this.practice) {
              count =  this.$store.state.jobs.practice_ongoing_sessions_count
            }
            break
          case 'Completed':
            if (this.locumUser) {
              count =  this.$store.state.jobs.locum_completed_jobs_count
            } else if (this.practice) {
              count =  this.$store.state.jobs.practice_completed_sessions_count
            }
            break
          case 'Cancelled':
            if (this.locumUser) {
              count =  this.$store.state.jobs.locum_cancelled_jobs_count
            } else if (this.practice) {
              count =  this.$store.state.jobs.practice_cancelled_sessions_count
            }
            break
          case 'Approved':
            if (this.locumUser) {
              count =  this.$store.state.jobs.locum_approved_jobs_count
            } else if (this.practice) {
              count =  this.$store.state.jobs.practice_approved_sessions_count
            }
            break
          case 'Withdrawn':
            if (this.locumUser) {
              count =  this.$store.state.jobs.practice_withdrawn_sessions_count
            } else if (this.practice) {
              count =  this.$store.state.jobs.locum_withdrawn_jobs_count
            }
            break
          default:
            count = 0
        }
        return count
      },

      items () {
        const status = this.status[0]
        let records = []
        switch (status) {
          case 'Allocated':
            records = this.$store.state.jobs.locum_allocated_jobs
            break
          case 'Unsuccessful':
            records = this.$store.state.jobs.locum_allocated_jobs
            break
          case 'Pending':
            records = this.$store.state.jobs.locum_unsuccessful_jobs
            break
          case 'Available':
            records = this.$store.state.jobs.locum_available_jobs
            break
          case 'Unfilled':
            records = this.$store.state.jobs.practice_unfilled_sessions
            break
          case 'Live':
            records = this.$store.state.jobs.practice_available_sessions
            break
          case 'Applied':
            if (this.locumUser) {
              records = this.$store.state.jobs.locum_applied_jobs
            } else if (this.practice) {
              records = this.$store.state.jobs.practice_applied_sessions
            }
            break
          case 'Ongoing':
            if (this.locumUser) {
              records = this.$store.state.jobs.locum_ongoing_jobs
            } else if (this.practice) {
              records = this.$store.state.jobs.practice_ongoing_sessions
            }
            break
          case 'Completed':
            if (this.locumUser) {
              records = this.$store.state.jobs.locum_completed_jobs
            } else if (this.practice) {
              records = this.$store.state.jobs.practice_completed_sessions
            }
            break
          case 'Cancelled':
            if (this.locumUser) {
              records = this.$store.state.jobs.locum_cancelled_jobs
            } else if (this.practice) {
              records = this.$store.state.jobs.practice_cancelled_sessions
            }
            break
          case 'Approved':
            if (this.locumUser) {
              records = this.$store.state.jobs.locum_approved_jobs
            } else if (this.practice) {
              records = this.$store.state.jobs.practice_approved_sessions
            }
            break
          case 'Withdrawn':
            if (this.locumUser) {
              records = this.$store.state.jobs.practice_withdrawn_sessions
            } else if (this.practice) {
              records = this.$store.state.jobs.locum_withdrawn_jobs
            }
            break
          default:
            records = []
        }
        return records
      },
      
      columns () {
        const status = this.status[0]
        switch (status) {
          case 'Allocated':
          case 'Ongoing':
            return [
              ...this.defaultColumns,
              {
                name: 'Allocated At',
                dataIndex: 'appointed_at_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
            ]
          case 'Available':
          case 'Applied':
          case 'Unsuccessful':
            return [
              ...this.defaultColumns,
              {
                name: 'Created',
                dataIndex: 'date_created_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
            ]
          case 'Cancelled':
            return [
              ...this.defaultColumns,
              {
                name: 'Created',
                dataIndex: 'date_created_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
              {
                name: 'Cancelled At',
                dataIndex: 'cancelled_at_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
            ]
          case 'Withdrawn':
            return [
              ...this.defaultColumns,
              {
                name: 'Created',
                dataIndex: 'date_created_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
              {
                name: 'Withdrawn At',
                dataIndex: 'declined_at_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
            ]
          case 'Completed':
            return [
              ...this.defaultColumns,
              {
                name: 'Created',
                dataIndex: 'date_created_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
              {
                name: 'Completed At',
                dataIndex: 'completed_at_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
              {
                name: 'Locum Invoice Status',
                dataIndex: 'invoice_status',
                class: 'md:text-center',
                sortable: true,
                slot: true,
                slotName: 'invoice_status_slot',
                flex: '1 0 0',
                minWidth: '150px',
                maxWidth: '170px',
              },
            ]
          case 'Approved':
            return[
              ...this.defaultColumns,
              {
                name: 'Created',
                dataIndex: 'date_created_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
              {
                name: 'Completed At',
                dataIndex: 'completed_at_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
              {
                name: 'Approved At',
                dataIndex: 'approved_at_in_gb_formatted',
                class: 'md:text-center',
                sortable: true,
                flex: '1 0 0',
                minWidth: '100px',
                maxWidth: '170px',
              },
            ]

          default:
            return [...this.defaultColumns]
        }
        
      },

      offset () {
        return this.limit * (this.currentPage - 1)
      },

      routerLink () {
        let route = null
        if (this.locumUser) {
          route = `/locums/${this.$route.params.id}/locum-jobs/locum-${this.status[0].replace(/^(.)|\s+(.)/g, c => c.toLowerCase())}-jobs`
        } else if (this.practice) {
          route = `/practices/${this.$route.params.id}/practice-sessions/practice-${this.status[0].replace(/^(.)|\s+(.)/g, c => c.toLowerCase())}-sessions`
        }
        return route
      },
    },

    watch: {
      $route (to) {
        this.currentPage = parseInt(to.query.page)
        this.getJobs()
      },
      orderBy () {
        this.currentPage = 1
        this.getJobs()
      },
    },

    beforeDestroy () {
      let query = Object.assign({}, this.$route.query)
      delete query.page
      this.$router.push({ query })
    },

    async created () {
      this.getJobs()
    },

    methods: {

      async filterJobParts () {
        this.currentPage = 1
        this.isFiltered = true
        await this.getJobs()
      },

      clearFilters () {
        this.job_number = null
        this.job_title = null
        this.getJobs()
      },

      getJobs () {
        this.loading = true
        const filters = {}
        const promises = []
        if (this.locumUser) {
          filters.viewing_locum_user_id = this.$route.params.id
          filters.locum_status = this.status
          filters.type = "Platform"
          
        }
        if (this.practice) {
          filters.practice_id = this.$route.name.includes("practice-surgeries") ? null : this.$route.params.id,
          filters.practice_surgery_id = this.$route.name.includes("practice-surgeries") ? this.$route.params.practiceSurgeryId : null,
          filters.status = this.status
        }
        filters.title_includes = this.job_title
        if (this.jobDenom === 'Jobs') {
          filters.job_number_includes = this.job_number
        } else {
          filters.job_part_number_includes = this.job_number
        }
        if (this.jobDenom === 'Jobs') {
          promises.push(
            this.$axios.$get(`/api/v1/admin/jobs/count`, {
              params: {
                ...filters,
              }
            }).then(response => response.data.count),
            this.$axios.$get(`/api/v1/admin/jobs`, {
              params: {
                ...filters,
                limit: this.perPage,
                offset: this.offset,
                order_by: this.orderBy,
              }
            }).then(response => response.data.jobs)
          )
        } else if (this.jobDenom === 'Job Parts') {
          promises.push(
            this.$axios.$get(`/api/v1/admin/job-parts/count`, {
              params: {
                ...filters,
              }
            }).then(response => response.data.count),
            this.$axios.$get(`/api/v1/admin/job-parts`, {
              params: {
                ...filters,
                limit: this.perPage,
                offset: this.offset,
                order_by: this.orderBy,
              }
            }).then(response => response.data.job_parts)
          )
        }

        Promise.all([
          ...promises,
        ]).then((responses) => {
          const [
            count,
            jobs,
          ] = responses

          const status = this.status[0]
          switch(status) {
              case 'Allocated':
                this.$store.commit("jobs/SET_LOCUM_ALLOCATED_JOBS_COUNT", count)
                this.$store.commit("jobs/SET_LOCUM_ALLOCATED_JOBS", jobs)
                break
              case 'Unsuccessful':
                this.$store.commit("jobs/SET_LOCUM_UNSUCCESSFUL_JOBS_COUNT", count)
                this.$store.commit("jobs/SET_LOCUM_UNSUCCESSFUL_JOBS", jobs)
                break
              case 'Pending':
                this.$store.commit("jobs/SET_PRACTICE_PENDING_SESSIONS_COUNT", count)
                this.$store.commit("jobs/SET_PRACTICE_PENDING_SESSIONS", jobs)
                break
              case 'Unfilled':
                this.$store.commit("jobs/SET_PRACTICE_UNFILLED_SESSIONS_COUNT", count)
                this.$store.commit("jobs/SET_PRACTICE_UNFILLED_SESSIONS", jobs)
                break
              case 'Available':
                this.$store.commit("jobs/SET_LOCUM_AVAILABLE_JOBS_COUNT", count)
                this.$store.commit("jobs/SET_LOCUM_AVAILABLE_JOBS", jobs)
                break
              case 'Ongoing':
                if (this.locumUser) {
                  this.$store.commit("jobs/SET_LOCUM_ONGOING_JOBS_COUNT", count)
                  this.$store.commit("jobs/SET_LOCUM_ONGOING_JOBS", jobs)
                } else if (this.practice) {
                  this.$store.commit("jobs/SET_PRACTICE_ONGOING_SESSIONS_COUNT", count)
                  this.$store.commit("jobs/SET_PRACTICE_ONGOING_SESSIONS", jobs)
                  
                }
                break
              case 'Applied':
                if (this.locumUser) {
                  this.$store.commit("jobs/SET_LOCUM_APPLIED_JOBS_COUNT", count)
                  this.$store.commit("jobs/SET_LOCUM_APPLIED_JOBS", jobs)
                } else if (this.practice) {
                  this.$store.commit("jobs/SET_PRACTICE_APPLIED_SESSIONS_COUNT", count)
                  this.$store.commit("jobs/SET_PRACTICE_APPLIED_SESSIONS", jobs)
                }
                break
              case 'Cancelled':
                if (this.locumUser) {
                  this.$store.commit("jobs/SET_LOCUM_CANCELLED_JOBS_COUNT", count)
                  this.$store.commit("jobs/SET_LOCUM_CANCELLED_JOBS", jobs)
                } else if (this.practice) {
                  this.$store.commit("jobs/SET_PRACTICE_CANCELLED_SESSIONS_COUNT", count)
                  this.$store.commit("jobs/SET_PRACTICE_CANCELLED_SESSIONS", jobs)
                }
                break
              case 'Withdrawn':
                if (this.locumUser) {
                  this.$store.commit("jobs/SET_LOCUM_WITHDRAWN_JOBS_COUNT", count)
                  this.$store.commit("jobs/SET_LOCUM_WITHDRAWN_JOBS", jobs)
                } else if (this.practice) {
                  this.$store.commit("jobs/SET_PRACTICE_WITHDRAWN_SESSIONS_COUNT", count)
                  this.$store.commit("jobs/SET_PRACTICE_WITHDRAWN_SESSIONS", jobs)
                }
                break
              case 'Completed':
                if (this.locumUser) {
                  this.$store.commit("jobs/SET_LOCUM_COMPLETED_JOBS_COUNT", count)
                  this.$store.commit("jobs/SET_LOCUM_COMPLETED_JOBS", jobs)
                } else if (this.practice) {
                  this.$store.commit("jobs/SET_PRACTICE_COMPLETED_SESSIONS_COUNT", count)
                  this.$store.commit("jobs/SET_PRACTICE_COMPLETED_SESSIONS", jobs)
                }
                break
              case 'Approved':
                if (this.locumUser) {
                  this.$store.commit("jobs/SET_LOCUM_APPROVED_JOBS_COUNT", count)
                  this.$store.commit("jobs/SET_LOCUM_APPROVED_JOBS", jobs)
                } else if (this.practice) {
                  this.$store.commit("jobs/SET_PRACTICE_APPROVED_SESSIONS_COUNT", count)
                  this.$store.commit("jobs/SET_PRACTICE_APPROVED_SESSIONS", jobs)
                }
                break
              default:
                break
            }
          this.loading = false
        })
      },
      invoiceStatusStyle (status) {
        switch (status) {
          case "To Be Invoiced":
            return "bg-yellow-500 text-black"
          case "Disputed":
            return "bg-red-500 text-white"
          case "Invoiced":
            return "bg-green-500 text-white opacity-75"
        }
      },
      async pagechanged (e) {
        const query = {
          ...this.$route.query,
          page: e || 1
        }
        await this.$router.push({ query })
      },
    },
  }
</script>