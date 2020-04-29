<template>
	<div>
		<div class="overflow-x-auto overflow-y-hidden">
			<div v-if="completedJobParts.length === 0">
				<div class="mt-10 w-full text-center text-white">This practice has no completed session/s.</div>
			</div>
			<div v-else>
				<AppJobHeaderSort
					:practice="practice"
					:tabStatus="'Completed'"
					:currentPage="currentPage"
					:isJobParts="true"
				/>
				<div class="w-full overflow-x-auto">
					<!-- HEADER -->
					<!-- BODY -->
					<nuxt-link
						v-for="(item, index) in completedJobParts"
						:key="`item-${index}`"
						:to="checkRoute(item.id)"
						class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light"
						draggable="false"
					>
						<div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
							<strong class="block md:hidden text-sm uppercase">Job Number</strong>
							<span class>{{ item.job_part_number }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
							<span class>{{ item.job.platform_job.practice.surgery.name }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">Title</strong>

							<span
								:class="item.job.title && item.job.title.split(' ') && item.job.title.split(' ').length > 1 ? 'double-truncate' : 'block truncate'"
							>{{ item.job.title ? item.job.title : '(none)' }}</span>
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
							<strong class="block md:hidden text-sm uppercase">Created At</strong>
							<span
								class
							>{{ $moment(item.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">Completed At</strong>
							<span
								class
							>{{ $moment(item.completed_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }}</span>
						</div>
						<div
							class="flex items-center md:flex-col md:justify-center w-1/2 md:w-64 px-1 xl:px-2 py-2 leading-tight align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase whitespace-no-wrap">Invoice Status</strong>
							<div
								class="py-2 px-4 rounded-lg whitespace-no-wrap text-center mx-2"
								:class="invoiceStatusStyle(item.invoice_status)"
							>{{ item.invoice_status }}</div>
						</div>
					</nuxt-link>
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
					<PracticeSessionModal :job="job" @close="modal = false" />
				</div>
			</transition>
		</div>
	</div>
</template>
<script>
import AppPagination from "@/components/Base/AppPagination";
import PracticeSessionModal from "@/components/Practices/Sessions/PracticeSessionModal";
import AppJobHeaderSort from "@/components/Base/AppJobHeaderSort";
export default {
	components: {
		AppPagination,
		PracticeSessionModal,
		AppJobHeaderSort
	},

	props: {
		practice: {
			type: Object,
			default: () => null
		},

		practiceSurgery: {
			type: Object,
			default: () => null
		}
	},

	data() {
		return {
			// completedJobParts:[],
			// total:0,
			totalPages: 0,
			currentPage: 1,
			perPage: 0,
			ascendDescend: 0,
			modal: false
		};
	},
	computed: {
		total() {
			return this.$store.state.jobs.practice_completed_sessions_count;
		},
		completedJobParts() {
			return this.$store.state.jobs.practice_completed_sessions;
		}
	},
	watch: {
		$route(to) {
			this.currentPage = parseInt(to.query.completed_job_page);
			this.getCompletedJobs();
		}
	},
	beforeDestroy() {
		let query = Object.assign({}, this.$route.query);
		delete query.completed_job_page;
		this.$router.push({ query });
	},
	async created() {
		await this.$store.commit("jobs/TOGGLE_LOADING", true);
		const query = {
			...this.$route.query,
			completed_job_page: this.$route.query.completed_job_page || 1
		};
		this.currentPage = parseInt(query.completed_job_page);
		let params = {
			job_practice_id: this.practiceSurgery
				? this.practiceSurgery.child_practice_id
				: this.practice.id,
			status: "Completed"
		};
		Promise.all([
			this.$axios
				.$get(`/api/v1/admin/job-parts/count`, { params })
				.then(res => {
					// this.total = res.data.count
					this.$store.commit(
						"jobs/SET_PRACTICE_COMPLETED_SESSIONS_COUNT",
						res.data.count
					);
					this.perPage = 10;
					this.totalPages = Math.ceil(this.total / this.perPage);
				})
		]).then(() => {
			this.getCompletedJobs("date_created:desc"),
				console.log(this.completedJobParts);
		});
	},
	methods: {
		checkRoute(itemId) {
			if (this.$route.name.includes("practice-surgeries")) {
				return {
					path: `/practices/${this.practice.id}/practice-surgeries/${this.practiceSurgery.id}/surgery-sessions/surgery-completed-sessions/${itemId}`
				};
			} else if (this.$route.name.includes("practice-sessions")) {
				return {
					path: `/practices/${this.practice.id}/practice-sessions/practice-completed-sessions/${itemId}`
				};
			}
		},
		async getCompletedJobs(orderBy) {
			let offset =
				this.perPage * (parseInt(this.$route.query.completed_job_page) - 1);
			let params = {
				status: "Completed",
				order_by: orderBy ? orderBy : this.$route.query.order_by,
				job_practice_id: this.practiceSurgery
					? this.practiceSurgery.child_practice_id
					: this.practice.id,
				limit: this.perPage,
				offset: offset
			};
			await this.$axios
				.$get(`/api/v1/admin/job-parts`, { params })
				.then(res => {
					// this.completedJobParts = res.data.jobs
					this.$store.commit(
						"jobs/SET_PRACTICE_COMPLETED_SESSIONS",
						res.data.job_parts
					);
					this.$store.commit("jobs/TOGGLE_LOADING", false);
				})
				.catch(err => {
					console.log("get completed jobs error!!!", err);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					});
				});
		},
		invoiceStatusStyle(status) {
			switch (status) {
				case "To Be Invoice":
					return "bg-yellow-500 text-black";
				case "Disputed":
					return "bg-red-500 text-white";
				case "Invoiced":
					return "bg-green-500 text-white opacity-75";
			}
		},
		async pagechanged(e) {
			const query = {
				...this.$route.query,
				completed_job_page: e || 1
			};
			await this.$store.commit("jobs/TOGGLE_LOADING", true);
			await this.$router.push({ query });
			await this.$store.commit("jobs/TOGGLE_LOADING", false);
		}
	}
};
</script>
