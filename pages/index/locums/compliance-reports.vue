<template>
  <div class="flex-1 flex flex-col py-2 px-4 md:px-6">
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
    </div>
    <nuxt-link
      v-if="$route.name !== 'index-locums-compliance-reports'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/locums/compliance-reports"
    />

    <nuxt-child />
  </div>
</template>

<script>
export default {
  data () {
    return {
      complianceReports: [
        {
          title: 'REP-015',
          subtitle: 'Onboarding - Documents Uploaded',
          url: '/locums/compliance-reports/locum-uploaded-documents',
        },
        {
          title: 'REP-016',
          subtitle: 'Expiry Report',
          url: '/locums/compliance-reports/locum-expiring-compliance-documents',
        },
        {
          title: 'REP-017',
          subtitle: 'Locum Lead Time for Compliance Completed',
          url: '/locums/compliance-reports/locum-completed-compliances',
        },
        // {
        //   title: 'REP-018',
        //   subtitle: 'Practice Lead Time for Activation',
        //   url: '/locums/compliance-reports/activated-practices',
        // },
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
