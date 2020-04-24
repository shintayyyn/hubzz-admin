<template>
  <div class="mt-2">
    <!-- <nuxt-link
      :to="`/locums/${user.id}/locum-jobs/locum-available-jobs`"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
      :class=" !$route.query.available_job_type ||($route.query.available_job_type && $route.query.available_job_type.toLowerCase() === 'available') ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >Available</nuxt-link>
    <nuxt-link
      :to="`/locums/${user.id}/locum-jobs/locum-available-jobs?available_job_type=Public
      `"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
      :class="($route.query.available_job_type && $route.query.available_job_type.toLowerCase() === 'public')? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >Public</nuxt-link>
    <nuxt-link
      :to="`/locums/${user.id}/locum-jobs/locum-available-jobs?available_job_type=Bank`"
      class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
      :class="($route.query.available_job_type && $route.query.available_job_type.toLowerCase() === 'bank') ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
    >Bank</nuxt-link> -->

    <AppTable
      v-if="total > 0"
      :total="total"
      :items="availableJobs"
      :currentPage="currentPage"
      :perPage="params.limit"
      :columns="columns"
      :routerLink="`/locums/${user.id}/locum-jobs/locum-available-jobs`"
      :orderBy="params.order_by"
      @pagechanged="pagechanged"
      @sorted="sorted"
    />
    <div v-else>
      <div
        class="mt-10 w-full text-white text-center"
        style="font-family: Nunito"
      >
        This locum has no available jobs.
      </div>
    </div>
    <!-- <LocumAvailableJobs :user='user'/> -->
  </div>
</template>
<script>
import AppTable from "@/components/Base/AppTable"
export default {
	components: {
		// LocumAvailableJobs,
		AppTable
	},
	// middleware ({ query, error }) {
	// 	if (
	// 		query.status &&
	// 		!["matched", "available", "bank"].includes(
	// 			query.available_job_type.toLowerCase()
	// 		)
	// 	) {
	// 		return error({
	// 			status: 404,
	// 			message: "This Available Job Type is Invalid"
	// 		})
	// 	}
	// },
	data () {
		return {
			loading: false,
			currentPage: 1,
			orderBy: [],
			params: {
				viewing_locum_user_id: "",
				locum_status: "",
				// practice_is_favorite_of_locum: "",
				limit: 10,
				offset: 0,
				order_by: [],
				type: "Platform"
			},
			columns: [
				{
					name: "Job Number",
					dataIndex: "job_number",
					sortable: true
				},
				{
					name: "Practice / Surgery",
					dataIndex: "practice_name",
					sortable: true
				},
				{
					name: "Title",
					dataIndex: "title",
					class: "text-center",
					sortable: true
				},
				{
					name: "From",
					dataIndex: "date_start",
					class: "text-center localDate",
					sortable: true
				},
				{
					name: "To",
					dataIndex: "date_end",
					class: "text-center localDate",
					sortable: true
				},
				{
					name: "Created",
					dataIndex: "date_created",
					class: "text-center localDate",
					sortable: true
				}
			]
		}
	},

	// watch: {
	// 	"$route.query.available_job_type" (newStatus) {
	// 		let locumStatus = ['Available', 'Matched']
	// 		if (!newStatus || newStatus == "Available") {
	// 			locumStatus = "Matched"
	// 		} else if (newStatus == "Public") {
	// 			locumStatus = "Available"
	// 		} else if (newStatus == "Bank") {
	// 			locumStatus = "Matched"
	// 		}
	// 		let params = {}
	// 		params = {
  //       viewing_locum_user_id: this.user.id,
  //       locum_status: locumStatus,
  //       practice_is_favorite_of_locum: true,
  //       limit: 10,
  //       offset: 0
  //     };
	// 		(this.params.viewing_locum_user_id = params.viewing_locum_user_id),
	// 			(this.params.locum_status = params.locum_status),
	// 			(this.params.practice_is_favorite_of_locum =
	// 				params.practice_is_favorite_of_locum),
	// 			(this.params.limit = params.limit),
	// 			(this.params.offset = params.offset),
	// 			setTimeout(async () => {
	// 				await this.$store.commit("jobs/TOGGLE_LOADING", true)
	// 				await this.getAvailableJobs(this.params)
	// 				await this.$store.commit("jobs/TOGGLE_LOADING", false)
	// 			})
	// 	}
	// },
	computed: {
		user () {
			return this.$store.state.locums.locumUser
		},
		total () {
			return this.$store.state.jobs.locum_available_jobs_count
		},
		loadingJobs () {
			return this.$store.state.jobs.loading_jobs
		},
		availableJobs () {
			return this.$store.state.jobs.locum_available_jobs
		}
	},
	async asyncData ({ app, store, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/locum-users/${route.params.id}`
			)
			const user = response.data.user
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			})
			console.log("get locum user error!", err)
		}
	},
	created () {
		// let newStatus = this.$route.query.available_job_type
		// 	? this.$route.query.available_job_type
		// 	: null
		let locumStatus = ['Available', 'Matched']
		// if (!newStatus || newStatus == "Available") {
		// 	locumStatus = "Matched"
		// } else if (newStatus == "Public") {
		// 	locumStatus = "Available"
		// } else if (newStatus == "Bank") {
		// 	locumStatus = "Matched"
		// }
		let params = {}
		params = {
			viewing_locum_user_id: this.user.id,
			locum_status: locumStatus,
			// practice_is_favorite_of_locum: true,
			limit: 10,
			offset: 0
		};
		(this.params.viewing_locum_user_id = params.viewing_locum_user_id),
    (this.params.locum_status = params.locum_status),
    // (this.params.practice_is_favorite_of_locum =
    // 	params.practice_is_favorite_of_locum),
    (this.params.limit = params.limit),
    (this.params.offset = params.offset),
		this.getAvailableJobs(this.params)
	},
	methods: {
		async getAvailableJobs (params) {
			await this.$store.commit("jobs/TOGGLE_LOADING", true);
			await this.$axios
				.$get(`/api/v1/admin/jobs/count`, { params })
				.then(res => {
					console.log("result", res.data.count)
					this.$store.commit(
						"jobs/SET_LOCUM_AVAILABLE_JOBS_COUNT",
						res.data.count
					)
				})
				.catch(() => {
					this.$store.commit("jobs/TOGGLE_LOADING", false);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					})
				})

			await this.$axios
				.$get(`/api/v1/admin/jobs`, { params })
				.then(res => {
					console.log("result", res.data.jobs)
					this.$store.commit("jobs/SET_LOCUM_AVAILABLE_JOBS", res.data.jobs)
				})
				.catch(() => {
					this.$store.commit("jobs/TOGGLE_LOADING", false)
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					})
				})
			await this.$store.commit("jobs/TOGGLE_LOADING", false)
		},
		async pagechanged (page) {
			const query = {
				...this.$route.query,
				page: page || 1
			}
			this.params.offset = this.params.limit * (page - 1)
			this.currentPage = page
			this.getAvailableJobs(this.params)
		},
		async sorted (order_by) {
			this.currentPage = 1
			let query = {
				...this.$router.query,
				order_by
			}
			this.params.order_by = order_by
			this.getAvailableJobs(this.params)
		}
	}
}
</script>
<style>
</style>