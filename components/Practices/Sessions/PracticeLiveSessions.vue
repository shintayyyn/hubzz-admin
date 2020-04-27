<template>
	<div>
		<div class="overflow-x-auto overflow-y-hidden">
			<div v-if="availableJobs.length == 0">
				<div class="mt-10 w-full text-center text-white">This practice has no available session/s.</div>
			</div>
			<div v-else>
				<AppJobHeaderSort :practice="practice" :tabStatus="'Live'" :currentPage="currentPage" />
				<div class="w-full">
					<nuxt-link
						v-for="(item, index) in availableJobs"
						:key="`item-${index}`"
						:to="checkRoute(item.id)"
						class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light"
						draggable="false"
					>
						<div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
							<strong class="block md:hidden text-sm uppercase">Job Number</strong>
							<span class>{{ item.job_number }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
							<span>{{ item.platform_job.practice.surgery.name }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">Title</strong>
							<span
								:class="item.title && item.title.split(' ') && item.title.split(' ').length > 1 ? 'double-truncate' : 'block truncate'"
							>{{ item.title ? item.title : '(none)' }}</span>
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
			// availableJobs: [],
			// total: 0,
			totalPages: 0,
			currentPage: 1,
			perPage: 0,
			ascendDescend: 0,
			modal: false
		};
	},
	computed: {
		total() {
			return this.$store.state.jobs.practice_available_sessions_count;
		},
		availableJobs() {
			return this.$store.state.jobs.practice_available_sessions;
		}
	},
	watch: {
		$route(to) {
			this.currentPage = parseInt(to.query.job_page);
			this.getLiveJobs();
		}
	},
	beforeDestroy() {
		let query = Object.assign({}, this.$route.query);
		delete query.job_page;
		this.$router.push({ query });
	},
	async created() {
		await this.$store.commit("jobs/TOGGLE_LOADING", true);
		const query = {
			...this.$route.query,
			job_page: this.$route.query.job_page || 1
		};
		this.currentPage = parseInt(query.job_page);
		let params = {
			practice_id: this.practiceSurgery
				? this.practiceSurgery.child_practice_id
				: this.practice.id,
			status: "Live"
		};
		Promise.all([
			this.$axios.$get(`/api/v1/admin/jobs/count`, { params }).then(res => {
				// this.total = res.data.count
				this.$store.commit(
					"jobs/SET_PRACTICE_LIVE_SESSIONS_COUNT",
					res.data.count
				);
				this.perPage = 10;
				this.totalPages = Math.ceil(this.total / this.perPage);
			})
		]).then(() => {
			this.getLiveJobs("date_created:desc"), console.log(this.availableJobs);
		});
	},
	methods: {
		getTitle(title) {
			let titleLength = title && title.split(" ") ? title.split(" ").length : 0;
			console.log("titleLength", titleLength);
			return title;
		},
		checkRoute(itemId) {
			if (this.$route.name.includes("practice-surgeries")) {
				return {
					path: `/practices/${this.practice.id}/practice-surgeries/${this.practiceSurgery.id}/surgery-sessions/surgery-live-sessions/${itemId}`
				};
			} else if (this.$route.name.includes("practice-sessions")) {
				return {
					path: `/practices/${this.practice.id}/practice-sessions/practice-live-sessions/${itemId}`
				};
			}
		},
		async getLiveJobs(orderBy) {
			let offset =
				parseInt(this.perPage) * (parseInt(this.$route.query.job_page) - 1);
			let params = {
				// viewing_practice_id : this.practiceSurgery ? this.practiceSurgery.child_practice_id : this.practice.id,
				status: "Live",
				order_by: orderBy ? orderBy : this.$route.query.order_by,
				practice_id: this.practiceSurgery
					? this.practiceSurgery.child_practice_id
					: this.practice.id,
				limit: this.perPage,
				offset: offset
			};
			await this.$axios
				.$get(`/api/v1/admin/jobs`, { params })
				.then(res => {
					this.$store.commit("jobs/SET_PRACTICE_LIVE_SESSIONS", res.data.jobs);
					this.$store.commit("jobs/TOGGLE_LOADING", false);
				})
				.catch(err => {
					console.log("get available jobs error!!!", err);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					});
				});
		},
		async pagechanged(e) {
			const query = {
				...this.$route.query,
				job_page: e || 1
			};
			await this.$store.commit("jobs/TOGGLE_LOADING", true);
			await this.$router.push({ query });
			await this.$store.commit("jobs/TOGGLE_LOADING", false);
		}
	}
};
</script>
<style>
.double-truncate {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	transition: all 0.3s linear;
}
</style>
