<template>
	<div>
		<div class="overflow-x-auto xl:overflow-hidden">
			<div v-if="allocatedJobs.length === 0">
				<div
					class="mt-10 text-white w-full text-center"
					style="font-family: Nunito"
				>This locum is not allocatedly hired to any job.</div>
			</div>
			<div v-else>
				<AppJobHeaderSort :locumUser="user" :locumTabStatus="'Allocated'" :currentPage="currentPage" />
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
						v-for="(item, index) in allocatedJobs"
						@click="$router.push(`/locums/${user.id}/locum-jobs/locum-allocated-jobs/${item.id}`)"
						:key="`item-${index}`"
						class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light"
					>
						<div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
							<strong class="block md:hidden text-sm uppercase">Job Number</strong>
							<span class>{{item.job_number}}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
							<span v-if="item.platform_job" class>{{item.platform_job.practice.surgery.name}}</span>
							<span v-else-if="item.private_job" class>{{item.private_job.private_practice.surgery.name}}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">Title</strong>
							<span class>{{item.title}}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">From</strong>
							<span class>{{$moment(item.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY')}}</span>
						</div>
						<div
							class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
						>
							<strong class="block md:hidden text-sm uppercase">To</strong>
							<span class>{{$moment(item.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY')}}</span>
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
			<!--PAGINATION-->
			<div v-if="!allocatedJobs.length == 0" class>
				<AppPagination
					:total="total"
					:totalPages="totalPages"
					:currentPage="currentPage"
					:perPage="perPage"
					@pagechanged="pagechanged"
				/>
			</div>
			<!--PAGINATION ENDS HERE-->

			<div class="job-shield" v-if="modal"></div>
			<transition name="slide" mode="out-in">
				<div class="job-modal shadow-lg" v-if="modal">
					<LocumDetailJobModal @close="modal = false" :job="job" />
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
	props: ["user"],
	components: {
		AppPagination,
		LocumDetailJobModal,
		AppJobHeaderSort
	},
	data() {
		return {
			// allocatedJobs:[],
			// total:0,
			totalPages: 0,
			currentPage: 1,
			perPage: 0,
			ascendDescend: 0,
			modal: false
		};
	},
	beforeDestroy() {
		let query = Object.assign({}, this.$route.query);
		delete query.job_page;
		this.$router.push({ query });
	},
	watch: {
		$route(to, from) {
			this.currentPage = parseInt(to.query.job_page);
			this.getAllocatedJobs();
		}
	},
	async created() {
		await this.$store.commit("jobs/TOGGLE_LOADING", true);
		const query = {
			...this.$route.query,
			job_page: this.$route.query.job_page || 1
		};
		this.currentPage = parseInt(query.job_page);
		let params = {
			viewing_locum_user_id: this.user.id,
			locum_status: "Allocated"
		};
		Promise.all([
			this.$axios.$get(`/api/v1/admin/jobs/count`, { params }).then(res => {
				this.$store.commit(
					"jobs/SET_LOCUM_ALLOCATED_JOBS_COUNT",
					res.data.count
				);
				// this.total = res.data.count
				this.perPage = 10;
				this.totalPages = Math.ceil(this.total / this.perPage);
			})
		]).then(() => {
			this.getAllocatedJobs("date_created:desc");
		});
	},
	computed: {
		total() {
			return this.$store.state.jobs.locum_allocated_jobs_count;
		},
		allocatedJobs() {
			return this.$store.state.jobs.locum_allocated_jobs;
		}
	},
	methods: {
		getAllocatedJobs(orderBy) {
			let offset = this.perPage * (parseInt(this.$route.query.job_page) - 1);
			let params = {
				viewing_locum_user_id: this.user.id,
				locum_status: "Allocated",
				order_by: orderBy ? orderBy : this.$route.query.order_by,
				limit: this.perPage,
				offset: offset
			};
			this.$axios.$get(`/api/v1/admin/jobs`, { params }).then(res => {
				this.$store.commit("jobs/SET_LOCUM_ALLOCATED_JOBS", res.data.jobs);
				this.$store.commit("jobs/TOGGLE_LOADING", false);
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