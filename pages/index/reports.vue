<template>
	<div class="flex-1 flex flex-col py-2 px-4 md:px-6">

		<div class="text-xl md:text-4xl text-white">Reports</div>

		<div class="text-sm mb-4 text-white">Work in progress.</div>

		<div class="flex flex-col">
			<nuxt-link
				v-for="(report, index) in reports"
				:key="`report-${index}`"
				:to="`/reports/${report.id}`"
				class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg bg-waterloo hover:bg-waterloo-light transition-hover my-2"
			>
				<div class="flex flex-no-wrap text-sm text-white w-full">
					<span class="px-2 whitespace-no-wrap font-semibold">{{ report.code }}</span>
					<span class="px-2 w-full leading-tight">{{ report.description }}</span>
					<div class="flex items-center px-1 md:px-0">
						<svgicon name="arrow-right" width="21" height="21" color="white"></svgicon>
					</div>
				</div>
			</nuxt-link>

			<nuxt-link to="/reports/locums-in-an-area" class="inline-flex no-underline w-full py-2 md:p-3 rounded-lg bg-waterloo hover:bg-waterloo-light transition-hover my-2">
				<div class="flex flex-no-wrap text-sm text-white w-full">
					<span class="px-2 whitespace-no-wrap font-semibold">REP-019</span>
					<span class="px-2 w-full leading-tight">Locums in an Area</span>
					<div class="flex items-center px-1 md:px-0">
						<svgicon name="arrow-right" width="21" height="21" color="white"></svgicon>
					</div>
				</div>
			</nuxt-link>
		</div>

		<nuxt-link class="bg-shield z-511 fixed inset-0 opacity-50" v-if="$route.name !== 'index-reports'" to="/reports"></nuxt-link>

		<nuxt-child />

	</div>
</template>

<script>
	export default {
		data() {
			return {
				reports: [] || [
					{
						id: "1",
						code: "REP-001",
						description: "Invoices paid / unpaid"
					},
					{
						id: "2",
						code: "REP-002",
						description:
							"Tax report information - Money earnt and Tax and NI paid"
					},
					{
						id: "3",
						code: "REP-002",
						description: "Practices worked for"
					},
					{
						id: "4",
						code: "REP-002",
						description: "Practices that cancel jobs"
					},
					{
						id: "5",
						code: "REP-002",
						description: "How many Locums are signed-up in the area"
					}
				]
			};
		},

	}
</script>
