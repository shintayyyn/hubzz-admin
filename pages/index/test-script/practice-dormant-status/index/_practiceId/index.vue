<template>
  <div class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-9/12 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg" style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link :to="{ name: 'index-test-script-practice-dormant-status-index' }" class="text-white hover:text-sunglow p-1" draggable="false">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>
      
      <AppLoading :loading="loading" :message="'Loading'" />

      <div class="py-4">
        <div class="mx-2 md:mx-4 text-white">
          <div class="text-lg font-bold">
            ID: {{ $route.params.practiceId }}
          </div>
          <div class="text-lg font-bold">
            Name: {{ practice ? practice.name : '' }}
          </div>
          <div class="text-lg font-bold">
            Created: {{ practice ? practice.created_at_in_gb_formatted : '' }}
          </div>
          <div class="text-lg font-bold">
            Last job date created: {{ practice ? practice.last_job_posted_date_in_gb_formatted : '' }}
          </div>
          <div class="text-lg font-bold">
            Status: 
            <div
              class="inline-block px-4 py-1 rounded-full text-center w-32 mx-1"
              :class="practice && practice.status === 'Active' ? 'bg-green-500' : 'bg-gray-500 text-gray-700'"
            >
              {{ practice ? practice.status : '' }}
            </div>
          </div>
        </div>

        <div class="py-4">
          <div class="mx-2 md:mx-4 text-white flex items-center">
            <div class="text-lg font-bold">
              Override created: 
            </div>
            <div class="px-2">
              <AppDate v-model="overrideCreated" :isBefore="true" />
            </div>
          </div>
        </div>

        <div class="mt-8 mx-2 md:mx-4 text-white">
          <div class="text-lg font-bold">
            Practice Jobs
          </div>
        </div>

        <AppTable
          v-if="practiceJobsCount !== 0"
          :total="practiceJobsCount"
          :items="practiceJobs"
          :currentPage="practiceJobsCurrentPage"
          :perPage="practiceJobsLimit"
          :columns="practiceJobsColumns"
          :loading="practiceJobsLoading"
          :routerLink="practiceJobsRouterLink"
          :orderBy="practiceJobsOrderBy"
          addClass="cursor-default"
          @pagechanged="practiceJobsPageChangedHandler"
          @sorted="(_practiceJobsOrderBy) => practiceJobsOrderBy = _practiceJobsOrderBy"
        />

        <div v-if="practiceJobsCount === 0 && !practiceJobsLoading" class="mt-2 w-full text-center text-white">
          <span>{{ 'No practice jobs.' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  
  import AppLoading from '@/components/Base/AppLoading'
  import AppDate from '@/components/Base/AppDate'
  import AppTable from '@/components/Base/AppTable'
  import AppButton from '@/components/Base/AppButton'

  export default {
    components: {
      AppLoading,
      AppDate,
      AppTable,
      AppButton,
    },

    data () {
      return {
        loading: true,

        practice: null,

        practiceJobsCurrentPage: 1,
        practiceJobsLimit: 5,
        practiceJobsOrderBy: [
          'date_created_in_gb_formatted:desc',
        ],
        practiceJobsCount: 0,
        practiceJobs: [],
        practiceJobsLoading: true,

        overrideCreated: null,
      }
    },

    computed: {
      practiceJobsRouterLink () {
        return () => {
          return {
            name: 'index-test-script-practice-dormant-status-index-practiceId',
          }
        }
      },

      practiceJobsColumns () {
        return [
          {
            name: "Job ID",
            dataIndex: 'id',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '140px',
          },
          {
            name: 'Job Title',
            dataIndex: 'title',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
          },
          {
            name: 'Job Number',
            dataIndex: 'job_number',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
          },
          { 
            name: 'Date Created',
            dataIndex: 'date_created_in_gb_formatted',
            class: 'md:text-center',
            sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
          },
        ]
      },

      practiceJobsOffset () {
        return this.practiceJobsLimit * (this.practiceJobsCurrentPage - 1)
      },

      practiceJobsTotalPages () {
        return Math.ceil(this.practiceJobsCount / this.practiceJobsLimit)
      },

      practiceJobsOrderByValue: {
        get () {
          return this.practiceJobsOrderBy.length > 0 ? this.practiceJobsOrderBy[0] : null
        },
        set (practiceJobsOrderBy) {
          this.practiceJobsOrderBy = [practiceJobsOrderBy]
        },
      },

      routerLink () {
        return () => {
          return {
            name: 'index-test-script-practice-dormant-status-index-practiceId',
          }
        }
      },
    },

    watch: {
      // $route() {
      //   if (this.$route.name === 'index-test-script-practice-dormant-status-index-practiceId') {
      //     this.loading = true
      //     Promise.all([
      //       this.getPractice(),
      //       this.getPracticeJobs(),
      //     ]).finally(() => {
      //       this.loading = false
      //     })
      //   }
      // },
      
      practiceJobsOrderBy () {
        this.practiceJobsCurrentPage = 1
        this.getPracticeJobs()
      },
    },


		mounted () {
      this.loading = true
      Promise.all([
        this.getPractice(),
        this.getPracticeJobs(),
      ]).finally(() => {
        this.loading = false
      })
    },
    
		methods: {
      getPractice () {
        return Promise.all([
          this.$axios.get(`/api/v1/admin/practices/${this.$route.params.practiceId}`)
            .then(response => response.data.data.practice),
        ]).then((responses) => {
          const [
            practice,
          ] = responses

          this.practice = practice
        })
      },

      getPracticeJobs () {
        const filters = {
          practice_id: this.$route.params.practiceId,
        }

        this.practiceJobsLoading = true

        return Promise.all([
          this.$axios.get('/api/v1/admin/jobs/count', {
            params: {
              ...filters,
            },
          }).then((response) => response.data.data.count),

          this.$axios.get('/api/v1/admin/jobs', {
            params: {
              ...filters,
              order_by: this.practiceJobsOrderBy,
              limit: this.practiceJobsLimit,
              offset: this.practiceJobsOffset,
            },
          }).then((response) => response.data.data.jobs),
        ]).then((responses) => {
          const [
            practiceJobsCount,
            practiceJobs,
          ] = responses

          this.practiceJobsCount = practiceJobsCount
          this.practiceJobs = practiceJobs
        }).finally(() => {
          this.practiceJobsLoading = false
        })
      },
      
      practiceJobsPageChangedHandler (page) {
        this.practiceJobsCurrentPage = page
        this.getPracticeJobs()
      },
      
		},
  }
</script>
