<template>
  <div class="flex-1 flex flex-col p-2">
    <div v-if="$route.name === 'index-billings-index-hubzz-pricing-reports'" class="flex flex-col">
      <nuxt-link
        v-for="pricingReport in pricingReports"
        :key="`pricingReports-${pricingReport.title}`"
        :to="pricingReport.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg shadow-lg transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ pricingReport.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ pricingReport.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="black" />
          </div>
        </div>
      </nuxt-link>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
export default {
  data (){
    return{
      pricingReports: [
          {
            title: 'REP-030',
            subtitle: 'Hours Approved',
            url: '/billings/hubzz-pricing-reports/locum-invoice-job-parts',
          },
          {
            title: 'REP-031',
            subtitle: 'Invoices',
            url: '/billings/hubzz-pricing-reports/practice-invoice-items',
          },
        ],
    }
  }

}
</script>
