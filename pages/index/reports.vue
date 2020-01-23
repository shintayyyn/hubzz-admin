<template>
	<div class="flex-1 flex flex-col py-2 px-4 md:px-6">
		<div class="text-xl md:text-4xl text-white">Reports</div>

		<div class="flex flex-col">
			<nuxt-link
				v-for="report in reports"
				:index="`reports-${report.title}`"
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
						title: 'REP-01',
						subtitle: 'Tax and NI Deductions',
						url: '/reports/deductions',
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
