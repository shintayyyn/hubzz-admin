<template>
    <div>
      <div class="overflow-x-auto overflow-y-hidden">
        <div v-if="withdrawnJobs.length === 0">
          <div
          class="mt-10 w-full text-center text-white"
          >This practice has no withdrawn session/s yet.</div>
        </div>
        <div v-else>
          <AppJobHeaderSort :practice="practice" :tabStatus="'Withdrawn'" :currentPage="currentPage" :isJobParts="false" />
          <div class="w-full overflow-x-auto" > 
            <!-- BODY -->
            <nuxt-link 
              v-for="(item, index) in withdrawnJobs" 
              :to="checkRoute(item.id)"
              :key="`item-${index}`" 
              class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light" 
              draggable="false"
            >
               <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
                <strong class="block md:hidden text-sm uppercase">Job Number</strong>
                <span class="">{{item.job_part_number}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
                <span class="">{{item.job.platform_job.practice.surgery.name}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">Title</strong>
                <span class="">{{item.job.title}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">From</strong>
                <span class="">{{$moment(item.date_start,'YYYY-MM-DD[T]').format('DD/MM/YYYY')}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">To</strong>
                <span class="">{{$moment(item.date_end,'YYYY-MM-DD[T]').format('DD/MM/YYYY')}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">Created</strong>
                <span class="">{{ $moment(item.date_created, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('DD/MM/YYYY, h:mm:ss a') }}</span>
              </div>
            </nuxt-link>
          </div>
        </div>
        <div v-if="!withdrawnJobs.length == 0" class="">
          <AppPagination
            :total="total"
            :totalPages="totalPages"
            :currentPage="currentPage"
            :perPage="perPage"
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
    props:['practice', 'practice_surgery'],
    components:{
      AppPagination,
      PracticeSessionModal,
      AppJobHeaderSort
    },
    data(){
      return{
        // withdrawnJobs:[],
        // total:0,
        totalPages:0,
        currentPage:1,
        perPage:0,
        ascendDescend:0,
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
        this.getWithdrawnJobs()
      },
    },
    async created(){
      await this.$store.commit('jobs/TOGGLE_LOADING', true)
      const query = {
        ...this.$route.query,
        job_page: this.$route.query.job_page || 1
      }
      this.currentPage = parseInt(query.job_page)
      let params = {
        // viewing_practice_id : this.practice_surgery ? this.practice_surgery.child_practice_id : this.practice.id,
        job_practice_id: this.practice_surgery ? this.practice_surgery.child_practice_id : this.practice.id,
        status : 'Withdrawn'
      }
      Promise.all([
        this.$axios.$get(`/api/v1/admin/job-parts/count`,{ params }).then(res=>{
          // this.total = res.data.count
          this.$store.commit('jobs/SET_PRACTICE_WITHDRAWN_SESSIONS_COUNT',res.data.count)
          this.perPage = 10
          this.totalPages = Math.ceil(this.total / this.perPage)
        })
      ]).then(() => {
        this.getWithdrawnJobs('date_created:desc')
      })
    },
    computed:{ 
      total(){
        return this.$store.state.jobs.practice_withdrawn_sessions_count
      },
      withdrawnJobs(){
        return this.$store.state.jobs.practice_withdrawn_sessions
      } 
    },
    methods:{
      checkRoute(itemId){
        if (this.$route.name.includes('practice-surgeries')) {
          return { path: `/practices/${this.practice.id}/practice-surgeries/${this.practice_surgery.id}/surgery-sessions/surgery-withdrawn-sessions/${itemId}` }
        } else if(this.$route.name.includes('practice-sessions')) {
          return { path: `/practices/${this.practice.id}/practice-sessions/practice-withdrawn-sessions/${itemId}` }
        }
      },
      async getWithdrawnJobs(orderBy){
        let offset = this.perPage * (parseInt(this.$route.query.job_page) - 1)
        let params = {
          // viewing_practice_id : this.practice.id,
          status : 'Withdrawn',
          order_by : orderBy ? orderBy : this.$route.query.order_by,
          job_practice_id: this.practice_surgery ? this.practice_surgery.child_practice_id : this.practice.id,
          limit: this.perPage,
          offset: offset
        }
        
        await this.$axios.$get(`/api/v1/admin/job-parts`, { params }).then(res=>{
          //this.withdrawnJobs = res.data.jobs
          console.log('withdrawn', res.data.jobs)
          this.$store.commit('jobs/SET_PRACTICE_WITHDRAWN_SESSIONS', res.data.job_parts)
          this.$store.commit('jobs/TOGGLE_LOADING', false)
        }).catch(err=>{
          console.log('get withdrawn jobs error!!!',err)
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
