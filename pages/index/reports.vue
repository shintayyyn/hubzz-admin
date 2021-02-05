<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6 mx-1">
    <!-- <div class="text-sm md:text-xl text-white">
      Compliance Reports
    </div>

    <div class="flex flex-col">
      <nuxt-link
        v-for="complianceReport in complianceReports"
        :key="`complianceReports-${complianceReport.title}`"
        :to="complianceReport.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg bg-waterloo hover:bg-waterloo-light transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm text-white w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ complianceReport.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ complianceReport.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="white" />
          </div>
        </div>
      </nuxt-link>
    </div> -->

    <div class="text-sm md:text-xl text-gray-800">
      HQ Analytics
    </div>

    <div class="flex flex-col">
      <nuxt-link
        v-for="hqAnalyticsReport in hqAnalyticsReports"
        :key="`hqAnalyticsReports-${hqAnalyticsReport.title}`"
        :to="hqAnalyticsReport.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg shadow-lg hover:bg-gray-400 transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ hqAnalyticsReport.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ hqAnalyticsReport.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="white" />
          </div>
        </div>
      </nuxt-link>
    </div>

    <!-- <div class="text-sm md:text-xl text-white">
      Pricing Reports
    </div>

    <div class="flex flex-col">
      <nuxt-link
        v-for="pricingReport in pricingReports"
        :key="`pricingReports-${pricingReport.title}`"
        :to="pricingReport.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg bg-waterloo hover:bg-waterloo-light transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm text-white w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ pricingReport.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ pricingReport.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="white" />
          </div>
        </div>
      </nuxt-link>
    </div> -->

    <nuxt-link
      v-if="$route.name !== 'index-reports'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/reports"
    />

    <nuxt-child />
  </div>
</template>

<script>
	export default {
		data () {
			return {
        hqAnalyticsReports: [
          {
            title: 'REP-019',
            subtitle: 'Locums in an Area',
            url: '/reports/locums-in-an-area',
          },
          {
            title: 'REP-020',
            subtitle: 'Locum Referrals',
            url: '/reports/locum-referrals',
          },
          {
            title: 'REP-021',
            subtitle: 'Locum Practice Referrals',
            url: '/reports/locum-practice-referrals',
          },
          {
            title: 'REP-022',
            subtitle: 'Bogus Registrations',
            url: '/reports/bogus-registrations',
          },
          {
            title: 'REP-023',
            subtitle: 'Locums Declined',
            url: '/reports/declined-jobs',
          },
          {
            title: 'REP-024',
            subtitle: 'Practice Cancellations',
            url: '/reports/cancelled-jobs',
          },
          {
            title: 'REP-025',
            subtitle: 'Jobs not Filled',
            url: '/reports/unfilled-jobs',
          },
          {
            title: 'REP-026',
            subtitle: 'Sign Ups Locums',
            url: '/reports/registered-locums',
          },
          {
            title: 'REP-027',
            subtitle: 'Sign Ups Practice',
            url: '/reports/registered-practices',
          },
          {
            title: 'REP-028',
            subtitle: 'Session Notifications',
            url: '/reports/job-parts',
          },
          {
            title: 'REP-029',
            subtitle: 'Locum Usage',
            url: '/reports/locum-usages',
          },
          {
            title: 'REP-032',
            subtitle: 'Practice Disputes',
            url: '/reports/practice-disputes',
          },
        ],
			}
    },
    computed : {
      authAdminPermissions () {
        return this.$store.getters["permissions"]
      },
    },
    async asyncData ({ store, error }) {
      try {
        const authAdminPermissions = store.getters["permissions"]

        if (authAdminPermissions.includes('View Reports') === false) {
          error({
            statusCode: 403,
            message: 'You are not authorized to view this page.',
          })
          return
        }

      } catch(err) {
        error({ statusCode: 404 })
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!"
        })
      }
    }
	}
</script>
