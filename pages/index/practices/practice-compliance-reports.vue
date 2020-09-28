<template>
  <div class="flex-1 flex flex-col p-2">
    <div class="flex flex-col">
      <nuxt-link
        v-for="practiceComplianceReport in practiceComplianceReports"
        :key="`practiceComplianceReports-${practiceComplianceReport.title}`"
        :to="practiceComplianceReport.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg bg-waterloo hover:bg-waterloo-light transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm text-white w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ practiceComplianceReport.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ practiceComplianceReport.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="white" />
          </div>
        </div>
      </nuxt-link>
    </div>
    <nuxt-link
      v-if="$route.name !== 'index-practices-practice-compliance-reports'"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/practices/practice-compliance-reports"
    />

    <nuxt-child />
  </div>
</template>

<script>
export default {
  data () {
    return {
      practiceComplianceReports: [
        {
          title: 'REP-018',
          subtitle: 'Practice Lead Time for Activation',
          url: '/practices/practice-compliance-reports/activated-practices',
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
      const authAdminpermissions = store.getters["permissions"]

      if (authAdminpermissions.includes('View Reports') === false) {
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

<style>
  .report-modal {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 0%;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-left: solid 2px #ffc72c;
    transition: all 0.3s ease-in-out;
    background-color: #505561;
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .report-modal {
      width: 80%;
    }
  }

  .page-overlap {
    min-width: 100%;
  }

  @media screen and (min-width: 768px) {
    .page-overlap {
      min-width: calc(100% - 70px);
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap {
      min-width: calc(100% - 200px);
    }
  }
</style>
