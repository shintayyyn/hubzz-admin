<template>
  <div>
    <div class="overflow-x-auto overflow-y-hidden">
      <div v-if="ongoingJobParts.length === 0">
        <div class="mt-10 w-full text-center text-white">This practice has no ongoing sessions.</div>
      </div>
      <div v-else>
        <AppJobHeaderSort
          :practice="practice"
          :tabStatus="'Ongoing'"
          :currentPage="currentPage"
          :isJobParts="true"
        />
        <div class="w-full overflow-x-auto">
          <!-- BODY -->
          <nuxt-link
            v-for="(item, index) in ongoingJobParts"
            :to="checkRoute(item.id)"
            :key="`item-${index}`"
            class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light"
          >
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
              <strong class="block md:hidden text-sm uppercase">Job Number</strong>
              <span class="break-words">{{item.job_part_number}}</span>
            </div>
            <div
              class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
            >
              <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
              <span class="break-words">{{item.job.platform_job.practice.surgery.name}}</span>
            </div>
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Title</strong>
              <span class="break-words">{{item.job.title}}</span>
            </div>
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Assigned to Locum</strong>
              <span class="">{{ item.job.platform_job.appointed_to_locum.user.personal_detail.name }}</span>
            </div>
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">From</strong>
              <span class="break-words">{{$moment(item.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY')}}</span>
            </div>
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">To</strong>
              <span class="break-words">{{$moment(item.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY')}}</span>
            </div>
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Created</strong>
              <span class="">{{ $moment(item.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }}</span>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div v-if="ongoingJobParts.length > 0" class>
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="currentPage"
          :perPage="perPage"
          @pagechanged="pagechanged"
        />
      </div>

      <div class="job-shield" v-if="modal" @close="modal = false"></div>
      <transition name="slide" mode="out-in">
        <div class="job-modal shadow-lg" v-if="modal">
          <PracticeSessionModal @close="modal = false" :job="job" />
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import AppPagination from "@/components/Base/AppPagination"
import PracticeSessionModal from "@/components/Practices/Sessions/PracticeSessionModal"
import AppJobHeaderSort from "@/components/Base/AppJobHeaderSort"
import AppTable from "@/components/Base/AppTable"
export default {
	props: ["practice", "practice_surgery"],
	components: {
		AppPagination,
		PracticeSessionModal,
		AppJobHeaderSort,
		// AppTable
	},
	data () {
		return {
			// ongoingJobParts:[],
			// total:0,
			job: [],
			totalPages: 0,
			currentPage: 1,
			perPage: 0,
			ascendDescend: 0,
			modal: false
		}
	},

	beforeDestroy () {
		let query = Object.assign({}, this.$route.query)
		delete query.job_parts_page
		this.$router.push({ query })
	},
	watch: {
		$route (to) {
			this.currentPage = parseInt(to.query.job_parts_page)
			this.getOngoingSessions()
		}
	},
	async created () {
		await this.$store.commit("jobs/TOGGLE_LOADING", true)
		const query = {
			...this.$route.query,
			job_parts_page: this.$route.query.job_parts_page || 1
		}
		this.currentPage = parseInt(query.job_parts_page)
		let params = {
			// viewing_practice_id : this.practice_surgery ? this.practice_surgery.child_practice_id : this.practice.id,
			job_practice_id: this.practice_surgery ? this.practice_surgery.child_practice_id : this.practice.id,
			status: "Ongoing"
		}
		Promise.all([
			this.$axios
				.$get(`/api/v1/admin/job-parts/count`, { params })
				.then(res => {
					this.$store.commit(
						"jobs/SET_PRACTICE_ONGOING_SESSIONS_COUNT",
						res.data.count
					)
					this.perPage = 10
					this.totalPages = Math.ceil(this.total / this.perPage)
				})
		])
			.then(() => {
				this.getOngoingSessions("date_created:desc")
			})
			.catch(err => {
				console.log("get applied jobs error!!!", err)
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: "Something went wrong!"
				})
			})
		console.log("acsdas", this.ongoingJobParts)
	},
	computed: {
		total () {
			return this.$store.state.jobs.practice_ongoing_sessions_count
		},
		ongoingJobParts () {
			return this.$store.state.jobs.practice_ongoing_sessions
		}
	},
	methods: {
    checkRoute (itemId){
      if (this.$route.name.includes('practice-surgeries')) {
        return { path: `/practices/${this.practice.id}/practice-surgeries/${this.practice_surgery.id}/surgery-sessions/surgery-ongoing-sessions/${itemId}` }
      } else if(this.$route.name.includes('practice-sessions')) {
        return { path: `/practices/${this.practice.id}/practice-sessions/practice-ongoing-sessions/${itemId}` }
      }
    },
		async getOngoingSessions (orderBy) {
			let offset =
				this.perPage * (parseInt(this.$route.query.job_parts_page) - 1)
			let params = {
				// viewing_practice_id : this.practice_surgery ? this.practice_surgery.child_practice_id : this.practice.id,
				status: "Ongoing",
				order_by: orderBy ? orderBy : this.$route.query.order_by,
			  job_practice_id: this.practice_surgery ? this.practice_surgery.child_practice_id : this.practice.id,
				limit: this.perPage,
				offset: offset
			}
			await this.$axios
				.$get(`/api/v1/admin/job-parts`, { params })
				.then(res => {
          // this.jobParts = res.data.job_parts
          console.log('ongoing jobs', res.data.job_parts)
					this.$store.commit(
						"jobs/SET_PRACTICE_ONGOING_SESSIONS",
						res.data.job_parts
					)
					this.$store.commit("jobs/TOGGLE_LOADING", false)
				})
				.catch(err => {
					console.log("get job parts error!!!", err)
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					})
				})
		},
		async pagechanged (e) {
			const query = {
				...this.$route.query,
				job_parts_page: e || 1
			}
			await this.$store.commit("jobs/TOGGLE_LOADING", true)
			await this.$router.push({ query })
			await this.$store.commit("jobs/TOGGLE_LOADING", false)
		}
	}
}
</script>

<style>
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
</style>