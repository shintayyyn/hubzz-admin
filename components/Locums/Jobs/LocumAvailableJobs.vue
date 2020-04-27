<template>
	<div>
		<div class="overflow-x-auto overflow-y-hidden">
			<div v-if="availableJobs.length == 0">
				<div
					class="mt-10 w-full text-white text-center"
					style="font-family: Nunito"
				>This locum has no available jobs.</div>
			</div>
			<div v-else>
				<AppJobHeaderSort :locumUser="user" :locumTabStatus="'Available'" :currentPage="currentPage" />
				<div class="w-full overflow-x-auto">
					<!-- HEADER -->
					<!-- <div class="w-full hidden md:flex text-sm lg:text-base font-bold mt-4 mb-2"> 
              <div class="w-1/6">Job Number</div> 
              <div class="w-1/6">Practice / Surgery</div>
              <div class="w-1/6">Title</div>
              <div class="w-1/6">From</div>
              <div class="w-1/6">To</div>
              <div class="w-1/6">Created</div>
					</div>-->
					<!-- BODY -->
					<div
						v-for="(item, index) in availableJobs"
						:key="`item-${index}`"
						class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light"
						@click="
              $router.push(
                `/locums/${user.id}/locum-jobs/locum-available-jobs/${item.id}`
              )
            "
					>
						<div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
							<strong class="block md:hidden text-sm uppercase">Job Number</strong>
							<span class>{{ item.job_number }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
							<span class>
								{{
								item.platform_job.practice.surgery.name
								}}
							</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">Title</strong>
							<span class>{{ item.title ? item.title : '(none)' }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">From</strong>
							<span
								class
							>{{ $moment(item.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') +' | '+ item.time_start }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">To</strong>
							<span
								class
							>{{ $moment(item.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY') +' | '+ item.time_end }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">Created</strong>
							<span
								class
							>{{ $moment(item.date_created, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }}</span>
						</div>
					</div>
				</div>
			</div>
			<div class>
				<AppPagination
					:total="total"
					:totalPages="totalPages"
					:currentPage="currentPage"
					:perPage="perPage"
					@pagechanged="pagechanged"
				/>
			</div>

			<div v-if="modal" class="job-shield" />
			<transition name="slide" mode="out-in">
				<div v-if="modal" class="job-modal shadow-lg">
					<LocumDetailJobModal :job="job" @close="modal = false" />
				</div>
			</transition>
		</div>
	</div>
</template>
<script>
import AppPagination from "@/components/Base/AppPagination";
import LocumDetailJobModal from "@/components/Locums/Jobs/LocumDetailJobModal";
import AppJobHeaderSort from "@/components/Base/AppJobHeaderSort";
export default {
	components: {
		AppPagination,
		LocumDetailJobModal,
		AppJobHeaderSort
	},
	props: ["user"],
	data() {
		return {
			// availableJobs: [],
			// total: 0,
			matchedJobs: [],
			totalPages: 0,
			currentPage: 1,
			perPage: 10,
			ascendDescend: 0,
			modal: false
		};
	},
	computed: {
		total() {
			return this.$store.state.jobs.locum_available_jobs_count;
		},
		availableJobs() {
			return this.$store.state.jobs.locum_available_jobs;
		}
	},
	watch: {
		$route(to) {
			this.currentPage = parseInt(to.query.available_job_page);
			this.getAvailableJobs();
		}
	},
	beforeDestroy() {
		let query = Object.assign({}, this.$route.query);
		delete query.available_job_page;
		this.$router.push({ query });
	},
	async created() {
		await this.$store.commit("jobs/TOGGLE_LOADING", true);
		const query = {
			...this.$route.query,
			available_job_page: this.$route.query.available_job_page || 1
		};
		this.currentPage = parseInt(query.available_job_page);
		let params = {
			viewing_locum_user_id: this.user.id,
			locum_status: ["Available", "Matched"],
			type: "Platform"
		};
		console.log(params);
		Promise.all([
			this.$axios.$get(`/api/v1/admin/jobs/count`, { params }).then(res => {
				// this.total = res.data.count
				this.$store.commit(
					"jobs/SET_LOCUM_AVAILABLE_JOBS_COUNT",
					res.data.count
				);
				this.perPage = 10;
				this.totalPages = Math.ceil(this.total / this.perPage);
			})
		]).then(() => {
			this.getAvailableJobs();
		});
	},
	methods: {
		async getAvailableJobs(orderBy) {
			let offset =
				this.perPage * (parseInt(this.$route.query.available_job_page) - 1);
			let params = {
				viewing_locum_user_id: this.user.id,
				locum_status: ["Available", "Matched"],
				order_by: orderBy ? orderBy : this.$route.query.order_by,
				limit: this.perPage,
				offset: offset,
				type: "Platform"
			};

			await this.$axios.$get(`/api/v1/admin/jobs`, { params }).then(res => {
				console.log("params", params);
				this.$store.commit("jobs/SET_LOCUM_AVAILABLE_JOBS", res.data.jobs);
				this.$store.commit("jobs/TOGGLE_LOADING", false);
				console.log("available jobs", this.availableJobs);
			});
		},

		async pagechanged(e) {
			const query = {
				...this.$route.query,
				available_job_page: e || 1
			};
			await this.$store.commit("jobs/TOGGLE_LOADING", true);
			await this.$router.push({ query });
			await this.$store.commit("jobs/TOGGLE_LOADING", false);
		}
	}
};
</script>
