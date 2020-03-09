<template>
  <div>
    <div class="overflow-x-auto overflow-y-hidden">
      <div v-if="approvedJobParts.length === 0">
        <div
          class="mt-10 w-full text-center text-white"
        >
          This practice has no approved sessions.
        </div>
      </div>

      <div v-else>
        <AppJobHeaderSort :practice="practice" tab-status="Approved" :current-page="currentPage" :is-job-parts="true" />
        <div class="w-full overflow-x-auto"> 
          <!-- HEADER -->
          <!-- <div class="w-full hidden md:flex text-sm lg:text-base font-bold mt-4 mb-2"> 
              <div class="w-1/6 md:px-2">Job Number</div> 
              <div class="w-1/6 md:px-2">Practice / Surgery</div>
              <div class="w-1/6 md:px-2">Title</div>
              <div class="w-1/6 md:px-2">From</div>
              <div class="w-1/6 md:px-2">To</div>
              <div class="w-1/6 md:px-2">Created</div>
            </div> -->
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
              <span class="break-words">{{ item.job.platform_job.practice.surgery.name }}</span>
            </div>
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Title</strong>
              <span class="break-words">{{ item.job.title }}</span>
            </div>
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">From</strong>
              <span class="break-words">{{ $moment(item.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}</span>
            </div>
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">To</strong>
              <span class="break-words">{{ $moment(item.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY') }}</span>
            </div>
            <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
              <strong class="block md:hidden text-sm uppercase">Created</strong>
              <span class="">{{ $moment(item.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }}</span>
            </div>
          </nuxt-link>
        </div>
      </div>

      <div v-if="!approvedJobParts.length == 0" class="">
        <AppPagination
          :total="total"
          :total-pages="totalPages"
          :current-page="currentPage"
          :per-page="perPage"
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
import AppPagination from '@/components/Base/AppPagination'
import PracticeSessionModal from '@/components/Practices/Sessions/PracticeSessionModal'
import AppJobHeaderSort from '@/components/Base/AppJobHeaderSort'
export default {
    components:{
      AppPagination,
      PracticeSessionModal,
      AppJobHeaderSort
    },
    props:{
      practice: {
        type: Object,
        default: null,
      },
      practice_surgery: {
        type: Object,
        default: null,
      },
    },
    data (){
      return{
        // approvedJobParts:[],
        // total:0,
        totalPages:0,
        currentPage:1,
        perPage:0,
        ascendDescend:0,
        modal:false
      }
    },
  computed:{
    total (){
      return this.$store.state.jobs.practice_approved_sessions_count
    },
    approvedJobParts (){
      return this.$store.state.jobs.practice_approved_sessions
    }
  },
    watch: {
      $route (to) {
        this.currentPage = parseInt(to.query.job_parts_page)
        this.getApprovedSessions()
      },
    },
    beforeDestroy () {
      let query = Object.assign({}, this.$route.query)
      delete query.job_parts_page
      this.$router.push({ query })
    },
    async created (){
      await this.$store.commit('jobs/TOGGLE_LOADING', true)
      const query = {
        ...this.$route.query,
        job_parts_page: this.$route.query.job_parts_page || 1
      }
      this.currentPage = parseInt(query.job_parts_page)
      let params = {
        // viewing_practice_id : this.practice_surgery ? this.practice_surgery.child_practice_id : this.practice.id,
        job_practice_id: this.practice_surgery ? this.practice_surgery.child_practice_id : this.practice.id,
        status : 'Approved'
      }
      Promise.all([
        this.$axios.$get(`/api/v1/admin/job-parts/count`,{ params }).then(res=>{
          // this.total = res.data.count
          this.$store.commit('jobs/SET_PRACTICE_APPROVED_SESSIONS_COUNT',res.data.count)
          this.perPage = 10
          this.totalPages = Math.ceil(this.total / this.perPage)
        })
      ]).then(() => {
        this.getApprovedSessions('date_created:desc')
      }).catch(err=>{
        console.log('get applied jobs error!!!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })
    },
    methods:{
      checkRoute (itemId){
        if (this.$route.name.includes('practice-surgeries')) {
          return { path: `/practices/${this.practice.id}/practice-surgeries/${this.practice_surgery.id}/surgery-sessions/surgery-approved-sessions/${itemId}` }
        } else if(this.$route.name.includes('practice-sessions')) {
          return { path: `/practices/${this.practice.id}/practice-sessions/practice-approved-sessions/${itemId}` }
        }
      },
      async getApprovedSessions (orderBy){
        let offset = this.perPage * (parseInt(this.$route.query.job_parts_page) - 1)
        let params = {
          status : 'Approved',
          order_by : orderBy ? orderBy : this.$route.query.order_by,
          job_practice_id: this.practice_surgery ? this.practice_surgery.child_practice_id : this.practice.id,
          limit: this.perPage,
          offset: offset
        }
        await this.$axios.$get(`/api/v1/admin/job-parts`, { params }).then(res => {
          // this.jobParts = res.data.job_parts
          console.log('res', res.data.job_parts)
          this.$store.commit('jobs/SET_PRACTICE_APPROVED_SESSIONS', res.data.job_parts)
          this.$store.commit('jobs/TOGGLE_LOADING', false)
        }).catch(err=>{
          console.log('get job parts error!!!',err)
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        })
      },
      async pagechanged (e) {
        const query = {
          ...this.$route.query,
          job_parts_page: e || 1
        }
        await this.$store.commit('jobs/TOGGLE_LOADING', true)
        await this.$router.push({ query })
        await this.$store.commit('jobs/TOGGLE_LOADING', false)
      }
    }

}
</script>