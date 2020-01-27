<template>
	<div class="flex-1 flex flex-col py-2 px-4 md:px-6">
		<div class="text-xl md:text-4xl text-white">Reports</div>

    <div class="text-sm md:text-xl text-white">Practice Reports</div>

		<div class="flex flex-col">
			<nuxt-link
				v-for="practiceReport in practiceReports"
				:key="`practiceReports-${practiceReport.title}`"
				:to="practiceReport.url"
				class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg bg-waterloo hover:bg-waterloo-light transition-hover my-2"
			>
				<div class="flex flex-no-wrap items-center text-sm text-white w-full">
					<span class="px-2 whitespace-no-wrap font-semibold">{{ practiceReport.title }}</span>
					<span class="px-2 w-full leading-tight flex items-center">{{ practiceReport.subtitle }}</span>
					<div class="flex items-center px-1 md:px-0">
						<svgicon name="arrow-right" width="21" height="21" color="white"></svgicon>
					</div>
				</div>
			</nuxt-link>
		</div>

    <div class="text-sm md:text-xl text-white">Locum Reports</div>

    <div class="flex flex-col">
      <nuxt-link
        v-for="locumReport in locumReports"
        :key="`locumReports-${locumReport.title}`"
        :to="locumReport.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg bg-waterloo hover:bg-waterloo-light transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm text-white w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ locumReport.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ locumReport.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="white"></svgicon>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div class="text-sm md:text-xl text-white">Compliance Reports</div>

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
            <svgicon name="arrow-right" width="21" height="21" color="white"></svgicon>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div class="text-sm md:text-xl text-white">HQ Analytics</div>

    <div class="flex flex-col">
      <nuxt-link
        v-for="hqAnalyticsReport in hqAnalyticsReports"
        :key="`hqAnalyticsReports-${hqAnalyticsReport.title}`"
        :to="hqAnalyticsReport.url"
        class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg bg-waterloo hover:bg-waterloo-light transition-hover my-2"
      >
        <div class="flex flex-no-wrap items-center text-sm text-white w-full">
          <span class="px-2 whitespace-no-wrap font-semibold">{{ hqAnalyticsReport.title }}</span>
          <span class="px-2 w-full leading-tight flex items-center">{{ hqAnalyticsReport.subtitle }}</span>
          <div class="flex items-center px-1 md:px-0">
            <svgicon name="arrow-right" width="21" height="21" color="white"></svgicon>
          </div>
        </div>
      </nuxt-link>
    </div>

		<nuxt-link
			class="bg-shield z-511 fixed inset-0 opacity-50"
			v-if="$route.name !== 'index-reports'"
			to="/reports"
		></nuxt-link>

		<nuxt-child />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				practiceReports: [
					{
						title: 'REP-001',
						subtitle: 'Tax and NI Deductions',
						url: '/reports/deductions',
					},
					{
						title: 'REP-002',
						subtitle: 'Payments',
						url: '/reports/payments',
					},
					{
						title: 'REP-003',
						subtitle: 'Pension Contributions',
						url: '/reports/pension-contributions',
					},
					{
						title: 'REP-004',
						subtitle: 'Locums on System',
						url: '/reports/locums',
					},
          {
            title: 'REP-005',
            subtitle: 'Locums Used/Bank',
            url: '/reports/practice-locums',
          },
          {
            title: 'REP-006',
            subtitle: 'Locums Not Successful',
            url: '/reports/practice-unsuccessful-locums',
          },
          {
            title: 'REP-007',
            subtitle: 'Locums that have Declined',
            url: '/reports/practice-declined-locums',
          },
          {
            title: 'REP-008',
            subtitle: 'Compliance - Expiring',
            url: '/reports/locum-compliance-documents',
          },
          {
            title: 'REP-009',
            subtitle: 'Locums that Arrive Late',
            url: '/reports/practice-late-locums',
          },
          {
            title: 'REP-010',
            subtitle: 'Hubzz Invoices',
            url: '/reports/practice-invoices',
          },
				],
        locumReports: [
          {
            title: 'REP-011',
            subtitle: 'NHS Pension Contributions',
            url: '/reports/locum-pension-contributions',
          },
          {
            title: 'REP-012',
            subtitle: 'Tax Reporting - Money Earnt and Tax and NI Paid',
            url: '/reports/locum-invoices',
          },
          {
            title: 'REP-013',
            subtitle: 'Practices Worked',
            url: '/reports/locum-practices',
          },
          {
            title: 'REP-014',
            subtitle: 'Expenses',
            url: '/reports',
          },
        ],
        complianceReports: [
          {
            title: 'REP-015',
            subtitle: 'Onboarding - Documents Uploaded',
            url: '/reports/locum-uploaded-documents',
          },
          {
            title: 'REP-016',
            subtitle: 'Expiry Report',
            url: '/reports/locum-expiring-compliance-documents',
          },
        ],
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
        ],
			}
		},

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

  @media (min-width: 450px) {
    .right-side-header-content {
      width: calc(100% - 0px);
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
