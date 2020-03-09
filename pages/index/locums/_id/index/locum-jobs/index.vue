<template>
  <div class="mt-5">
    <div class="mx-4 md:mx-8">
      <AppLoading :loading="loadingJobs" :message="'Loading Jobs'" />
      <LocumJobsTabs :user="user" />
      <nuxt-child />
      <!-- <AppTable :columns="columns" :total="jobs.length" :items="jobs" /> -->
    </div>
  </div>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading"
import LocumJobsTabs from "@/components/Locums/LocumJobsTabs"
export default {
	components: {
		AppLoading,
		LocumJobsTabs
	},
	data () {
		return {
			jobs: {},
			params: {
				viewing_locum_user_id: "",
				locum_status: "",
				limit: 10,
				offset: 0,
				order_by: ["created_at:desc"]
			},
			columns: [
				{
					name: "Job Number",
					dataIndex: "job_number"
				},
				{
					name: "Practice / Surgery",
					dataIndex: "",
					class: "text-center"
				},
				{
					name: "Title",
					dataIndex: "title",
					class: "text-center"
				},
				{
					name: "From",
					dataIndex: "date_start",
					class: "text-center"
				},
				{
					name: "To",
					dataIndex: "date_start",
					class: "text-center"
				},
				{
					name: "Created",
					dataIndex: "date_created",
					class: "text-center"
				}
			]
		}
	},
	created () {
		// this.$route.query.status = "Allocated";
		if (this.$route.name == "index-locums-id-index-locum-jobs-index") {
			this.$router.push({
				path: `/locums/${this.user.id}/locum-jobs/locum-allocated-jobs`,
				query: this.$route.query
			})
			// const query = {
			// 	...this.$router.query,
			// 	status: "Allocated"
			// }
			// this.$router.push({
			// 	path: `/locums/${this.user.id}/locum-jobs?status=Allocated`
			// })
		}

		this.params.viewing_locum_user_id = this.user.id
		this.params.locum_status = this.$route.query.status

		this.getJobs(this.params)
	},
	computed: {
		user () {
			return this.$store.state.locums.locumUser
		},
		loadingJobs () {
			return this.$store.state.jobs.loading_jobs
		}
	},
	async asyncData ({ app, store, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/locum-users/${route.params.id}`
			)
			const user = response.data.user

			await store.commit("locums/SET_LOCUM_USER", user)
			await store.commit("jobs/SET_JOBS_LOCUM_USER_ID_VIEWER", user.id)
			return {
				// user
			}
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			})
			console.log("Get locum job error", err)
		}
	},
	methods: {
		getJobs (params) {
			this.$axios.$get(`/api/v1/admin/jobs`, { params }).then(res => {
				console.log("locum job", res.data.jobs)
				this.jobs = res.data.jobs
			})
		}
	}
}
</script>
<style></style>
