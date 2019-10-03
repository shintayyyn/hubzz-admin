<template>
  <div>
    <div class="overflow-x-auto overflow-y-hidden">
      <div v-if="appliedJobs.length === 0">
        <div
          class="mt-10 w-full text-white text-center"
          style="font-family: Nunito"
        >This locum has not applied to any jobs yet.</div>
      </div>
      <div v-else>
          <div class="table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
            <!-- HEADER -->
            <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
              <div class="table-cell p-2 align-middle">Jobs Number</div> 
              <div class="table-cell p-2 align-middle">Practice / Surgery</div>
              <div class="table-cell p-2 align-middle">Title</div>
              <div class="table-cell p-2 align-middle">From</div>
              <div class="table-cell p-2 align-middle">To</div>
              <div class="table-cell p-2 align-middle">Created</div>
            </div>
            <!-- BODY -->
            <nuxt-link 
              v-for="(item, index) in appliedJobs" 
              :to="{ path: `/locums/${user.id}/locum-jobs/locum-applied-jobs/${item.id}`}"
              :key="`item-${index}`" 
              class="flex flex-col cursor-pointer xl:rounded-lg sm:flex-row sm:flex-wrap py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 md:table-row text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light" 
              draggable="false"
            >
              <div class="flex flex-col xl:px-6 sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">Job Number</strong>
                <span class="">{{item.job_number}}</span>
              </div>
              <div class="flex flex-col xl:px-6 w-full  sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
                <span class="">{{item.platform_job.practice.surgery.name}}</span>
              </div>
              <div class="flex flex-col xl:px-6  sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">Title</strong>
                <span class="">{{item.title}}</span>
              </div>
              <div class="flex flex-col xl:px-6  sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">From</strong>
                <span class="">{{item.date_start}}</span>
              </div>
              <div class="flex flex-col xl:px-6  sm:w-1/2 md:w-auto md:table-cell sm:px-1 py-2 md:py-4 align-middle">
                <strong class="block md:hidden text-sm uppercase">To</strong>
                <span class="">{{item.date_end}}</span>
              </div>
              <div class="flex flex-col xl:px-6  sm:w-1/2 md:w-auto md:table-cell sm:pl-1 sm:pr-4 py-2 md:py-4  align-middle">
                  <strong class="block md:hidden text-sm uppercase">Created</strong>
                <span class="">{{item.date_created}}</span>
              </div>
            </nuxt-link>
          </div>
        </div>
      <div v-if="!appliedJobs.length == 0" class="m-10 xl:-ml-32">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="currentPage"
          @pagechanged="pagechanged"
        />
      </div>

      <div class="job-shield" v-if="modal"></div>
      <transition name="slide" mode="out-in">
      <div class="job-modal shadow-lg" v-if="modal">
        <LocumDetailJobModal @close="modal = false" :job="job" />
      </div>
      </transition>

    </div>
  </div>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
import LocumDetailJobModal from '@/components/Locums/Jobs/LocumDetailJobModal'
export default {
  props: ['user'],
  components: {
    AppPagination,
    LocumDetailJobModal
  },
  data() {
    return {
      // appliedJobs: [],
      // total: 0,
      totalPages: 0,
      currentPage: 1,
      perPage: 0,
      ascendDescend: 0,
      modal:false
    }
  },
  beforeDestroy() {
    let query = Object.assign({}, this.$route.query)
    delete query.applied_job_page
    this.$router.push({ query })
  },
  watch: {
    $route(to, from) {
      this.currentPage = parseInt(to.query.applied_job_page)
      this.getAppliedJobs('date_created:desc')
    },

  },
  async created() {
    await this.$store.commit('jobs/TOGGLE_LOADING', true)
    const query = {
      ...this.$route.query,
      applied_job_page: this.$route.query.applied_job_page || 1
    }
    let params = {
      viewing_locum_user_id : this.user.id,
      locum_status : 'Applied'
    }
    Promise.all([
      this.$axios.$get(`/api/v1/admin/jobs/count`,{ params }).then(res => {
        this.$store.commit('jobs/SET_LOCUM_AVAILABLE_JOBS_COUNT', res.data.count)
        this.perPage = 10
        this.totalPages = Math.ceil(this.total / this.perPage)
      })
    ]).then(() => {
      this.getAppliedJobs('date_created:desc')
    })
  },
  computed: {
    total(){
      return this.$store.state.jobs.locum_available_jobs_count
    },
    appliedJobs(){
      return this.$store.state.jobs.locum_available_jobs
    }
  },
  methods: {
    getAppliedJobs(orderBy) {
      let offset = 0
      if (this.ascendDescend == 0) {
        orderBy = orderBy.replace('desc', 'asc')
        this.ascendDescend = 1
        console.log('true', this.ascendDescend)
      } else if (this.ascendDescend == 1) {
        orderBy = orderBy.replace('asc', 'desc')
        this.ascendDescend = 0
      }

      offset = this.perPage * (parseInt(this.$route.query.applied_job_page) - 1)
      let params = {
        viewing_locum_user_id: this.user.id,
        locum_status : 'Applied',
        order_by : ['id:desc',orderBy],
        limit: this.perPage,
        offset: offset
      }
      
      this.$axios.$get(`/api/v1/admin/jobs`,{ params }).then(res => {
        console.log('applied jobs', res)
        this.$store.commit('jobs/SET_LOCUM_AVAILABLE_JOBS',res.data.jobs )
        this.$store.commit('jobs/TOGGLE_LOADING', false)
      })
     
    },

    async pagechanged(e) {
      const query = {
        ...this.$route.query,
        applied_job_page: e || 1
      }
      await this.$store.commit('jobs/TOGGLE_LOADING', true)
      await this.$router.push({ query })
      await this.$store.commit('jobs/TOGGLE_LOADING', false)
    }

  }
}
</script>
<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}

</style>
