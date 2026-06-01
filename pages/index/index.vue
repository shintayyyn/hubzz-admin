<template>
  <div class="flex-1 flex flex-col overflow-auto py-2 px-4 md:px-8">
    <!-- Filters -->
    <div class="flex flex-wrap justify-between items-start w-full shadow-md rounded flex bg-gray-300 my-2">
      <div class="flex flex-col lg:flex-row w-full m-4">
        <div class="flex w-5/6">
          <div class="md:px-1 w-full lg:w-1/4">
            <AppDate v-model="filter.registered_at_date_start" label="Date Start" format="YYYY-MM-DD" />
          </div>

          <div class="md:px-1 w-full lg:w-1/4">
            <AppDate v-model="filter.registered_at_date_end" label="Date End" format="YYYY-MM-DD" />
          </div>
          <div class="md:px-1 w-full lg:w-1/4 ">
            <AppSuggestSelect
              v-model="filter.post_code"
              :url-index="'/api/v1/postcode-coordinates'"
              :name="'postcode'"
              :label="'Post Code'"
              :inClass="'border-gray-600'"
            />
          </div>
          <div class="md:px-1 w-full lg:w-1/4">
            <AppInput
              v-model="filter.proximity"
              :disabled="!filter.post_code"
              type="number"
              label="Proximity"
              :inClass="filter.post_code ? 'border-gray-600' : ''"
            />
          </div>
        </div>
        <div class="flex w-1/6 items-center justify-end">
          <div>
            <AppButton class="mx-2 whitespace-nowrap" label="Apply Filters" :disabled="loadingDashboard" @click="filterSearch" />
          </div>
          <div>
            <AppButton label="Clear Filters" :background="'waterloo'" :disabled="loadingDashboard" @click="filterReset" />
          </div>
        </div>
      </div>
    </div>

    <!-- DASHBOARD BODY -->
    <div class="flex flex-col">
      <div class="flex flex-col lg:flex-row w-full ">
        <!-- LOCUM REGISTRATIONS -->
        <div v-if="canViewLocums" class="flex-1 rounded my-2 lg:mr-2 shadow-md bg-gray-300">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-800">
              <div>Locum Registrations</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="black" width="30" height="30" />
              </div>
            </div>
            <div class="flex justify-between font-bold">
              <div>
                Locum Sign-Ups
              </div>
              <div class="text-orange-500">
                {{ locumSignUps && locumSignUps.locum_users ? locumSignUps.locum_users : 0 }}
              </div>
            </div>
            <div class="flex justify-between text-sm my-1 text-gray-700">
              <div>
                Organic
              </div>
              <div class="text-orange-500 font-bold">
                {{ locumSignUps && locumSignUps.organic_locum_users ? locumSignUps.organic_locum_users : 0 }}
              </div>
            </div>
            <div class="flex justify-between text-sm my-1 text-gray-700">
              <div>
                Referred by Other Locums
              </div>
              <div class="text-orange-500 font-bold">
                {{ locumSignUps && locumSignUps.referred_locum_users ? locumSignUps.referred_locum_users : 0 }}
              </div>
            </div>
          </div>
        </div>

        <!-- PRACTICE REGISTRATIONS -->
        <div v-if="canViewPractices" class="flex-1 rounded my-2 lg:mx-2 shadow-md bg-gray-300">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-800">
              <div>Practice Registrations</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="black" width="30" height="30" />
              </div>
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Practice Sign-Ups
              </div>
              <div class="text-orange-500 font-bold">
                {{ practiceSignUps && practiceSignUps.practice_users ? practiceSignUps.practice_users : 0 }}
              </div>
            </div>
            <div class="flex justify-between my-1 text-sm text-gray-700">
              <div>
                Organic
              </div>
              <div class="text-orange-500 font-bold">
                {{ practiceSignUps && practiceSignUps.organic_practice_registrations ? practiceSignUps.organic_practice_registrations : 0 }}
              </div>
            </div>
            <div class="flex justify-between my-1 text-sm text-gray-700">
              <div>
                Referred by Other Locums
              </div>
              <div class="text-orange-500 font-bold">
                {{ practiceSignUps && practiceSignUps.referred_by_locum ? practiceSignUps.referred_by_locum : 0 }}
              </div>
            </div>
            <div class="flex justify-between my-1 text-sm text-gray-700">
              <div>
                Referred by Other Practices
              </div>
              <div class="text-orange-500 font-bold">
                {{ practiceSignUps && practiceSignUps.referred_by_practice ? practiceSignUps.referred_by_practice : 0 }}
              </div>
            </div>
          </div>
        </div>

        <!-- SUCCESSFUL REFERRERS -->
        <div v-if="canViewSuccessfulReferrals" class="flex-1 rounded my-2 lg:mx-2 shadow-md bg-gray-300">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-800">
              <div>Referrers with Successful Referrals</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="black" width="30" height="30" />
              </div>
            </div>
            <div v-if="canViewLocums" class="flex justify-between my-1 text-sm text-gray-700">
              <div>
                Locums
              </div>
              <div class="text-orange-500 font-bold">
                {{ successfulReferrals && successfulReferrals.locum_referees ? successfulReferrals.locum_referees : 0 }}
              </div>
            </div>
            <div v-if="canViewPractices" class="flex justify-between my-1 text-sm text-gray-700">
              <div>
                Practices
              </div>
              <div class="text-orange-500 font-bold">
                {{ successfulReferrals && successfulReferrals.practice_referees ? successfulReferrals.practice_referees : 0 }}
              </div>
            </div>
          </div>
        </div>

        <!-- BILLING TOTALS -->
        <div v-if="canViewHubzzInvoices" class="flex-1 rounded my-2 lg:ml-2 shadow-md bg-gray-300">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-800">
              <div>Billing</div>

              <div class="-my-2">
                <svgicon v-if="loadingDashboardBillingStats" name="loader" color="black" width="30" height="30" />
              </div>
            </div>

            <div class="flex justify-between my-1 font-bold">
              <div>
                Total Approved Hours
              </div>

              <div class="text-orange-500">
                {{
                  dashboardBillingStats && dashboardBillingStats.approved_hours
                    ? dashboardBillingStats.approved_hours.toFixed(0) + ' Hours'
                    : 0 | amount
                }}
              </div>
            </div>

            <div class="flex justify-between my-1 font-bold">
              <div>
                Completed Hours
              </div>

              <div class="text-orange-500">
                {{
                  dashboardBillingStats && dashboardBillingStats.completed_hours
                    ? dashboardBillingStats.completed_hours.toFixed(0) + ' Hours'
                    : 0 | amount
                }}
              </div>
            </div>

            <div class="flex justify-between my-1 font-bold">
              <div>
                Billed Hours
              </div>

              <div class="text-orange-500">
                {{
                  dashboardBillingStats && dashboardBillingStats.billed_hours ? dashboardBillingStats.billed_hours.toFixed(0) + ' Hours' : 0 | amount
                }}
              </div>
            </div>

            <div class="flex justify-between my-1 font-bold">
              <div>
                Credits
              </div>

              <div class="text-orange-500">
                £ {{ dashboardBillingStats && dashboardBillingStats.total_credit ? dashboardBillingStats.total_credit : 0 | currency }}
              </div>
            </div>

            <div class="flex justify-between my-1 font-bold">
              <div>
                Revenue
              </div>

              <div class="text-orange-500">
                £ {{ dashboardBillingStats && dashboardBillingStats.taxed_total ? dashboardBillingStats.taxed_total : 0 | currency }}
              </div>
            </div>

            <div class="flex justify-between my-1 font-bold">
              <div>
                VAT
              </div>

              <div class="text-gray-800">
                £ {{ dashboardBillingStats && dashboardBillingStats.tax ? dashboardBillingStats.tax : 0 | currency }}
              </div>
            </div>
          </div>
        </div>
        <!-- BILLING TOTALS -->
      </div>

      <div class="flex flex-col lg:flex-row w-full ">
        <!-- LOCUMS IN PLATFORM -->
        <div v-if="canViewLocums" class="flex-1 rounded my-2 lg:mr-2 shadow-md bg-gray-300">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-800">
              <div>Locums</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="black" width="30" height="30" />
              </div>
            </div>
            <div class="flex justify-between font-bold">
              <div>
                Active Locums
              </div>
              <div class="text-orange-500">
                {{ locumsInPlatform.active_locums }}
              </div>
            </div>
            <div
              v-for="(locumCountsByProfession, index) in locumsInPlatform.active_locums_by_profession"
              :key="`user-${index}`"
              class="ml-2 text-sm text-gray-700"
            >
              <div class="flex justify-between my-1">
                <div class="mr-4">
                  {{ locumCountsByProfession.name }}
                </div>
                <div class="text-orange-500 font-bold">
                  {{ locumCountsByProfession.locum_count }}
                </div>
              </div>
            </div>
            <div class="flex justify-between font-bold">
              <div>
                Inactive Locums
              </div>
              <div class="text-orange-500">
                {{ locumsInPlatform.inactive_locums }}
              </div>
            </div>
          </div>
        </div>

        <!-- PRACTICES IN PLATFORM -->
        <div v-if="canViewPractices" class="flex-1 rounded my-2 lg:mx-2 shadow-md bg-gray-300">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-800">
              <div>Practices</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="black" width="30" height="30" />
              </div>
            </div>
            <div class="flex justify-between font-bold">
              <div>
                Activated Practices
              </div>
              <div class="text-orange-500">
                {{ practicesInPlatform.active_practices }}
              </div>
            </div>
            <div v-for="(practiceCounts, index) in practicesInPlatform.practices_by_type" :key="`user-${index}`" class="ml-2 text-sm">
              <div class="flex justify-between my-1">
                <div>
                  {{ practiceCounts.type }}
                </div>
                <div class="text-orange-500 font-bold">
                  {{ practiceCounts.count }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- JOBS IN PLATFORM -->
        <div v-if="canViewJobsAndDisputes" class="flex-1 rounded my-2 lg:mx-2 shadow-md bg-gray-300">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-800">
              <div>Jobs</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="black" width="30" height="30" />
              </div>
            </div>
            <div class="flex justify-between font-bold my-1">
              <div>
                Platform Jobs
              </div>
              <div class="text-orange-500">
                {{ jobsInPlatform.platform_jobs }}
              </div>
            </div>
            <div v-for="(jobCountsByStatus, index) in jobsInPlatform.job_counts_by_status" :key="`user-${index}`" class="ml-2 text-sm">
              <div class="flex justify-between my-1">
                <div>
                  {{ jobCountsByStatus.status }}
                </div>
                <div class="text-orange-500 font-bold">
                  {{ jobCountsByStatus.count }}
                </div>
              </div>
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Private Jobs
              </div>
              <div class="text-orange-500">
                {{ jobsInPlatform.private_jobs }}
              </div>
            </div>
          </div>
        </div>

        <!-- DISPUTES -->
        <div v-if="canViewJobsAndDisputes" class="flex-1 rounded my-2 lg:ml-2 shadow-md bg-gray-300">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-800">
              <div>Job Disputes</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="black" width="30" height="30" />
              </div>
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Disputes
              </div>
              <div class="text-orange-500">
                {{ jobDisputes.disputes_count }}
              </div>
            </div>
            <div v-for="(disputesCountByStatus, index) in jobDisputes.disputes_count_by_status" :key="`user-${index}`" class="ml-2 text-sm">
              <div class="flex justify-between my-1">
                <div>
                  {{ disputesCountByStatus.status }}
                </div>
                <div class="text-orange-500 font-bold">
                  {{ disputesCountByStatus.count }}
                </div>
              </div>
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Average Resolve Time
              </div>
              <div class="text-orange-500">
                {{ jobDisputes.ave_resolve_time }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from '@/components/Base/AppInput'
import AppButton from '@/components/Base/AppButton'
import AppDate from '@/components/Base/AppDate'
import AppSuggestSelect from '@/components/Base/AppSuggestSelect'

const LOCUM_DASHBOARD_ACTIONS = ['dashboard/fetchLocumRegistrations', 'dashboard/fetchLocumsInPlatform']
const PRACTICE_DASHBOARD_ACTIONS = ['dashboard/fetchPracticeRegistrations', 'dashboard/fetchPracticesInPlatform']
const SUCCESSFUL_REFERRAL_ACTIONS = ['dashboard/fetchSuccessfulReferrals']
const JOB_DASHBOARD_ACTIONS = ['dashboard/fetchJobsInPlatform', 'dashboard/fetchDisputes']

export default {
  components: {
    AppInput,
    AppButton,
    AppDate,
    AppSuggestSelect
  },

  data() {
    return {
      filter: {
        registered_at_date_start: '',
        registered_at_date_end: '',
        post_code: '',
        proximity: ''
      },

      loadingDashboardBillingStats: true,
      dashboardBillingStats: null
    }
  },

  computed: {
    authAdminPermissions() {
      return this.$store.getters['permissions']
    },

    canViewLocums() {
      return this.authAdminPermissions.includes('View Locums')
    },

    canViewPractices() {
      return this.authAdminPermissions.includes('View Practices')
    },

    canViewHubzzInvoices() {
      return this.authAdminPermissions.includes('View Hubzz Invoices')
    },

    canViewSuccessfulReferrals() {
      return this.canViewLocums || this.canViewPractices
    },

    canViewJobsAndDisputes() {
      return this.authAdminPermissions.includes('View Locum Jobs') || this.authAdminPermissions.includes('View Practice Sessions')
    },

    loadingDashboard() {
      return this.$store.state.dashboard.loading_dashboard
    },

    locumSignUps() {
      return this.$store.state.dashboard.locum_sign_ups
    },

    practiceSignUps() {
      return this.$store.state.dashboard.practice_sign_ups
    },

    successfulReferrals() {
      return this.$store.state.dashboard.successful_referrals
    },

    billingTotals() {
      return this.$store.state.dashboard.billing_totals
    },

    locumsInPlatform() {
      return this.$store.state.dashboard.locums_in_platform
    },

    practicesInPlatform() {
      return this.$store.state.dashboard.practices_in_platform
    },

    jobsInPlatform() {
      return this.$store.state.dashboard.jobs_in_platform
    },

    jobDisputes() {
      return this.$store.state.dashboard.job_disputes
    }
  },

  mounted() {
    this.filterReset()

    window.setTimeout(() => {
      this.getEverything()
      window.setInterval(() => {
        this.getEverything()
      }, 1000 * 300 * 1)
    }, 1000 * 300)
  },

  methods: {
    getEverything() {
      const promises = []

      if (this.canViewLocums) {
        promises.push(...this.dispatchDashboardActions(LOCUM_DASHBOARD_ACTIONS))
      }

      if (this.canViewPractices) {
        promises.push(...this.dispatchDashboardActions(PRACTICE_DASHBOARD_ACTIONS))
      }

      if (this.canViewSuccessfulReferrals) {
        promises.push(...this.dispatchDashboardActions(SUCCESSFUL_REFERRAL_ACTIONS))
      }

      if (this.canViewJobsAndDisputes) {
        promises.push(...this.dispatchDashboardActions(JOB_DASHBOARD_ACTIONS))
      }

      this.$store.commit('dashboard/SET_FILTERS', this.filter)
      this.$store.commit('dashboard/TOGGLE_LOADING', true)
      Promise.all(promises).finally(() => {
        this.$store.commit('dashboard/TOGGLE_LOADING', false)
      })

      if (this.canViewHubzzInvoices) {
        this.loadingDashboardBillingStats = true
        this.$axios
          .get('/api/v2/admin/dashboard-billing-stats', {
            params: this.getBillingStatsParams()
          })
          .then(response => {
            this.dashboardBillingStats = response.data.data.dashboard_billing_stats
          })
          .finally(() => {
            this.loadingDashboardBillingStats = false
          })
      }
    },

    async filterSearch() {
      this.getEverything()
    },

    async filterReset() {
      Promise.all([
        (this.filter.registered_at_date_start = this.$moment
          .utc()
          .startOf('month')
          .format('YYYY-MM-DD')),
        (this.filter.registered_at_date_end = this.$moment.utc().format('YYYY-MM-DD')),
        (this.filter.post_code = ''),
        (this.filter.proximity = '')
      ]).then(() => {
        this.getEverything()
      })
    },

    getDashboardFilterParams() {
      return {
        registered_at_date_start: this.filter.registered_at_date_start,
        registered_at_date_end: this.filter.registered_at_date_end,
        post_code: this.filter.post_code,
        proximity: this.filter.proximity
      }
    },

    getBillingStatsParams() {
      return {
        practice_invoice_issued_at_start: this.filter.registered_at_date_start,
        practice_invoice_issued_at_end: this.filter.registered_at_date_end,
        practice_postcode: this.filter.post_code,
        practice_postcode_miles: this.filter.proximity
      }
    },

    dispatchDashboardAction(action) {
      return this.$store.dispatch(action, this.getDashboardFilterParams())
    },

    dispatchDashboardActions(actions) {
      return actions.map(action => this.dispatchDashboardAction(action))
    }
  }
}
</script>
