<template>
  <div>
    <div class="overflow-x-auto overflow-y-hidden">
      <div v-if="cancelledJobs.length === 0">
        <div class="mt-10 w-full text-center text-white">
          This practice had no case of cancelled session/s.
        </div>
      </div>
      <div v-else>
        <AppJobHeaderSort
          :practice="practice"
          :tab-status="'Cancelled'"
          :current-page="currentPage"
          :is-job-parts="false"
        />

        <div class="w-full overflow-x-auto">
          <nuxt-link
            v-for="(item, index) in cancelledJobs"
            :key="`item-${index}`"
            :to="checkRoute(item.id)"
            class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light"
            draggable="false"
          >
            <div
              class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle"
            >
              <strong class="block md:hidden text-sm uppercase">Job Number</strong>
              <span class="break-words">{{ item.job_part_number }}</span>
            </div>
            <div
              class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
            >
              <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
              <span class="break-words">{{
                item.job.platform_job.practice.surgery.name
              }}</span>
            </div>
            <div
              class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
            >
              <strong class="block md:hidden text-sm uppercase">Title</strong>
              <span class="break-words">{{ item.job.title }}</span>
            </div>
            <div
              class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
            >
              <strong class="block md:hidden text-sm uppercase">From</strong>
              <span class="break-words">{{
                $moment(item.date_start, "YYYY-MM-DD[T]").format("DD/MM/YYYY")
              }}</span>
            </div>
            <div
              class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
            >
              <strong class="block md:hidden text-sm uppercase">To</strong>
              <span class="break-words">{{
                $moment(item.date_end, "YYYY-MM-DD[T]").format("DD/MM/YYYY")
              }}</span>
            </div>
            <div
              class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
            >
              <strong class="block md:hidden text-sm uppercase">Created</strong>
              <span class="">{{
                $moment(item.created_at, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]").format(
                  "DD/MM/YYYY, h:mm:ss a"
                )
              }}</span>
            </div>
            <div
              class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center"
            >
              <strong class="block md:hidden text-sm uppercase">Cancelled At</strong>
              <span class="">{{
                $moment(item.job.platform_job.cancelled_at, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]").format(
                  "DD/MM/YYYY, h:mm:ss a"
                )
              }}</span>
            </div>
          </nuxt-link>
        </div>
      </div>

      <div class="">
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
  import PracticeSessionModal from "@/components/Practices/Sessions/PracticeSessionModal"
  import AppJobHeaderSort from "@/components/Base/AppJobHeaderSort"
  export default {
    components: {
      AppJobHeaderSort,
      AppPagination,
      PracticeSessionModal
    },

    props: {

      practice: {
        type: Object,
        default: () => null,
      },

      practiceSurgery: {
        type: Object,
        default: () => null,
      },
      
    },
    
    data () {
      return {
        // cancelledJobs:[],
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
        return this.$store.state.jobs.practice_cancelled_sessions_count
      },
      cancelledJobs () {
        return this.$store.state.jobs.practice_cancelled_sessions
      }
    },
    watch: {
      $route (to) {
        this.currentPage = parseInt(to.query.job_page)
        this.getCancelledJobs(this.$route.query.order_by)
      }
    },
    beforeDestroy () {
      let query = Object.assign({}, this.$route.query)
      delete query.job_page
      this.$router.push({ query })
    },
    async created () {
      await this.$store.commit("jobs/TOGGLE_LOADING", true)
      const query = {
        ...this.$route.query,
        job_page: this.$route.query.job_page || 1
      }
      this.currentPage = parseInt(query.job_page)
      let params = {
        // viewing_practice_id : this.practiceSurgery ? this.practiceSurgery.child_practice_id : this.practice.id,
        job_practice_id: this.practiceSurgery
          ? this.practiceSurgery.child_practice_id
          : this.practice.id,
        status: "Cancelled"
      }
      Promise.all([
        this.$axios
          .$get(`/api/v1/admin/job-parts/count`, { params })
          .then(res => {
            // this.total = res.data.count
            this.$store.commit(
              "jobs/SET_PRACTICE_CANCELLED_SESSIONS_COUNT",
              res.data.count
            )
            this.perPage = 10
            this.totalPages = Math.ceil(this.total / this.perPage)
          })
      ]).then(() => {
        this.getCancelledJobs("date_created:desc")
      })
    },
    methods: {
      checkRoute (itemId) {
        if (this.$route.name.includes("practice-surgeries")) {
          return {
            path: `/practices/${this.practice.id}/practice-surgeries/${this.practiceSurgery.id}/surgery-sessions/surgery-cancelled-sessions/${itemId}`
          }
        } else if (this.$route.name.includes("practice-sessions")) {
          return {
            path: `/practices/${this.practice.id}/practice-sessions/practice-cancelled-sessions/${itemId}`
          }
        }
      },
      async getCancelledJobs (orderBy) {
        let offset = this.perPage * (parseInt(this.$route.query.job_page) - 1)
        let params = {
          // viewing_practice_id : this.practiceSurgery ? this.practiceSurgery.child_practice_id : this.practice.id,
          status: "Cancelled",
          order_by: orderBy ? orderBy : this.$route.query.order_by,
          job_practice_id: this.practiceSurgery
            ? this.practiceSurgery.child_practice_id
            : this.practice.id,
          limit: this.perPage,
          offset: offset
        }
        await this.$axios
          .$get(`/api/v1/admin/job-parts`, { params })
          .then(res => {
            // this.cancelledJobs = res.data.jobs
            this.$store.commit(
              "jobs/SET_PRACTICE_CANCELLED_SESSIONS",
              res.data.job_parts
            )
            this.$store.commit("jobs/TOGGLE_LOADING", false)
          })
          .catch(err => {
            console.log("get cancelled jobs error!!!", err)
            this.$store.commit("SET_NOTIFICATION", {
              ecreated_atnabled: true,
              status: "danger",
              text: "Something went wrong!"
            })
          })
      },
      async pagechanged (e) {
        const query = {
          ...this.$route.query,
          job_page: e || 1
        }
        await this.$store.commit("jobs/TOGGLE_LOADING", true)
        await this.$router.push({ query })
        await this.$store.commit("jobs/TOGGLE_LOADING", false)
      }
    }
  }
</script>
