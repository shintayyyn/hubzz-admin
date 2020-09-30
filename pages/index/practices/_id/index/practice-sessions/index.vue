<template>
  <div class="mt-5">
    <div>
      <AppLoading :loading="loadingJobs" :message="'Loading Sessions'" />
    </div>

    <SessionsTabs :practice="practice" />

    <div class="py-4">
      <nuxt-child :practice="practice" />
    </div>
  </div>
</template>

<script>
import SessionsTabs from "@/components/Practices/SessionsTabs"
import AppLoading from "@/components/Base/AppLoading"

export default {
	transition: {
		name: "fade",
		mode: "out-in"
  },
  
	components: {
		AppLoading,
		SessionsTabs
  },

  props: {
    practice: {
      type: Object,
      default: () => null,
    },
  },
  
	computed: {
		loadingJobs () {
			return this.$store.state.jobs.loading_jobs
		}
  },

  async asyncData ({ store, error }) {
    const authAdminPermissions = store.getters["permissions"]

    if (authAdminPermissions.includes('View Practice Sessions') === false) {
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.',
      })
      return
    }
  },
  
	created () {
    this.$store.commit("jobs/SET_SESSIONS_PRACTICE_ID_VIEWER", parseInt(this.$route.params.id))
      
		if (
			this.$route.name == "index-practices-id-index-practice-sessions-index"
		) {
			this.$router.push({
				path: `/practices/${this.practice.id}/practice-sessions/practice-live-sessions`,
				query: this.$route.query
			})
    }
  },
  
}
</script>
