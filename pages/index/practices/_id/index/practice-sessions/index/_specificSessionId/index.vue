<template>
  <div class="practice-modal">
    <div class="cursor-pointer m-6" @click="goBack()">
      <svgicon
        name="arrow-left-solid"
        height="32"
        width="32"
        class="text-white hover:text-sunglow fill-current"
      />
    </div>
    <div v-if="!isJobParts">
      <PracticeSessionModal :job="job" />
    </div>
    <div v-if="isJobParts">
      <JobPartModal :specificJobPart="job" :isNuxtChild="true" />
    </div>
  </div>
</template>

<script>
import PracticeSessionModal from "@/components/Practices/PracticeSessionModal"
import JobPartModal from "@/components/Base/JobPartModal"
export default {
	components: {
		PracticeSessionModal,
		JobPartModal
	},
	data () {
		return {
			job: "",
			isJobParts: ""
		}
	},
	async asyncData ({ app, store, route, error }) {
		try {
			const normalizedStatus = route.query && route.query.status ? route.query.status.toLowerCase() : null
			const isJobParts = ["ongoing", "completed", "approved"].includes(normalizedStatus)
			let response = await app.$axios.$get(
				`/api/v1/admin/${isJobParts === true ? "job-parts" : "jobs"}/${
					route.params.specificSessionId
				}`
			)
			let job = ""

			if (isJobParts == true) {
				job = response.data.job_part
			} else {
				job = response.data.job
			}
			store.commit("jobs/TOGGLE_LOADING", false)
			return {
				job,
				isJobParts
			}
			} catch (err) {
				error({ statusCode: 404 })
			}
		},
	methods: {
		goBack () {
			const query = {
				...this.$route.query
			}
			delete query.status
			this.$router.push({ path: `/practices/${this.$route.params.id}`, query })
		}
	}
}
</script>
