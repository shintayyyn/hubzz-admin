<template>
	<div class="flex-1 flex flex-col py-2 px-4 md:px-6 overflow-auto">
		<div class="text-2xl md:text-4xl text-white">Billing</div>
		<div class="text-sm mb-4 text-white">Work in progress.</div>
		<div class="flex">
			<div class="flex">
				<nuxt-link
					to="/billings/addinvoice"
					class="inline-flex no-underline py-2 px-4 my-1 md:mb-2 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow"
					>Add Invoice</nuxt-link
				>
			</div>
		</div>

		<!-- TABLE RESPONSIVE-->
			<div v-if="practiceCount <= 0" class="text-white py-2">
				No invoice available at the moment.
			</div>
			<!-- HEADER -->
			<div
				class="hidden md:flex items-center text-white justify-around font-semibold"
				v-if="practiceCount > 0"
			>
				<div class="flex-1 align-middle px-2 text-center">
					Practice / Surgery
				</div>
				<div class="flex-1 align-middle px-2 text-center">Created</div>
				<div class="flex-1 align-middle px-2 text-center">Issued</div>
				<div class="flex-1 align-middle px-2 ">Job Numbers</div>
				<div class="flex-1 align-middle px-2 text-center">£ Amount</div>
				<div class="flex-1 align-middle px-2 text-center">Status</div>
			</div>
			<!-- END HEADER -->
			<!-- BODY -->
			<nuxt-link
				v-for="(practice, index) in practices"
				:key="`billing-${index}`"
				:to="`/billings/${practice.id}`"
				class="flex flex-col cursor-pointer md:flex-row px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light transition-hover"
				draggable="false"
			>
				<div class="flex flex-col md:justify-center md:w-1/6 p-1 md:p-2 align-middle leading-none">
          <strong class="block md:hidden text-xs uppercase">Practice Name</strong>
          <span>{{ practice.surgery ? practice.surgery.name:null }}</span>
        </div>

        <div class="flex flex-col md:justify-center md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center">
          <strong class="block md:hidden text-xs uppercase">Expires</strong>
          <span>{{ practice && practice.actived_until ?  $moment(practice.actived_until).format('MMM D, YYYY | hh:mm A'): 'Unavailable' }}</span>
        </div>

        <div class="flex flex-col md:justify-center md:items-center sm:w-1/2 md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center">
          <strong class="block md:hidden text-xs uppercase pb-1">Status</strong>
          <span class="inline-flex justify-center no-underline px-8 py-2 text-sm text-white rounded-full shadow w-32 min-w-0"
          :class="`${practice.status === 'Active' ? 'bg-green-500' : 'bg-gray-500 text-gray-700'}`">{{ practice.status }}</span>
        </div>

        <div class="flex flex-col md:justify-center md:items-center sm:w-1/2 md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center">
          <strong class="block md:hidden text-xs uppercase pb-1">Type</strong>
          <span class="inline-flex justify-center no-underline px-4 py-2 w-32 min-w-0 text-sm rounded-full shadow whitespace-no-wrap"
          :class="typeStyle(practice.type)">{{ practice.type }}</span>
        </div>
			</nuxt-link>
			<!-- END BODY -->
		<!-- END TABLE -->
		<div
			class="billing-shield"
			v-if="
				$route.name.includes('index-billings-id') ||
					$route.name.includes('index-billings-addinvoice')
			"
			@click="$router.push(`/billings`)"
		></div>
		<nuxt-child />
	</div>
</template>

<script>
export default {
	data() {
		return {
			// toBeInvoicedCount: "",
			// practicesToBeInvoiced: [],
			// practiceInvoicesCount: "",
			// practiceInvoices: [],
      // invoiced: true
      practiceCount:0,
      practices:[]
		};
	},
	async asyncData({ app, route, store }) {
		try {
			let response = await app.$axios.$get(`/api/v1/admin/practices/count`);
      const practiceCount = response.data.count
      console.log('practicecount', practiceCount)
      response = await app.$axios.$get(`/api/v1/admin/practices`)
      const practices = response.data.practices
      console.log('practices', practices)
			return {
        practiceCount,
        practices
			};
		} catch (err) {
			error({ statusCode: 404 });
			console.log("Get practices error!", err);
		}
	},
	methods: {
		goToPage(page) {
			if (page < 1) {
				return;
			}

			if (page > this.pageCount) {
				return;
			}

			const query = {
				...this.$router.query,
				page
			};

			if (page === 1) {
				delete query.page;
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true;
			}

			this.$router.push({ query });
		},

		searchSubmit() {
			const query = {
				...this.$router.query
			};

			delete query.page;

			query.search = this.search;

			if (this.search === "") {
				delete query.search;
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true;
			}

			this.$router.push({ query });
		},

		sortData: function(toSortBy) {
			if ((toSortBy = this.sortBy)) {
				this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
			}
			this.sortBy = toSortBy;
		},

    typeStyle(status){
      switch(status){
        case 'Hub':
          return 'bg-red-500 text-white lg:px-8 sm:px-2'
          break;
        case 'Spoke':
          return 'bg-blue-500 text-white lg:px-8 sm:px-2'
          break;
        case 'Stand Alone':
          return 'bg-indigo-600 text-white lg:px-8 sm:px-2'
          break;
        default:
          return
      }
    },

		statusStyle(status) {
			switch (status) {
				case "Active":
					return "bg-green text-white lg:px-8 sm:px-2";
					break;
				case "Inactive":
					return "bg-yellow text-black lg:px-8 sm:px-2";
					break;
				case "Deactivated":
					return "bg-gray text-black lg:px-8 sm:px-2";
					break;
				case "Suspended":
					return "bg-red text-white lg:px-8 sm:px-2";
					break;
				case "Dormant":
					return "bg-green-darker text-white lg:px-8 sm:px-2";
					break;
				default:
					return;
			}
		},
		complianceStatusStyle(status) {
			switch (status) {
				case "Empty":
					return "border border-white text-white lg:px-8 sm:px-2";
					break;
				case "Incomplete":
					return "bg-yellow-300 text-black lg:px-8 sm:px-2";
					break;
				case "Pending":
					return "bg-yellow text-black lg:px-8 sm:px-2";
					break;
				case "Expiring":
					return "bg-yellow text-black lg:px-8 sm:px-2";
					break;
				case "Expired":
					return "bg-red text-white lg:px-8 sm:px-2";
					break;
				case "Rejected":
					return "bg-yellow-dark text-black lg:px-8 sm:px-2";
					break;
				case "Compliant":
					return "bg-green text-white lg:px-8 sm:px-2";
					break;
				default:
					return;
			}
		}
	}
};
</script>

<style>
.md\:table-cell:first-child {
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}
.md\:table-cell:last-child {
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}
</style>
