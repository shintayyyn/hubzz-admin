<template>
    <div>
      <div class="overflow-x-auto overflow-y-hidden">
        <div v-if="ongoingJobParts.length === 0">
          <div
          class="mt-10 w-full text-center text-white"
          >This practice has no ongoing sessions.</div>
        </div>
        <div v-else>
          <AppJobHeaderSort :practice="practice" :tabStatus="'Ongoing'" :currentPage="currentPage" :isJobParts="true" />
          <div class="w-full overflow-x-auto" > 
            <!-- BODY -->
            <div 
              v-for="(item, index) in ongoingJobParts" 
              @click="$router.push(`/practices/${practice.id}/practice-sessions/practice-ongoing-sessions/${item.id}`)" 
              :key="`item-${index}`" 
              class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light" 
            >
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
                <strong class="block md:hidden text-sm uppercase">Job Number</strong>
                <span class="break-words">{{item.job_part_number}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
                <span class="break-words">{{item.job.platform_job.practice.surgery.name}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">Title</strong>
                <span class="break-words">{{item.job.title}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">From</strong>
                <span class="break-words">{{item.date_start}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">To</strong>
                <span class="break-words">{{item.date_end}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                  <strong class="block md:hidden text-sm uppercase">Created</strong>
                <span class="break-words">{{item.job.date_created}}</span>
              </div>
            </div>
          </div>
          
        </div>
         <div v-if="ongoingJobParts.length > 0" class="">
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
    props:['practice','practice_surgery'],
    components:{
      AppPagination,
      PracticeSessionModal,
      AppJobHeaderSort
    },
    data(){
      return{
        // ongoingJobParts:[],
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
      delete query.job_parts_page
      this.$router.push({ query })
    },
    watch: {
      $route(to, from) {
        this.currentPage = parseInt(to.query.job_parts_page)
        this.getOngoingSessions()
      },
    },
    async created(){
      await this.$store.commit('jobs/TOGGLE_LOADING', true)
      const query = {
        ...this.$route.query,
        job_parts_page: this.$route.query.job_parts_page || 1
      }
      this.currentPage = parseInt(query.job_parts_page)
      let params = {
        viewing_practice_id : this.practice.id,
        job_surgery_id: this.practice_surgery ? this.practice_surgery.id : '',
        status : 'Ongoing'
      }
      Promise.all([
        this.$axios.$get(`/api/v1/admin/job-parts/count`,{ params }).then(res=>{
          this.$store.commit('jobs/SET_PRACTICE_ONGOING_SESSIONS_COUNT',res.data.count)
          this.perPage = 10
          this.totalPages = Math.ceil(this.total / this.perPage)
        })
      ]).then(() => {
        this.getOngoingSessions('date_created:desc')
      }).catch(err=>{
        console.log('get applied jobs error!!!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })
    },
  computed:{
    total(){
      return this.$store.state.jobs.practice_ongoing_sessions_count
    },
    ongoingJobParts(){
      return this.$store.state.jobs.practice_ongoing_sessions
    }
  },
    methods:{
      async getOngoingSessions(orderBy){
        let offset = this.perPage * (parseInt(this.$route.query.job_parts_page) - 1)
        let params = {
          viewing_practice_id : this.practice.id,
          status : 'Ongoing',
          order_by : orderBy ? orderBy : this.$route.query.order_by,
          job_surgery_id: this.practice_surgery ? this.practice_surgery.id : '',
          limit: this.perPage,
          offset: offset
        }
        await this.$axios.$get(`/api/v1/admin/job-parts`, { params }).then(res=>{
          // this.jobParts = res.data.job_parts
          this.$store.commit('jobs/SET_PRACTICE_ONGOING_SESSIONS', res.data.job_parts)
          this.$store.commit('jobs/TOGGLE_LOADING', false)
        }).catch(err=>{
          console.log('get job parts error!!!',err)
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        })
      },
      async pagechanged(e) {
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