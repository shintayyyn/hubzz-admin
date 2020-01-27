<template>
	<div class="flex-1 flex flex-col py-2 px-4 md:px-6">
		<div class="text-xl md:text-4xl text-white">Reports</div>

		<div class="flex flex-col">
			<nuxt-link
				v-for="report in reports"
				:key="`reports-${report.title}`"
				:to="report.url"
				class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg bg-waterloo hover:bg-waterloo-light transition-hover my-2"
			>
				<div class="flex flex-no-wrap items-center text-sm text-white w-full">
					<span class="px-2 whitespace-no-wrap font-semibold">{{ report.title }}</span>
					<span class="px-2 w-full leading-tight flex items-center">{{ report.subtitle }}</span>
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
				reports: [
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
