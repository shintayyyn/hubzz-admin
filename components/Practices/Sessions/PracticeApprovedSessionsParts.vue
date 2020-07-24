<template>
  <div>
    <div class="overflow-x-auto overflow-y-hidden">
      <AppButton
        :label="'Filter'"
        :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
        @click="filterModal = !filterModal"
      />
      <div class="flex" :class="filterModal ? 'flex' : 'hidden'">
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="job_number"
            class="text-white"
            :type="'text'"
            :name="'job_number'"
            :label="'Job number'"
          />
        </div>
        <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
          <AppInput
            v-model="job_title"
            class="text-white"
            :type="'text'"
            :name="'job_title'"
            :label="'Job title'"
          />
        </div>
      </div>
      <div class="flex" :class="filterModal ? 'flex' : 'hidden'">
        <AppButton
          :label="'Clear'"
          class="mx-1"
          :background="'transparent'"
          :class="'border text-white hover:bg-gray-700 hover:border-none'"
          @click="clearFilters"
        />
        <AppButton
          :label="'Search'"
          class="mx-1"
          :background="'transparent'"
          :class="'border text-white hover:bg-gray-700 hover:border-none'"
          @click="filterJobParts"
        />
      </div>
      <div v-if="approvedJobParts.length === 0">
        <div v-if="isFiltered"
             class="mt-10 text-white w-full text-center"
             style="font-family: Nunito"
        >
          Session Not Found.
        </div>
        <div v-else-if="!isFiltered" class="mt-10 w-full text-center text-white">
          This practice has no approved sessions.
        </div>
      </div>

      <div v-else>
        <AppJobHeaderSort
          :practice="practice"
          tab-status="Approved"
          :current-page="currentPage"
          :is-job-parts="true"
        />
        <div class="w-full overflow-x-auto">
          <!-- HEADER -->
          <!-- <div class="w-full hidden md:flex text-sm lg:text-base font-bold mt-4 mb-2"> 
              <div class="w-1/6 md:px-2">Job Number</div> 
              <div class="w-1/6 md:px-2">Practice / Surgery</div>
              <div class="w-1/6 md:px-2">Title</div>
              <div class="w-1/6 md:px-2">From</div>
              <div class="w-1/6 md:px-2">To</div>
              <div class="w-1/6 md:px-2">Created</div>
					</div>-->
          <!-- BODY -->
          <nuxt-link
            v-for="(item, index) in approvedJobParts"
            :key="`item-${index}`"
            :to="checkRoute(item.id)"
            class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light"
          >
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
              <strong class="block md:hidden text-sm uppercase">Job Number</strong>
              <span class="break-words">{{ item.job_part_number }}</span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
              <span>{{ item.practice_name }}</span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Title</strong>
              <span
                :class="item.title && item.title.split(' ') && item.title.split(' ').length > 1 ? 'double-truncate' : 'block truncate'"
              >{{ item.title ? item.title : '(none)' }}</span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">From</strong>
              <span>{{ item.datetime_start_in_gb_formatted }}</span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">To</strong>
              <span>{{ item.datetime_end_in_gb_formatted }}</span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Completed At</strong>
              <span>{{ item.completed_at_in_gb_formatted }}</span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Approved At</strong>
              <span>{{ item.appointed_at_in_gb_formatted }}</span>
            </div>
          </nuxt-link>
        </div>
      </div>

      <div>
        <AppPagination
          :total="total"
          :total-pages="totalPages"
          :current-page="currentPage"
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
import AppPagination from "@/components/Base/AppPagination"
import AppInput from "@/components/Base/AppInput"
import AppButton from "@/components/Base/AppButton"
import PracticeSessionModal from "@/components/Practices/Sessions/PracticeSessionModal"
import AppJobHeaderSort from "@/components/Base/AppJobHeaderSort"
export default {
	components: {
		AppPagination,
		AppInput,
		AppButton,
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

	data () {
		return {
			job_number: null,
			job_title: null,
			// 
			filterModal: false,
			isFiltered: false,
			// approvedJobParts:[],
			// total:0,
			totalPages: 0,
			currentPage: 1,
			perPage: 0,
			ascendDescend: 0,
			modal: false
		}
	},
	computed: {
		total () {
			return this.$store.state.jobs.practice_approved_sessions_count
		},
		approvedJobParts () {
			return this.$store.state.jobs.practice_approved_sessions
		}
	},
	watch: {
		$route (to) {
			this.currentPage = parseInt(to.query.job_parts_page)
			this.getApprovedSessions()
		}
	},
	beforeDestroy () {
		let query = Object.assign({}, this.$route.query)
		delete query.job_parts_page
		this.$router.push({ query })
	},
	async created () {
		await this.$store.commit("jobs/TOGGLE_LOADING", true)
		const query = {
			...this.$route.query,
			job_parts_page: this.$route.query.job_parts_page || 1
		}
		this.currentPage = parseInt(query.job_parts_page)
		let params = {
      practice_id: this.$route.name.includes("practice-surgeries")
        ? null
        : this.$route.params.id,
      practice_surgery_id: this.$route.name.includes("practice-surgeries")
        ? this.$route.params.practiceSurgeryId
        : null,
			status: "Approved"
		}
		Promise.all([
			this.$axios
				.$get(`/api/v1/admin/job-parts/count`, { params })
				.then(res => {
					// this.total = res.data.count
					this.$store.commit(
						"jobs/SET_PRACTICE_APPROVED_SESSIONS_COUNT",
						res.data.count
					)
					this.perPage = 10
					this.totalPages = Math.ceil(this.total / this.perPage)
				})
		])
			.then(() => {
				this.getApprovedSessions("date_created:desc")
			})
			.catch(err => {
				console.log("get applied jobs error!!!", err)
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: "Something went wrong!"
				})
			})
	},
	methods: {
		async getJobPartsPromiseAll () {
			this.currentPage = 1

			const responseCount = await this.$axios.$get(`/api/v1/admin/job-parts/count`, {
				params: {
          practice_id: this.$route.name.includes("practice-surgeries")
            ? null
            : this.$route.params.id,
          practice_surgery_id: this.$route.name.includes("practice-surgeries")
            ? this.$route.params.practiceSurgeryId
            : null,
					status: "Approved",
					job_part_number_includes: this.job_number,
					job_title_includes: this.job_title,
				}
			})
			this.$store.commit("jobs/SET_PRACTICE_APPROVED_SESSIONS_COUNT", responseCount.data.count)
			
			this.perPage = 10
			this.totalPages = Math.ceil(responseCount.data.count / this.perPage)

			const response = await this.$axios.$get(`/api/v1/admin/job-parts`, {
				params: {
          practice_id: this.$route.name.includes("practice-surgeries")
            ? null
            : this.$route.params.id,
          practice_surgery_id: this.$route.name.includes("practice-surgeries")
            ? this.$route.params.practiceSurgeryId
            : null,
					status: "Approved",
					job_part_number_includes: this.job_number,
					job_title_includes: this.job_title,
					offset: 0,
					limit: this.perPage,
					order_by: "date_created:desc",
				}
			})
			this.$store.commit("jobs/SET_PRACTICE_APPROVED_SESSIONS", response.data.job_parts)

			this.$store.commit("jobs/TOGGLE_LOADING", false)
		},
		async filterJobParts () {
			this.currentPage = 1
			// this.offset = 0
			// this.limit = 5
			// this.initialLoading = true
			this.isFiltered = true
			await this.getJobPartsPromiseAll()
			// this.initialLoading = false
			// this.filterModal = false
		},
		clearFilters () {
			this.job_number = null
			this.job_title = null
		},
		checkRoute (itemId) {
			if (this.$route.name.includes("practice-surgeries")) {
				return {
					path: `/practices/${this.$route.params.id}/practice-surgeries/${this.$route.params.practiceSurgeryId}/surgery-sessions/surgery-approved-sessions/${itemId}`
				}
			} else if (this.$route.name.includes("practice-sessions")) {
				return {
					path: `/practices/${this.$route.params.id}/practice-sessions/practice-approved-sessions/${itemId}`
				}
			}
		},
		async getApprovedSessions (orderBy) {
			let offset =
				this.perPage * (parseInt(this.$route.query.job_parts_page) - 1)
			let params = {
				status: "Approved",
				order_by: orderBy ? orderBy : this.$route.query.order_by,
        practice_id: this.$route.name.includes("practice-surgeries")
          ? null
          : this.$route.params.id,
        practice_surgery_id: this.$route.name.includes("practice-surgeries")
          ? this.$route.params.practiceSurgeryId
          : null,
				limit: this.perPage,
				offset: offset,
				job_part_number_includes: this.job_number,
				job_title_includes: this.job_title,
			}
			await this.$axios
				.$get(`/api/v1/admin/job-parts`, { params })
				.then(res => {
					// this.jobParts = res.data.job_parts
					console.log("res", res.data.job_parts)
					this.$store.commit(
						"jobs/SET_PRACTICE_APPROVED_SESSIONS",
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