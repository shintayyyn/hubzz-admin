<template>
  <div class="flex-1 flex flex-col overflow-hidden py-2 px-4 md:px-8 text-white">
    <!-- <AppLoading :loading="loadingDashboard" :message="'Loading Dashboard'" /> -->
    <div class="flex flex-wrap justify-between items-start w-full shadow-lg rounded flex bg-charade text-white my-2">
      <div class="flex flex-col lg:flex-row w-full m-4">
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppDate
            v-model="filter.registered_at_date_start"
            label="Date Start"
            format="YYYY-MM-DD"
          />
        </div>

        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppDate
            v-model="filter.registered_at_date_end"
            label="Date End"
            format="YYYY-MM-DD"
          />
        </div>
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 ">
          <AppPostCode
            v-model="filter.post_code"
            :url-index="'/api/v1/postcode-coordinates'"
            :name="'postcode'"
            :label="'Post Code'"
          />
        </div>
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="filter.proximity"
            placeholder="Proximity"
            type="number"
            label="Proximity"
          />
        </div>
        <div class="flex w-full justify-end">
          <div class="mt-6">
            <AppButton
              class="mx-2"
              label="Apply Filters"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              :disabled="loadingDashboard"
              @click="filterSearch"
            /> 
          </div>
          <div class="mt-6">
            <AppButton
              label="Clear Filters"
              :background="'waterloo'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              :disabled="loadingDashboard"
              @click="filterReset"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- DASHBOARD BODY -->
    <div class="flex flex-col">
      <div class="flex flex-col lg:flex-row w-full ">
        <!-- LOCUM REGISTRATIONS -->
        <div class="flex-1 rounded my-2 lg:mr-2 bg-charade">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-500">
              <div>Locum Registrations</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="white" width="30" height="30" />
              </div> 
            </div>
            <div class="flex justify-between font-bold">
              <div>
                Locum Sign-Ups
              </div>
              <div class="text-yellow-500">
                {{ locumSignUps && locumSignUps.locum_users ? locumSignUps.locum_users : 0 }}
              </div>
            </div>
            <div class="flex justify-between text-sm my-1 text-gray-300">
              <div>
                Organic
              </div>
              <div class="text-yellow-500 font-bold">
                {{ locumSignUps && locumSignUps.organic_locum_users ? locumSignUps.organic_locum_users : 0 }}
              </div>
            </div>
            <div class="flex justify-between text-sm my-1 text-gray-300">
              <div>
                Referred by Other Locums
              </div>
              <div class="text-yellow-500 font-bold">
                {{ locumSignUps && locumSignUps.referred_locum_users ? locumSignUps.referred_locum_users : 0 }}
              </div>
            </div>
          </div>
        </div>
        <!-- PRACTICE REGISTRATIONS -->
        <div class="flex-1 rounded my-2 lg:mx-2 bg-charade">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-500">
              <div>Practice Registrations</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="white" width="30" height="30" />
              </div> 
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Practice Sign-Ups
              </div>
              <div class="text-yellow-500 font-bold">
                {{ practiceSignUps && practiceSignUps.practice_users ? practiceSignUps.practice_users : 0 }}
              </div>
            </div>
            <div class="flex justify-between my-1 text-sm text-gray-300">
              <div>
                Organic
              </div>
              <div class="text-yellow-500 font-bold">
                {{ practiceSignUps && practiceSignUps.organic_practice_registrations ? practiceSignUps.organic_practice_registrations : 0 }}
              </div>
            </div>
            <div class="flex justify-between my-1 text-sm text-gray-300">
              <div>
                Referred by Other Locums
              </div>
              <div class="text-yellow-500 font-bold">
                {{ practiceSignUps && practiceSignUps.referred_by_locum ? practiceSignUps.referred_by_locum : 0 }}
              </div>
            </div>
            <div class="flex justify-between my-1 text-sm text-gray-300">
              <div>
                Referred by Other Practices
              </div>
              <div class="text-yellow-500 font-bold">
                {{ practiceSignUps && practiceSignUps.referred_by_practice ? practiceSignUps.referred_by_practice : 0 }}
              </div>
            </div>
          </div>
        </div>
        <!-- SUCCESSFUL REFERRERS -->
        <div class="flex-1 rounded my-2 lg:mx-2 bg-charade">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-500">
              <div>Referrers with Successful Referrals</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="white" width="30" height="30" />
              </div> 
            </div>
            <div class="flex justify-between my-1 text-sm text-gray-300">
              <div>
                Locums
              </div>
              <div class="text-yellow-500">
                {{ successfulReferrals && successfulReferrals.locum_referees ? successfulReferrals.locum_referees : 0 }}
              </div>
            </div>
            <div class="flex justify-between my-1 text-sm text-gray-300">
              <div>
                Practices
              </div>
              <div class="text-yellow-500">
                {{ successfulReferrals && successfulReferrals.practice_referees ? successfulReferrals.practice_referees : 0 }}
              </div>
            </div>
          </div>
        </div>
        <!-- BILLING TOTALS -->
        <div class="flex-1 rounded my-2 lg:ml-2 bg-charade">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-500">
              <div>Billing</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="white" width="30" height="30" />
              </div> 
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Total Approved Hours
              </div>
              <div class="text-yellow-500">
                {{ billingTotals && billingTotals.approved_total_hours_formatted ? billingTotals.approved_total_hours_formatted.toFixed(0) + ' Hours' : 0 }}
              </div>
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Completed Hours
              </div>
              <div class="text-yellow-500">
                {{ billingTotals && billingTotals.total_completed_final_hours_formatted ? billingTotals.total_completed_final_hours_formatted.toFixed(0) + ' Hours' : 0 }}
              </div>
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Billed Hours
              </div>
              <div class="text-yellow-500">
                {{ billingTotals && billingTotals.billed_total_hours_formatted ? billingTotals.billed_total_hours_formatted.toFixed(0) + ' Hours' : 0 }}
              </div>
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Revenue
              </div>
              <div class="text-yellow-500">
                £ {{ billingTotals && billingTotals.total_revenue ? billingTotals.total_revenue : 0 | currency }}
              </div>
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                VAT
              </div>
              <div class="text-gray-500">
                £ {{ billingTotals && billingTotals.total_taxes ? billingTotals.total_taxes : 0 | currency }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col lg:flex-row w-full ">
        <!-- LOCUMS IN PLATFORM -->
        <div class="flex-1 rounded my-2 lg:mr-2 bg-charade">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-500">
              <div>Locums</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="white" width="30" height="30" />
              </div> 
            </div>
            <div class="flex justify-between font-bold">
              <div>
                Active Locums
              </div>
              <div class="text-yellow-500">
                {{ locumsInPlatform.active_locums }}
              </div>
            </div>
            <div 
              v-for="(locumCountsByProfession, index) in locumsInPlatform.active_locums_by_profession"
              :key="`user-${index}`"
              class="ml-2 text-sm text-gray-300"
            >
              <div class="flex justify-between my-1">
                <div class="mr-4">
                  {{ locumCountsByProfession.name }}
                </div>
                <div class="text-yellow-500 font-bold">
                  {{ locumCountsByProfession.locum_count }}
                </div>
              </div>
            </div>
            <div class="flex justify-between font-bold">
              <div>
                Inactive Locums
              </div>
              <div class="text-yellow-500">
                {{ locumsInPlatform.inactive_locums }}
              </div>
            </div>
          </div>
        </div>
        <!-- PRACTICES IN PLATFORM -->
        <div class="flex-1 rounded my-2 lg:mx-2 bg-charade">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-500">
              <div>Practices</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="white" width="30" height="30" />
              </div> 
            </div>
            <div class="flex justify-between font-bold">
              <div>
                Active Practices
              </div>
              <div class="text-yellow-500">
                {{ practicesInPlatform.active_practices }}
              </div>
            </div>
            <div 
              v-for="(practiceCounts, index) in practicesInPlatform.practices_by_type"
              :key="`user-${index}`"
              class="ml-2 text-sm"
            >
              <div class="flex justify-between my-1">
                <div>
                  {{ practiceCounts.type }}
                </div>
                <div class="text-yellow-500 font-bold">
                  {{ practiceCounts.count }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- JOBS IN PLATFORM -->
        <div class="flex-1 rounded my-2 lg:mx-2 bg-charade">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-500">
              <div>Jobs</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="white" width="30" height="30" />
              </div> 
            </div>
            <div class="flex justify-between font-bold my-1">
              <div>
                Platform Jobs
              </div>
              <div class="text-yellow-500">
                {{ jobsInPlatform.platform_jobs }}
              </div>
            </div>
            <div 
              v-for="(jobCountsByStatus, index) in jobsInPlatform.job_counts_by_status"
              :key="`user-${index}`"
              class="ml-2 text-sm"
            >
              <div class="flex justify-between my-1">
                <div>
                  {{ jobCountsByStatus.status }}
                </div>
                <div class="text-yellow-500 font-bold">
                  {{ jobCountsByStatus.count }}
                </div>
              </div>
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Private Jobs
              </div>
              <div class="text-yellow-500">
                {{ jobsInPlatform.private_jobs }}
              </div>
            </div>
          </div>
        </div>
        <!-- DISPUTES -->
        <div class="flex-1 rounded my-2 lg:ml-2 bg-charade">
          <div class="m-4">
            <div class="flex flex-row text-xs text-gray-500">
              <div>Job Disputes</div>
              <div class="-my-2">
                <svgicon v-if="loadingDashboard" name="loader" color="white" width="30" height="30" />
              </div> 
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Disputes
              </div>
              <div class="text-yellow-500">
                {{ jobDisputes.disputes_count }}
              </div>
            </div>
            <div 
              v-for="(disputesCountByStatus, index) in jobDisputes.disputes_count_by_status"
              :key="`user-${index}`"
              class="ml-2 text-sm"
            >
              <div class="flex justify-between my-1">
                <div>
                  {{ disputesCountByStatus.status }}
                </div>
                <div class="text-yellow-500 font-bold">
                  {{ disputesCountByStatus.count }}
                </div>
              </div>
            </div>
            <div class="flex justify-between my-1 font-bold">
              <div>
                Average Resolve Time
              </div>
              <div class="text-yellow-500">
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
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import AppDate from "@/components/Base/AppDate"
import AppPostCode from "@/components/Base/AppPostCode"
// import AppLoading from "@/components/Base/AppLoading"
export default {
  components: {
    AppInput,
    AppButton,
    AppDate,
    AppPostCode,
    // AppLoading,
  },
  data () {
    return {
      filter: {
        registered_at_date_start:'',
        registered_at_date_end: '',
        post_code: '',
        proximity: '',
      },
      // locum_counts: '',
      // practice_counts: '',
      // job_counts: '',
      // dispute_counts: '',
      // billing_counts: '',
      // locum_registrations: '',
      // practice_registrations: '',
      // successful_referrals: '',
    }
  },

  computed: {
    loadingDashboard () {
      return this.$store.state.dashboard.loading_dashboard
    },

    locumSignUps () {
      return this.$store.state.dashboard.locum_sign_ups
    },

    practiceSignUps () {
      return this.$store.state.dashboard.practice_sign_ups
    },

    successfulReferrals () {
      return this.$store.state.dashboard.successful_referrals
    },

    billingTotals () {
      return this.$store.state.dashboard.billing_totals
    },

    locumsInPlatform () {
      return this.$store.state.dashboard.locums_in_platform
    },

    practicesInPlatform () {
      return this.$store.state.dashboard.practices_in_platform
    },

    jobsInPlatform () {
      return this.$store.state.dashboard.jobs_in_platform
    },

    jobDisputes () {
      return this.$store.state.dashboard.job_disputes
    },
  },

  mounted () {
    this.getEverything()
  },

  methods: {
    async getEverything () {
      Promise.all([
        this.$store.commit("dashboard/TOGGLE_LOADING", true),
        this.getLocumRegistrations(),
        this.getPracticeRegistrations(),
        this.getSuccessfulReferrals(),
        this.getBillingTotals(),
        this.getLocumsInPlatform(),
        this.getPracticesInPlatform(),
        this.getJobsInPlatform(),
        this.getDisputes(),
      ]).then(() => {
        this.$store.commit("dashboard/TOGGLE_LOADING", false)
      }).catch(() => {
        this.$store.commit("dashboard/TOGGLE_LOADING", false)
      })
    },

    async filterSearch () {
      this.getEverything()
    },

    async filterReset () {
      Promise.all([
        this.filter.registered_at_date_start = '',
        this.filter.registered_at_date_end = '',
        this.filter.post_code = '',
        this.filter.proximity = '',
      ]).then(() => {
        this.getEverything()
      })
    },

    async getLocumRegistrations () {
      await this.$store
        .dispatch("dashboard/fetchLocumRegistrations", {
          registered_at_date_start: this.filter.registered_at_date_start,
          registered_at_date_end: this.filter.registered_at_date_end,
          post_code: this.filter.post_code,
          proximity: this.filter.proximity
        })
    },

    async getPracticeRegistrations () {
      await this.$store
        .dispatch("dashboard/fetchPracticeRegistrations", {
          registered_at_date_start: this.filter.registered_at_date_start,
          registered_at_date_end: this.filter.registered_at_date_end,
          post_code: this.filter.post_code,
          proximity: this.filter.proximity
        })
    },

    async getSuccessfulReferrals () {
      await this.$store
        .dispatch("dashboard/fetchSuccessfulReferrals", {
          registered_at_date_start: this.filter.registered_at_date_start,
          registered_at_date_end: this.filter.registered_at_date_end,
          post_code: this.filter.post_code,
          proximity: this.filter.proximity
        })
    },

    async getBillingTotals () {
      await this.$store
        .dispatch("dashboard/fetchBillingTotals", {
          registered_at_date_start: this.filter.registered_at_date_start,
          registered_at_date_end: this.filter.registered_at_date_end,
          post_code: this.filter.post_code,
          proximity: this.filter.proximity
        })
    },

    async getLocumsInPlatform () {
      await this.$store
        .dispatch("dashboard/fetchLocumsInPlatform", {
          registered_at_date_start: this.filter.registered_at_date_start,
          registered_at_date_end: this.filter.registered_at_date_end,
          post_code: this.filter.post_code,
          proximity: this.filter.proximity
        })
    },

    async getPracticesInPlatform () {
      await this.$store
        .dispatch("dashboard/fetchPracticesInPlatform", {
          registered_at_date_start: this.filter.registered_at_date_start,
          registered_at_date_end: this.filter.registered_at_date_end,
          post_code: this.filter.post_code,
          proximity: this.filter.proximity
        })
    },

    async getJobsInPlatform () {
      await this.$store
        .dispatch("dashboard/fetchJobsInPlatform", {
          registered_at_date_start: this.filter.registered_at_date_start,
          registered_at_date_end: this.filter.registered_at_date_end,
          post_code: this.filter.post_code,
          proximity: this.filter.proximity
        })
    },

    async getDisputes () {
      await this.$store
        .dispatch("dashboard/fetchDisputes", {
          registered_at_date_start: this.filter.registered_at_date_start,
          registered_at_date_end: this.filter.registered_at_date_end,
          post_code: this.filter.post_code,
          proximity: this.filter.proximity
        })
    },
  }

}
</script>

<style>

</style>