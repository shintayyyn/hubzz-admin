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
            :label="'Job part number'"
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
      <div v-if="completedJobs.length === 0">
        <div v-if="isFiltered"
             class="mt-10 text-white w-full text-center"
             style="font-family: Nunito"
        >
          Job Not Found.
        </div>
        <div
          v-else-if="!isFiltered"
          class="mt-10 w-full text-white text-center"
          style="font-family: Nunito"
        >
          This locum has not completed a job yet.
        </div>
      </div>
      <div v-else>
        <AppJobHeaderSort :locumUser="user" :tabStatus="'Completed'" :currentPage="currentPage" />
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
            v-for="(item, index) in completedJobs"
            :key="`item-${index}`"
            class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light"
            @click="$router.push(`/locums/${$route.params.id}/locum-jobs/locum-completed-jobs/${item.id}`)"
          >
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
              <strong class="block md:hidden text-sm uppercase">Job Number</strong>
              <span class>{{ item.job_part_number }}</span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
              <span>{{ item.practice_name }}</span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Title</strong>
              <span class>{{ item.job.title ? item.job.title : '(none)' }}</span>
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
              <strong class="block md:hidden text-sm uppercase">Created At</strong>
              <span>{{ item.date_created_in_gb_formatted }}</span>
            </div>

            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Completed At</strong>
              <span>{{ item.completed_at_in_gb_formatted }}</span>
            </div>
            <div
              class="flex items-center md:flex-col md:justify-center w-1/2 md:w-64 px-1 xl:px-2 py-2 leading-tight align-middle md:text-center"
            >
              <strong class="block md:hidden text-sm uppercase whitespace-no-wrap">Invoice Status</strong>
              <div
                class="py-2 px-4 rounded-lg whitespace-no-wrap text-center mx-2"
                :class="invoiceStatusStyle(item.invoice_status)"
              >
                {{ item.invoice_status }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class>
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="currentPage"
          :perPage="perPage"
          @pagechanged="pagechanged"
        />
      </div>

      <div v-if="modal" class="job-shield" />
      <transition name="slide" mode="out-in">
        <div v-if="modal" class="job-modal shadow-lg">
          <LocumDetailJobModal :job="job" @close="modal = false" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import AppPagination from "@/components/Base/AppPagination"
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  import LocumDetailJobModal from "@/components/Locums/Jobs/LocumDetailJobModal"
  import AppJobHeaderSort from "@/components/Base/AppJobHeaderSort"
  export default {
    components: {
      AppPagination,
      AppInput,
      AppButton,
      LocumDetailJobModal,
      AppJobHeaderSort
    },

    props: {
      user: {
        type: Object,
        default: () => null,
      }
    },

    data () {
      return {
        job_number: null,
        job_title: null,
        // 
        filterModal: false,
        isFiltered: false,
        // completedJobs:[],
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
        return this.$store.state.jobs.locum_completed_jobs_count
      },
      completedJobs () {
        return this.$store.state.jobs.locum_completed_jobs
      }
    },
    watch: {
      $route (to) {
        this.currentPage = parseInt(to.query.completed_job_page)
        this.getCompletedJobs()
      }
    },
    beforeDestroy () {
      let query = Object.assign({}, this.$route.query)
      delete query.completed_job_page
      this.$router.push({ query })
    },
    async created () {
      await this.$store.commit("jobs/TOGGLE_LOADING", true)
      const query = {
        ...this.$route.query,
        completed_job_page: this.$route.query.completed_job_page || 1
      }
      this.currentPage = parseInt(query.completed_job_page)
      let params = {
        viewing_locum_user_id: this.$route.params.id,
        locum_status: ["Completed", "Terminated"],
        job_type: "Platform"
      }
      Promise.all([
        this.$axios
          .$get(`/api/v1/admin/job-parts/count`, { params })
          .then(res => {
            console.log("count", res.data.count)
            this.$store.commit(
              "jobs/SET_LOCUM_COMPLETED_JOBS_COUNT",
              res.data.count
            )
            this.perPage = 10
            this.totalPages = Math.ceil(this.total / this.perPage)
          })
      ]).then(() => {
        this.getCompletedJobs("date_created:desc")
      })
    },
    methods: {
      async getJobPartsPromiseAll () {
        this.currentPage = 1

        const responseCount = await this.$axios.$get(`/api/v1/admin/job-parts/count`, {
          params: {
            viewing_locum_user_id: this.$route.params.id,
            locum_status: ["Completed", "Terminated"],
            job_type: "Platform",
            job_part_number_includes: this.job_number,
            job_title_includes: this.job_title,
          }
        })
        this.$store.commit("jobs/SET_LOCUM_COMPLETED_JOBS_COUNT", responseCount.data.count)
        
        this.perPage = 10
        this.totalPages = Math.ceil(responseCount.data.count / this.perPage)

        const response = await this.$axios.$get(`/api/v1/admin/job-parts`, {
          params: {
            viewing_locum_user_id: this.$route.params.id,
            locum_status: ["Completed", "Terminated"],
            job_type: "Platform",
            job_part_number_includes: this.job_number,
            job_title_includes: this.job_title,
            offset: 0,
            limit: this.perPage,
            order_by: "date_created:desc",
          }
        })
        this.$store.commit("jobs/SET_LOCUM_COMPLETED_JOBS", response.data.job_parts)

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
      async getCompletedJobs (orderBy) {
        let offset =
          this.perPage * (parseInt(this.$route.query.completed_job_page) - 1)
        let params = {
          viewing_locum_user_id: this.$route.params.id,
          locum_status: ["Completed", "Terminated"],
          order_by: orderBy ? orderBy : this.$route.query.order_by,
          limit: this.perPage,
          offset: offset,
          job_type: "Platform",
          job_part_number_includes: this.job_number,
          job_title_includes: this.job_title,
        }
        await this.$axios
          .$get(`/api/v1/admin/job-parts`, { params })
          .then(res => {
            console.log("locum completed job parts", res.data.job_parts)
            this.$store.commit(
              "jobs/SET_LOCUM_COMPLETED_JOBS",
              res.data.job_parts
            )
            this.$store.commit("jobs/TOGGLE_LOADING", false)
          })
      },
      invoiceStatusStyle (status) {
        switch (status) {
          case "To Be Invoiced":
            return "bg-yellow-500 text-black"
          case "Disputed":
            return "bg-red-500 text-white"
          case "Invoiced":
            return "bg-green-500 text-white opacity-75"
        }
      },
      async pagechanged (e) {
        const query = {
          ...this.$route.query,
          completed_job_page: e || 1
        }
        await this.$store.commit("jobs/TOGGLE_LOADING", true)
        await this.$router.push({ query })
        await this.$store.commit("jobs/TOGGLE_LOADING", false)
      }
    }
  }
</script>
