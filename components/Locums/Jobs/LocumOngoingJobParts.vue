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
      <div v-if="locumOngoingJobParts.length == 0">
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
          This locum has no ongoing jobs.
        </div>
      </div>
      <div v-else>
        <AppTableNew
          v-if="total !== 0"
          :total="total"
          :items="locumOngoingJobParts"
          :currentPage="currentPage"
          :perPage="perPage"
          :columns="columns"
          :routerLink="`/locums/${$route.params.id}/locum-jobs/locum-allocated-jobs`"
          :orderBy="orderBy"
          @pagechanged="pagechanged"
          @sorted="(_orderBy) => orderBy = _orderBy"
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
  import AppInput from "@/components/Base/AppInput"
  import AppButton from "@/components/Base/AppButton"
  import LocumDetailJobModal from "@/components/Locums/Jobs/LocumDetailJobModal"
  import AppTableNew from "@/components/Base/AppTableNew"
  export default {
    components: {
      AppInput,
      AppButton,
      LocumDetailJobModal,
      AppTableNew,
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
        // locumOngoingJobParts: [],
        // total:0,
        totalPages: 0,
        currentPage: 1,
        perPage: 0,
        ascendDescend: 0,
        modal: false,
        orderBy: [
          'created_at_in_gb_formatted:desc',
        ],
      }
    },
    computed: {
      total () {
        return this.$store.state.jobs.locum_ongoing_jobs_count
      },
      locumOngoingJobParts () {
        return this.$store.state.jobs.locum_ongoing_jobs
      },
      columns () {
        return [
					{
						name: 'Job Number',
						dataIndex: 'job_part_number',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '140px',
					},
					{
						name: 'Practice',
						dataIndex: 'practice_name',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
					},
					{
						name: 'Title',
						dataIndex: 'title',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '120px',
            maxWidth: '550px',
					},
					{
						name: 'From',
						dataIndex: 'datetime_start_in_gb_formatted',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '550px',
					},
					{
						name: 'To',
						dataIndex: 'datetime_end_in_gb_formatted',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
					},
					{
						name: 'Allocated At',
						dataIndex: 'appointed_at_in_gb_formatted',
						class: 'md:text-center',
						sortable: true,
            flex: '1 0 0',
            minWidth: '100px',
            maxWidth: '170px',
					},
				]
      },
    },
    watch: {
      $route (to) {
        this.currentPage = parseInt(to.query.job_parts_page)
        this.getOngoingJobs("date_created:desc")
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
        viewing_locum_user_id: this.$route.params.id,
        locum_status: "Ongoing",
        job_type: "Platform"
      }
      Promise.all([
        console.log(this.user),
        this.$axios
          .$get(`/api/v1/admin/job-parts/count`, { params })
          .then(res => {
            this.$store.commit(
              "jobs/SET_LOCUM_ONGOING_JOBS_COUNT",
              res.data.count
            )
            console.log("res", res)
            // this.total = res.data.count
            this.perPage = 10
            this.totalPages = Math.ceil(this.total / this.perPage)
          })
      ]).then(() => {
        this.getOngoingJobs("date_created:desc"),
          console.log("ongoing job parts", this.locumOngoingJobParts)
      })
    },
    methods: {
      async getJobPartsPromiseAll () {
        this.currentPage = 1

        const responseCount = await this.$axios.$get(`/api/v1/admin/job-parts/count`, {
          params: {
            viewing_locum_user_id: this.$route.params.id,
            locum_status: "Ongoing",
            job_type: "Platform",
            job_part_number_includes: this.job_number,
            job_title_includes: this.job_title,
          }
        })
        this.$store.commit("jobs/SET_LOCUM_ONGOING_JOBS_COUNT", responseCount.data.count)
        
        this.perPage = 10
        this.totalPages = Math.ceil(responseCount.data.count / this.perPage)

        const response = await this.$axios.$get(`/api/v1/admin/job-parts`, {
          params: {
            viewing_locum_user_id: this.$route.params.id,
            locum_status: "Ongoing",
            job_type: "Platform",
            job_part_number_includes: this.job_number,
            job_title_includes: this.job_title,
            offset: 0,
            limit: this.perPage,
            order_by: "date_created:desc",
          }
        })
        this.$store.commit("jobs/SET_LOCUM_ONGOING_JOBS", response.data.job_parts)

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
      getOngoingJobs (orderBy) {
        let offset =
          parseInt(this.perPage) *
          (parseInt(this.$route.query.job_parts_page) - 1)
        let params = {
          viewing_locum_user_id: this.$route.params.id,
          locum_status: "Ongoing",
          order_by: orderBy ? orderBy : this.$route.query.order_by,
          limit: this.perPage,
          offset: offset,
          job_type: "Platform",
          job_part_number_includes: this.job_number,
          job_title_includes: this.job_title,
        }

        this.$axios.$get(`/api/v1/admin/job-parts`, { params }).then(res => {
          // this.locumOngoingJobParts =  res.data.job_parts
          this.$store.commit("jobs/SET_LOCUM_ONGOING_JOBS", res.data.job_parts)
          this.$store.commit("jobs/TOGGLE_LOADING", false)
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
