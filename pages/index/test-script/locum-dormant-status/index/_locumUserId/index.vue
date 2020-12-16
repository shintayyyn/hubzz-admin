<template>
  <div class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-9/12 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg" style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link :to="{ name: 'index-test-script-locum-dormant-status-index' }" class="text-white hover:text-sunglow p-1" draggable="false">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>
      
      <AppLoading :loading="loading" :message="'Loading'" />

      <div class="py-4">
        <div class="mx-2 md:mx-4 text-white">
          <div class="text-lg font-bold">
            ID: {{ $route.params.locumUserId }}
          </div>
          <div class="text-lg font-bold">
            Name: {{ locumUser ? locumUser.name : '' }}
          </div>
          <div class="text-lg font-bold">
            Created: {{ locumUser ? locumUser.created_at_in_gb_formatted : '' }}
          </div>
          <div class="text-lg font-bold">
            Last job application date: {{ locumUser ? locumUser.last_job_application_date_in_gb_formatted : '' }}
          </div>
          <div class="text-lg font-bold">
            Status: 
            <div
              class="inline-block px-4 py-1 rounded-full text-center w-32 mx-1"
              :class="locumUser && locumUser.status === 'Active' ? 'bg-green-500' : 'bg-gray-500 text-gray-700'"
            >
              {{ locumUser ? locumUser.status : '' }}
            </div>
          </div>
        </div>

        <div class="py-4">
          <div class="mx-2 md:mx-4 text-white flex flex-wrap items-center">
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
                  optionsContainerClass="bg-trout"
                />
              </div>
            </div>

            <div class="px-2 flex">
              <AppButton
                label="Reset"
                class="mx-1"
                :inClass="'mt-2 bg-gray-800 hover:bg-gray-900 text-white'"
                :background="''"
                @click="resetOverrideCreated"
              />

              <AppButton
                label="Save"
                class="mx-1"
                :inClass="'mt-2 bg-gray-800 hover:bg-gray-900 text-white'"
                :background="''"
                @click="saveOverrideCreated"
              />
            </div>
          </div>

          <div class="mx-2 md:mx-4 text-white flex flex-wrap items-center">
            <div class="text-lg font-bold" style="width: 150px;">
              Override last job application date: 
            </div>

            <div class="px-2 flex flex-wrap items-center">
              <div class="px-2">
                <AppDate v-model="overrideLastJobApplicationDateDate" :isBefore="true" />
              </div>

              <div class="px-2">
                <AppTime
                  v-model="overrideLastJobApplicationDateTime"
                  :wrapperClass="'px-1 mt-2 mb-2'"
                  :inStyle="`background-color: transparent;`"
                  optionsContainerClass="bg-trout"
                />
              </div>
            </div>

            <div class="px-2 flex">
              <AppButton
                label="Reset"
                class="mx-1"
                :inClass="'mt-2 bg-gray-800 hover:bg-gray-900 text-white'"
                :background="''"
                @click="resetOverrideLastJobApplicationDate"
              />

              <AppButton
                label="Save"
                class="mx-1"
                :inClass="'mt-2 bg-gray-800 hover:bg-gray-900 text-white'"
                :background="''"
                @click="saveOverrideLastJobApplicationDate"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 mx-2 md:mx-4 text-white">
          <div class="text-lg font-bold">
            Locum User Applied in Jobs
          </div>
        </div>

        <AppTable
          v-if="locumUserJobsCount !== 0"
          :total="locumUserJobsCount"
          :items="locumUserJobs"
          :currentPage="locumUserJobsCurrentPage"
          :perPage="locumUserJobsLimit"
          :columns="locumUserJobsColumns"
          :loading="locumUserJobsLoading"
          :routerLink="locumUserJobsRouterLink"
          :orderBy="locumUserJobsOrderBy"
          addClass="cursor-default"
          @pagechanged="locumUserJobsPageChangedHandler"
          @sorted="(_locumUserJobsOrderBy) => locumUserJobsOrderBy = _locumUserJobsOrderBy"
        />

        <div v-if="locumUserJobsCount === 0 && !locumUserJobsLoading" class="mt-2 w-full text-center text-white">
          <span>{{ 'No locumUser jobs.' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import AppLoading from '@/components/Base/AppLoading'
  import AppDate from '@/components/Base/AppDate'
  import AppTime from '@/components/Base/AppTime'
  import AppTable from '@/components/Base/AppTable'
  import AppButton from '@/components/Base/AppButton'

  export default {
    components: {
      AppLoading,
      AppDate,
      AppTime,
      AppTable,
      AppButton,
    },

    data () {
      return {
        loading: true,

        locumUser: null,

        locumUserJobsCurrentPage: 1,
        locumUserJobsLimit: 5,
        locumUserJobsOrderBy: [
          'date_created_in_gb_formatted:desc',
        ],
        locumUserJobsCount: 0,
        locumUserJobs: [],
        locumUserJobsLoading: true,

        overrideCreatedDate: null,
        overrideCreatedTime: null,

        overrideLastJobApplicationDateDate: null,
        overrideLastJobApplicationDateTime: null,
      }
    },

    computed: {
      locumUserJobsRouterLink () {
        return () => {
          return {
            name: 'index-test-script-locum-dormant-status-index-locumUserId',
          }
        }
      },

      locumUserJobsColumns () {
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

      locumUserJobsOffset () {
        return this.locumUserJobsLimit * (this.locumUserJobsCurrentPage - 1)
      },

      locumUserJobsTotalPages () {
        return Math.ceil(this.locumUserJobsCount / this.locumUserJobsLimit)
      },

      locumUserJobsOrderByValue: {
        get () {
          return this.locumUserJobsOrderBy.length > 0 ? this.locumUserJobsOrderBy[0] : null
        },
        set (locumUserJobsOrderBy) {
          this.locumUserJobsOrderBy = [locumUserJobsOrderBy]
        },
      },

      routerLink () {
        return () => {
          return {
            name: 'index-test-script-locum-dormant-status-index-locumUserId',
          }
        }
      },
    },

    watch: {
      // $route() {
      //   if (this.$route.name === 'index-test-script-locum-dormant-status-index-locumUserId') {
      //     this.loading = true
      //     Promise.all([
      //       this.getLocumUser(),
      //       this.getLocumUserAppliedInJobs(),
      //     ]).finally(() => {
      //       this.loading = false
      //     })
      //   }
      // },
      
      locumUserJobsOrderBy () {
        this.locumUserJobsCurrentPage = 1
        this.getLocumUserAppliedInJobs()
      },
    },


		mounted () {
      this.loading = true
      Promise.all([
        this.getLocumUser().then(() => {
          this.setValues()
        }),
        this.getLocumUserAppliedInJobs(),
      ]).finally(() => {
        this.loading = false
      })
    },
    
		methods: {
      setValues () {
        this.overrideCreatedDate = this.locumUser && this.locumUser.override_created_at
          ? this.$moment(this.locumUser.override_created_at, 'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DD')
          : null

        this.overrideCreatedTime = this.locumUser && this.locumUser.override_created_at
          ? this.$moment(this.locumUser.override_created_at, 'YYYY-MM-DD HH:mm:ss.SSS').format('HH:mm')
          : null

        this.overrideLastJobApplicationDateDate = this.locumUser && this.locumUser.override_last_job_application_date
          ? this.$moment(this.locumUser.override_last_job_application_date, 'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DD')
          : null

        this.overrideLastJobApplicationDateTime = this.locumUser && this.locumUser.override_last_job_application_date
          ? this.$moment(this.locumUser.override_last_job_application_date, 'YYYY-MM-DD HH:mm:ss.SSS').format('HH:mm')
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
        this.$axios.put(`/api/v1/admin/locum-users/${this.$route.params.locumUserId}/override-created-at`, data).then((response) => {
          this.locumUser = response.data.data.user

          this.setValues()

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: response.data.message,
          })

          this.$emit('refreshLocumUserTable')
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

      resetOverrideLastJobApplicationDate () {
        this.overrideLastJobApplicationDateDate = null
        this.overrideLastJobApplicationDateTime = null
        this.saveOverrideLastJobApplicationDate()
      },

      saveOverrideLastJobApplicationDate () {
        const data = {
          override_last_job_application_date: this.overrideLastJobApplicationDateDate
            ? this.overrideLastJobApplicationDateTime
              ? `${this.overrideLastJobApplicationDateDate} ${this.overrideLastJobApplicationDateTime}`
              : `${this.overrideLastJobApplicationDateDate} 00:00`
            : null,
        }

        this.loading = true
        this.$axios.put(`/api/v1/admin/locum-users/${this.$route.params.locumUserId}/override-last-job-application-date`, data).then((response) => {
          this.locumUser = response.data.data.user

          this.setValues()

          this.$store.commit('SET_NOTIFICATION', {
            enabled: true,
            status: 'success',
            text: response.data.message,
          })

          this.$emit('refreshLocumUserTable')
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

      getLocumUser () {
        return Promise.all([
          this.$axios.get(`/api/v1/admin/locum-users/${this.$route.params.locumUserId}`)
            .then(response => response.data.data.user),
        ]).then((responses) => {
          const [
            locumUser,
          ] = responses

          this.locumUser = locumUser
        })
      },

      getLocumUserAppliedInJobs () {
        console.log('getLocumUserAppliedInJobs')

        // const filters = {
        //   locum_user_id: this.$route.params.locumUserId,
        // }

        // this.locumUserJobsLoading = true

        // return Promise.all([
        //   this.$axios.get('/api/v1/admin/jobs/count', {
        //     params: {
        //       ...filters,
        //     },
        //   }).then((response) => response.data.data.count),

        //   this.$axios.get('/api/v1/admin/jobs', {
        //     params: {
        //       ...filters,
        //       order_by: this.locumUserJobsOrderBy,
        //       limit: this.locumUserJobsLimit,
        //       offset: this.locumUserJobsOffset,
        //     },
        //   }).then((response) => response.data.data.jobs),
        // ]).then((responses) => {
        //   const [
        //     locumUserJobsCount,
        //     locumUserJobs,
        //   ] = responses

        //   this.locumUserJobsCount = locumUserJobsCount
        //   this.locumUserJobs = locumUserJobs
        // }).finally(() => {
        //   this.locumUserJobsLoading = false
        // })
      },
      
      locumUserJobsPageChangedHandler (page) {
        this.locumUserJobsCurrentPage = page
        this.getLocumUserAppliedInJobs()
      },
      
		},
  }
</script>
