<template>
  <div>
    <LocumJobsTabs v-if="locumUser && !$route.params.locumJobPartId" :user="locumUser" />
    <nuxt-child />
  </div>
</template>

<script>
  import LocumJobsTabs from "@/components/Locums/LocumJobsTabs"
  export default {
    components: {
      LocumJobsTabs,
    },

    props: {
      locumUser: {
        type: Object,
        default: () => null,
      }
    },

    computed: {
      loadingJobs () {
        return this.$store.state.jobs.loading_jobs
      }
    },

    async asyncData ({ store, route, error }) {
      try {
        const authAdminPermissions = store.getters["permissions"]

        if (authAdminPermissions.includes('View Locum Jobs') === false) {
          error({
            statusCode: 403,
            message: 'You are not authorized to view this page.',
          })
          return
        }

        await store.commit("jobs/SET_JOBS_LOCUM_USER_ID_VIEWER", route.params.id)
      } catch (err) {
        store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: "Something went wrong!"
        })
        console.log("Get locum job error", err)
      }
    },

    created () {
      if (this.$route.name == 'index-locums-id-index-locum-jobs-index') {
        this.$router.push({
          path: `/locums/${this.$route.params.id}/locum-jobs/locum-allocated-jobs`,
        })
      }
    },
  }
</script>
