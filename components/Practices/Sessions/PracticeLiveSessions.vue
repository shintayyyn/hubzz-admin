<template>
  <div>
    <div class="overflow-x-auto overflow-y-hidden">
      <div v-if="availableJobs.length == 0">
        <div
          class="mt-10 w-full text-center text-white"
        >This practice has no available session/s.</div>
      </div>
      <div v-else>
          <AppJobHeaderSort :practice="practice" :tabStatus="'Live'" :currentPage="currentPage" />
          <div class="table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
            <!-- BODY -->
            <nuxt-link 
              v-for="(item, index) in availableJobs" 
               :to="{ path: `/practices/${practice.id}/practice-sessions/practice-live-sessions/${item.id}`}"
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
      <div v-if="!availableJobs.length == 0" class="m-10 xl:-ml-32">
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
          <PracticeSessionModal @close="modal = false" :job="job" />
        </div>
      </transition>

    </div>
  </div>
</template>
<script>
import AppPagination from '@/components/Base/AppPagination'
import PracticeSessionModal from '@/components/Practices/Sessions/PracticeSessionModal'
import AppJobHeaderSort from '@/components/Base/AppJobHeaderSort'
export default {
  props: ['practice', 'practice_surgery'],
  components: {
    AppPagination,
    PracticeSessionModal,
    AppJobHeaderSort
  },
  data() {
    return {
      // availableJobs: [],
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
    delete query.job_page
    this.$router.push({ query })
  },
  watch: {
    $route(to, from) {
      this.currentPage = parseInt(to.query.job_page)
      this.getAvailableJobs()
    },
  },
  async created() {
    await this.$store.commit('jobs/TOGGLE_LOADING', true)
    const query = {
      ...this.$route.query,
      job_page: this.$route.query.job_page || 1
    }
    this.currentPage = parseInt(query.job_page)
    let params = {
      viewing_practice_id : this.practice.id,
      surgery_id: this.practice_surgery ? this.practice_surgery.id : '',
      status : 'Live'
    }
    Promise.all([
      this.$axios.$get(`/api/v1/admin/jobs/count`, { params }).then(res => {
        // this.total = res.data.count
        this.$store.commit('jobs/SET_PRACTICE_LIVE_SESSIONS_COUNT', res.data.count)
        this.perPage = 10
        this.totalPages = Math.ceil(this.total / this.perPage)
      })
    ]).then(() => {
      this.getAvailableJobs('date_created:desc'),
      console.log(this.availableJobs)
    })
  },
  computed: {
    total(){
      return this.$store.state.jobs.practice_available_sessions_count
    },
    availableJobs(){
      return this.$store.state.jobs.practice_available_sessions
    }
  },
  methods: {
    async getAvailableJobs(orderBy) {
      let offset = parseInt(this.perPage) * (parseInt(this.$route.query.job_page) - 1)
      let params = {
        viewing_practice_id : this.practice.id,
        status : 'Live',
        order_by : orderBy ? orderBy : this.$route.query.order_by,
        surgery_id: this.practice_surgery ? this.practice_surgery.id : '',
        limit: this.perPage,
        offset: offset
      }
      await this.$axios.$get(`/api/v1/admin/jobs`,{ params }).then(res => {
        this.$store.commit('jobs/SET_PRACTICE_LIVE_SESSIONS', res.data.jobs)
        this.$store.commit('jobs/TOGGLE_LOADING',false)
        // this.availableJobs = res.data.jobs
      }).catch(err=>{
        console.log('get available jobs error!!!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })

    },
    async pagechanged(e) {
      const query = {
        ...this.$route.query,
        job_page: e || 1
      }
      await this.$store.commit('jobs/TOGGLE_LOADING', true)
      await this.$router.push({ query })
      await this.$store.commit('jobs/TOGGLE_LOADING', false)
    }
  }
}
</script>
