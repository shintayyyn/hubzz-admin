<template>
  <div class="flex-1 flex flex-col overflow-hidden py-2 px-4 md:px-8 text-white">
    <AppLoading :loading="loadingDashboard" :message="'Loading Dashboard'" />
    <div class="flex flex-wrap justify-between items-start w-full shadow-lg p-3 rounded-lg flex bg-charade text-white my-2">
      <div class="flex flex-row w-full">
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
      </div>

      <div class="flex flex-wrap w-full justify-end">
        <AppButton
          class="mx-2"
          label="Submit"
          :in-style="'padding:5px 14px;margin-bottom:5px'"
          @click="filterSearch"
        />
         
        <AppButton
          label="Reset"
          :in-style="'padding:5px 14px;margin-bottom:5px'"
          @click="filterReset"
        />        
      </div>
    </div>
    <div class="flex flex-col">
      <div class="flex flex-row w-full ">
        <!-- LOCUM REGISTRATIONS -->
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-4">
            <div class="text-xs text-gray-500">
              Locum Registrations
            </div>
            <div class="text-sm text-gray-300">
              <span>
                Organic
              </span>
              <span class="text-yellow-500">
                {{ locumSignUps && locumSignUps.organic_locum_user ? locumSignUps.organic_locum_user : 0 }}
              </span>
            </div>
            <div class="text-sm text-gray-300">
              <span>
                Referred by Other Locums
              </span>
              <span class="text-yellow-500">
                {{ locumSignUps && locumSignUps.referred_locum_user ? locumSignUps.referred_locum_user : 0 }}
              </span>
            </div>
          </div>
        </div>
        <!-- PRACTICE REGISTRATIONS -->
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-4">
            <div class="text-xs text-gray-500">
              Practice Registrations
            </div>
            <div class="text-sm text-gray-300">
              <span>
                Organic
              </span>
              <span class="text-yellow-500">
                {{ practiceSignUps && practiceSignUps.organic_practice_registrations ? practiceSignUps.organic_practice_registrations : 0 }}
              </span>
            </div>
            <div class="text-sm text-gray-300">
              <span>
                Referred by Other Locums
              </span>
              <span class="text-yellow-500">
                {{ practiceSignUps && practiceSignUps.referred_by_locum_count ? practiceSignUps.referred_by_locum_count : 0 }}
              </span>
            </div>
            <div class="text-sm text-gray-300">
              <span>
                Referred by Other Practices
              </span>
              <span class="text-yellow-500">
                {{ practiceSignUps && practiceSignUps.referred_by_practice_count ? practiceSignUps.referred_by_practice_count : 0 }}
              </span>
            </div>
          </div>
        </div>
        <!-- SUCCESSFUL REFERRERS -->
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-4">
            <div class="text-xs text-gray-500">
              Referrers with Successful Referrals
            </div>
            <div class="text-sm text-gray-300">
              <span>
                Locums
              </span>
              <span class="text-yellow-500">
                {{ successfulReferrals && successfulReferrals.locum_referees ? successfulReferrals.locum_referees : 0 }}
              </span>
            </div>
            <div class="text-sm text-gray-300">
              <span>
                Practices
              </span>
              <span class="text-yellow-500">
                {{ successfulReferrals && successfulReferrals.practice_referees ? successfulReferrals.practice_referees : 0 }}
              </span>
            </div>
          </div>
        </div>
        <!-- BILLING TOTALS -->
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-4">
            <div class="text-xs text-gray-500">
              Billing
            </div>
            <div class="font-bold">
              <span>
                Total Approved Hours
              </span>
              <span class="text-yellow-500">
                {{ billingTotals && billingTotals.approved_total_hours_formatted ? billingTotals.approved_total_hours_formatted.toFixed(0) + ' Hours' : 0 }}
              </span>
            </div>
            <div class="font-bold">
              <span>
                Completed Hours
              </span>
              <span class="text-yellow-500">
                {{ billingTotals && billingTotals.total_completed_final_hours_formatted ? billingTotals.total_completed_final_hours_formatted.toFixed(0) + ' Hours' : 0 }}
              </span>
            </div>
            <div class="font-bold">
              <span>
                Billed Hours
              </span>
              <span class="text-yellow-500">
                {{ billingTotals && billingTotals.billed_total_hours_formatted ? billingTotals.billed_total_hours_formatted.toFixed(0) + ' Hours' : 0 }}
              </span>
            </div>
            <div class="font-bold">
              <span>
                Revenue
              </span>
              <span class="text-yellow-500">
                {{ billingTotals && billingTotals.total_revenue ? billingTotals.total_revenue : 0 | currency }}
              </span>
            </div>
            <div class="font-bold">
              <span>
                VAT
              </span>
              <span class="text-yellow-500">
                {{ billingTotals && billingTotals.total_taxes ? billingTotals.total_taxes : 0 | currency }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-row w-full ">
        <!-- LOCUMS IN PLATFORM -->
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-4">
            <div class="text-xs text-gray-500">
              Locums
            </div>
            <div class="font-bold">
              <span>
                Active Locums
              </span>
              <span class="text-yellow-500">
                {{ locumsInPlatform.active_locums }}
              </span>
            </div>
            <div 
              v-for="(locumCountsByProfession, index) in locumsInPlatform.active_locums_by_profession"
              :key="`user-${index}`"
              class="mx-2 text-sm text-gray-300"
            >
              <div>
                <span>
                  {{ locumCountsByProfession.name }}
                </span>
                <span class="text-yellow-500">
                  {{ locumCountsByProfession.locum_count }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- PRACTICES IN PLATFORM -->
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-4">
            <div class="text-xs text-gray-500">
              Practices
            </div>
            <div class="font-bold">
              <span>
                Active Practices
              </span>
              <span class="text-yellow-500">
                {{ practicesInPlatform.active_practices }}
              </span>
            </div>
            <div 
              v-for="(practiceCounts, index) in practicesInPlatform.practices_by_type"
              :key="`user-${index}`"
              class="mx-2 text-sm"
            >
              <div>
                <span>
                  {{ practiceCounts.type }}
                </span>
                <span class="text-yellow-500">
                  {{ practiceCounts.count }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- JOBS IN PLATFORM -->
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-4">
            <div class="text-xs text-gray-500">
              Jobs
            </div>
            <div class="font-bold">
              <span>
                Platform Jobs
              </span>
              <span class="text-yellow-500">
                {{ jobsInPlatform.platform_jobs }}
              </span>
            </div>
            <div 
              v-for="(jobCountsByStatus, index) in jobsInPlatform.job_counts_by_status"
              :key="`user-${index}`"
              class="mx-2 text-sm"
            >
              <div>
                <span>
                  {{ jobCountsByStatus.status }}
                </span>
                <span class="text-yellow-500">
                  {{ jobCountsByStatus.count }}
                </span>
              </div>
            </div>
            <div class="font-bold">
              <span>
                Private Jobs
              </span>
              <span class="text-yellow-500">
                {{ jobsInPlatform.private_jobs }}
              </span>
            </div>
          </div>
        </div>
        <!-- DISPUTES -->
        <div class="flex-1 rounded m-2 bg-charade">
          <div class="m-4">
            <div class="text-xs text-gray-500">
              Job Disputes
            </div>
            <div class="font-bold">
              <span>
                Disputes
              </span>
              <span class="text-yellow-500">
                {{ jobDisputes.disputes_count }}
              </span>
            </div>
            <div 
              v-for="(disputesCountByStatus, index) in jobDisputes.disputes_count_by_status"
              :key="`user-${index}`"
              class="mx-2 text-sm"
            >
              <div>
                <span>
                  {{ disputesCountByStatus.status }}
                </span>
                <span class="text-yellow-500">
                  {{ disputesCountByStatus.count }}
                </span>
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
import AppLoading from "@/components/Base/AppLoading"
export default {
  components: {
    AppInput,
    AppButton,
    AppDate,
    AppPostCode,
    AppLoading,
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
  created () {
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
        console.log('tapos na')
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