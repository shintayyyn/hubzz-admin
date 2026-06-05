<template>
  <div class="max-w-xl mt-2 text-sm text-white">
    <LocumJobsTabs />
    <div>
      <transition name="fade" mode="out-in">
        <Component :is="activeComponent" :user="user" />
      </transition>
    </div>
  </div>
</template>
<script>
import LocumJobsTabs from "@/components/Locums/LocumJobsTabs"
import LocumAvailableJobs from "@/components/Locums/Jobs/LocumAvailableJobs"
import LocumAppliedJobs from "@/components/Locums/Jobs/LocumAppliedJobs"
import LocumMatchedJobs from "@/components/Locums/Jobs/LocumMatchedJobs"
import LocumCurrentJobs from "@/components/Locums/Jobs/LocumCurrentJobs"
import LocumCompletedJobs from "@/components/Locums/Jobs/LocumCompletedJobs"
import LocumUnsuccessfulJobs from "@/components/Locums/Jobs/LocumUnsuccessfulJobs"
import LocumCancelledJobs from "@/components/Locums/Jobs/LocumCancelledJobs"
export default {
	components: {
		LocumJobsTabs,
		locum_available: LocumAvailableJobs,
		locum_applied: LocumAppliedJobs,
		locum_matched: LocumMatchedJobs,
		locum_current: LocumCurrentJobs,
		locum_completed: LocumCompletedJobs,
		locum_unsuccessful: LocumUnsuccessfulJobs,
		locum_cancelled: LocumCancelledJobs,
	},
	props: {
		user: {
			type: Object,
			required: true
		}
	},
	data() {
		return {}
	},

	computed: {
		activeComponent() {
			return this.$route.query.job_status
		}
	},
	created() {
		console.log(this.jobs)
		const query = {
			...this.$route.query,
			job_status: this.$route.query.job_status || "locum_current"
		}
		this.$router.push({ query })
	},
	methods: {
		// show(id) {
		//     const query = {
		//     ...this.$route.query
		//     }
		// this.$router.push({ path: `/sessions/${id}`, query })
		// }
	}
}
</script>
