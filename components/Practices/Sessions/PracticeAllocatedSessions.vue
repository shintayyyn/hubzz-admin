<template>
	<div>
		<div class="flex items-center px-2 py-2">
			<!-- <div class="flex py-2">
				<div class="relative">
					<input
						class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
						placeholder="Search Jobs by ID"
						v-model="search.id"
						@keyup.enter="searchSubmit"
					/>
          <input
						class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
						placeholder="Search Jobs by Title"
						v-model="search.title"
						@keyup.enter="searchSubmit"
					/>
					<button
						v-if="search"
						class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1"
						@click="(search = ''), searchSubmit()"
					>
						<svgicon
							name="times-solid"
							height="12"
							width="12"
							class="text-white hover:text-yellow-500 fill-current -mx-2 md:-mx-6"
						/>
					</button>
				</div>
			</div>-->
		</div>
		<div class="overflow-x-auto xl:overflow-hidden">
			<div v-if="allocatedJobs.length === 0">
				<div class="mt-10 w-full text-center text-white">This practice is no allocated session/s.</div>
			</div>
			<div v-else>
				<AppJobHeaderSort
					:practice="practice"
					:tabStatus="'Allocated'"
					:currentPage="currentPage"
					:isJobParts="false"
				/>
				<div class="w-full overflow-x-auto">
					<!-- BODY -->
					<nuxt-link
						v-for="(item, index) in allocatedJobs"
						:key="`item-${index}`"
						:to="checkRoute(item.id)"
						class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-4 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light"
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
							<span v-if="item.platform_job" class>{{ item.platform_job.practice.surgery.name }}</span>
							<span v-else-if="item.private_job" class>{{ item.private_job.private_practice.surgery.name }}</span>
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
							<strong class="block md:hidden text-sm uppercase">Assigned to Locum</strong>
							<span class>{{ item.platform_job.appointed_to_locum.user.personal_detail.name }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">From</strong>
							<span
								class
							>{{ $moment(item.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') +' '+ $moment(item.time_start,'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">To</strong>
							<span
								class
							>{{ $moment(item.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY') +' '+ $moment(item.time_end,'HH:mm:ss.SSS[Z]').format('h:mm:ss a') }}</span>
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
			<!--PAGINATION-->
			<div class>
				<AppPagination
					:total="total"
					:totalPages="totalPages"
					:currentPage="currentPage"
					:perPage="perPage"
					@pagechanged="pagechanged"
				/>
			</div>
			<!--PAGINATION ENDS HERE-->

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
import debounce from "lodash.debounce";
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

	watchQuery: ["search"],
	data() {
		return {
			// allocatedJobs:[],
			// total:0,
			search: {
				id: "",
				title: ""
			},
			job: null,
			totalPages: 0,
			currentPage: 1,
			perPage: 0,
			ascendDescend: 0,
			modal: false
		};
	},
	computed: {
		total() {
			return this.$store.state.jobs.practice_allocated_sessions_count;
		},
		allocatedJobs() {
			return this.$store.state.jobs.practice_allocated_sessions;
		}
	},
	watch: {
		$route(to) {
			this.currentPage = parseInt(to.query.job_page);
			this.getAllocatedJobs();
		},
		"search.id"() {
			this.searchSubmit();
		},
		"search.title"() {
			this.searchSubmit();
		}
	},
	beforeDestroy() {
		let query = Object.assign({}, this.$route.query);
		delete query.job_page;
		this.$router.push({ query });
	},
	created() {
		console.log("route name", this.$route.name);
		const query = {
			...this.$route.query,
			job_page: this.$route.query.job_page || 1
		};
		this.currentPage = parseInt(query.job_page);
		let params = {
			practice_id: this.practiceSurgery
				? this.practiceSurgery.child_practice_id
				: this.practice.id,
			status: "Allocated"
		};
		Promise.all([
			this.$axios.$get(`/api/v1/admin/jobs/count`, { params }).then(res => {
				// this.total = res.data.count
				this.$store.commit(
					"jobs/SET_PRACTICE_ALLOCATED_SESSIONS_COUNT",
					res.data.count
				);
				this.perPage = 10;
				this.totalPages = Math.ceil(this.total / this.perPage);
			})
		])
			.then(() => {
				this.getAllocatedJobs("date_created:desc"),
					console.log(this.allocatedJobs);
			})
			.catch(err => {
				console.log("get allocated jobs error!!!", err);
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: "Something went wrong!"
				});
			});
	},
	methods: {
		checkRoute(itemId) {
			if (this.$route.name.includes("practice-surgeries")) {
				return {
					path: `/practices/${this.practice.id}/practice-surgeries/${this.practiceSurgery.id}/surgery-sessions/surgery-allocated-sessions/${itemId}`
				};
			} else if (this.$route.name.includes("practice-sessions")) {
				return {
					path: `/practices/${this.practice.id}/practice-sessions/practice-allocated-sessions/${itemId}`
				};
			}
		},

		async getAllocatedJobs(orderBy) {
			let offset = this.perPage * (parseInt(this.$route.query.job_page) - 1);
			let params = {
				status: "Allocated",
				order_by: orderBy ? orderBy : this.$route.query.order_by,
				practice_id: this.practiceSurgery
					? this.practiceSurgery.child_practice_id
					: this.practice.id,
				limit: this.perPage,
				offset: offset
			};
			if (this.search.id) {
				params.id = this.search.id;
			}

			if (this.search.title) {
				params.title_includes = this.search.title;
			}

			if (this.search.job_number) {
				params.job_number_includes = this.search.job_number;
			}
			await this.$axios
				.$get(`/api/v1/admin/jobs`, { params })
				.then(res => {
					console.log("allocated sessions", res.data.jobs);
					this.$store.commit(
						"jobs/SET_PRACTICE_ALLOCATED_SESSIONS",
						res.data.jobs
					);
					this.$store.commit("jobs/TOGGLE_LOADING", false);
					// this.allocatedJobs = res.data.jobs
				})
				.catch(err => {
					console.log("get allocated jobs error!!!", err);
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
		},

		searchSubmit: debounce(function() {
			let search = this.search;

			let query = { ...this.$router.query, search };

			this.$router.push({ query });
		}, 500)
	}
};
</script>
<style>
.card {
	min-width: 100px;
	height: 250px;
	box-sizing: content-box;
}
.job-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.job-modal {
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
	.job-modal {
		width: 70%;
	}
}
</style>