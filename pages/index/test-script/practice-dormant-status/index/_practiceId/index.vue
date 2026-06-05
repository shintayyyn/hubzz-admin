<template>
  <div style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end">      
      <AppLoading :loading="loading" :message="'Loading'" />

      <div class="py-4">
        <div class="">
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
        <!--Updated date picker new-->
        <!-- //new ni -->
        <div class="py-4">
          <div class=" flex flex-wrap items-center">
            <div class="text-lg font-bold" style="width: 150px;">
              Override created: 
            </div>

            <div class="px-2 flex flex-wrap items-center">
              <div class="px-2">
                <AppDate v-model="overrideCreatedDate" :isBefore="true" />
              </div>

              <div class="px-2">
                <AppTime
                  v-model="overrideCreatedTime"
                  :wrapperClass="'px-1 mt-2 mb-2'"
                  :inStyle="`background-color: transparent;`"
                  optionsContainerClass=""
                />
              </div>
            </div>

            <div class="px-2 flex">
              <AppButton
                label="Reset"
                class="mx-1"
                :inClass="'mt-2 bg-gray-800 hover:bg-gray-900 '"
                :background="''"
                @click="resetOverrideCreated"
              />

              <AppButton
                label="Save"
                class="mx-1"
                :inClass="'mt-2 bg-gray-800 hover:bg-gray-900 '"
                :background="''"
                @click="saveOverrideCreated"
              />
            </div>
          </div>

          <div class=" flex flex-wrap items-center">
            <div class="text-lg font-bold" style="width: 150px;">
              Override last job posted date: 
            </div>

            <div class="px-2 flex flex-wrap items-center">
              <div class="px-2">
                <AppDate v-model="overrideLastJobPostedDateDate" :isBefore="true" />
              </div>

              <div class="px-2">
                <AppTime
                  v-model="overrideLastJobPostedDateTime"
                  :wrapperClass="'px-1 mt-2 mb-2'"
                  :inStyle="`background-color: transparent;`"
                  optionsContainerClass=""
                />
              </div>
            </div>

            <div class="px-2 flex">
              <AppButton
                label="Reset"
                class="mx-1"
                :inClass="'mt-2 bg-gray-800 hover:bg-gray-900 '"
                :background="''"
                @click="resetOverrideLastJobPostedDate"
              />

              <AppButton
                label="Save"
                class="mx-1"
                :inClass="'mt-2 bg-gray-800 hover:bg-gray-900 '"
                :background="''"
                @click="saveOverrideLastJobPostedDate"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 mb-2">
          <div class="text-lg font-bold">
            Practice Jobs
          </div>
        </div>

        <AppTableNew
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

        <div v-if="practiceJobsCount === 0 && !practiceJobsLoading" class="mt-2 w-full text-center ">
          <span>{{ 'No practice jobs.' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AppLoading from '@/components/Base/AppLoading'
  import AppDate from '@/components/Base/AppDate'
  import AppTime from '@/components/Base/AppTime'
  import AppTableNew from '@/components/Base/AppTableNew'
  import AppButton from '@/components/Base/AppButton'

  export default {
    components: {
      AppLoading,
      AppDate,
      AppTime,
      AppTableNew,
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

        overrideCreatedDate: null,
        overrideCreatedTime: null,

        overrideLastJobPostedDateDate: null,
        overrideLastJobPostedDateTime: null,
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
        this.getPractice().then(() => {
          this.setValues()
        }),
        this.getPracticeJobs(),
      ]).finally(() => {
        this.loading = false
      })
    },
    
		methods: {
      setValues () {
        this.overrideCreatedDate = this.practice && this.practice.override_created_at
          ? this.$moment(this.practice.override_created_at, 'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DD')
          : null

        this.overrideCreatedTime = this.practice && this.practice.override_created_at
          ? this.$moment(this.practice.override_created_at, 'YYYY-MM-DD HH:mm:ss.SSS').format('HH:mm')
          : null

        this.overrideLastJobPostedDateDate = this.practice && this.practice.override_last_job_posted_date
          ? this.$moment(this.practice.override_last_job_posted_date, 'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DD')
          : null

        this.overrideLastJobPostedDateTime = this.practice && this.practice.override_last_job_posted_date
          ? this.$moment(this.practice.override_last_job_posted_date, 'YYYY-MM-DD HH:mm:ss.SSS').format('HH:mm')
          : null
      },

      resetOverrideCreated () {
        this.overrideCreatedDate = null
        this.overrideCreatedTime = null
        this.saveOverrideCreated()
      },

      saveOverrideCreated () {
        const data = {
          override_created_at: this.overrideCreatedDate
            ? this.overrideCreatedTime
              ? `${this.overrideCreatedDate} ${this.overrideCreatedTime}`
              : `${this.overrideCreatedDate} 00:00`
            : null,
        }

        this.loading = true
        this.$axios.put(`/api/v1/admin/practices/${this.$route.params.practiceId}/override-created-at`, data).then((response) => {
          this.practice = response.data.data.practice

          this.setValues()

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: response.data.message,
          })

          this.$emit('refreshPracticeTable')
        }).catch((err) => {
          console.log('err', err.response || err)

          if (err.response) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: err.response.data.message
            })
          } else {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: err.message
            })
          }
        }).finally(() => {
          this.loading = false
        })
      },

      resetOverrideLastJobPostedDate () {
        this.overrideLastJobPostedDateDate = null
        this.overrideLastJobPostedDateTime = null
        this.saveOverrideLastJobPostedDate()
      },

      saveOverrideLastJobPostedDate () {
        const data = {
          override_last_job_posted_date: this.overrideLastJobPostedDateDate
            ? this.overrideLastJobPostedDateTime
              ? `${this.overrideLastJobPostedDateDate} ${this.overrideLastJobPostedDateTime}`
              : `${this.overrideLastJobPostedDateDate} 00:00`
            : null,
        }

        this.loading = true
        this.$axios.put(`/api/v1/admin/practices/${this.$route.params.practiceId}/override-last-job-posted-date`, data).then((response) => {
          this.practice = response.data.data.practice

          this.setValues()

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: response.data.message,
          })

          this.$emit('refreshPracticeTable')
        }).catch((err) => {
          console.log('err', err.response || err)

          if (err.response) {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: err.response.data.message
            })
          } else {
            this.$store.commit('SET_NOTIFICATION', {
              enabled: true,
              status: 'danger',
              text: err.message
            })
          }
        }).finally(() => {
          this.loading = false
        })
      },

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
