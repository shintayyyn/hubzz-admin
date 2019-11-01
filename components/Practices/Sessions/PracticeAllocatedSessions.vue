<template>
    <div>
        <div class="overflow-x-auto xl:overflow-hidden">
          <div v-if="allocatedJobs.length === 0">
            <div
            class="mt-10 w-full text-center text-white"
            >This practice is no allocated session/s.</div>
          </div>
          <div v-else>
            <AppJobHeaderSort :practice="practice" :tabStatus="'Allocated'" :currentPage="currentPage" :isJobParts="false" />
            <div class="w-full overflow-x-auto" > 
              <!-- BODY -->
              <nuxt-link 
                v-for="(item, index) in allocatedJobs" 
                :to="{ path: `/practices/${practice.id}/practice-sessions/practice-allocated-sessions/${item.id}`}"
                :key="`item-${index}`" 
              class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light" 
                draggable="false"
              >
                <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                  <strong class="block md:hidden text-sm uppercase">Job Number</strong>
                  <span class="">{{item.job_number}}</span>
                </div>
                <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                  <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
                  <span v-if="item.platform_job" class="">{{item.platform_job.practice.surgery.name}}</span>
                  <span v-else-if="item.private_job" class="">{{item.private_job.private_practice.surgery.name}}</span>
                </div>
                <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                  <strong class="block md:hidden text-sm uppercase">Title</strong>
                  <span class="">{{item.title}}</span>
                </div>
                <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                  <strong class="block md:hidden text-sm uppercase">From</strong>
                  <span class="">{{item.date_start}}</span>
                </div>
                <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                  <strong class="block md:hidden text-sm uppercase">To</strong>
                  <span class="">{{item.date_end}}</span>
                </div>
                <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                    <strong class="block md:hidden text-sm uppercase">Created</strong>
                  <span class="">{{item.date_created}}</span>
                </div>
              </nuxt-link>
            </div>
          </div>
          <!--PAGINATION-->
          <div v-if="!allocatedJobs.length == 0" class="m-10 xl:-ml-32">
            <AppPagination
              :total="total"
              :totalPages="totalPages"
              :currentPage="currentPage"
              @pagechanged="pagechanged"
            />
          </div>
          <!--PAGINATION ENDS HERE-->

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
        // allocatedJobs:[], 
        // total:0,
        job:null,
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
        this.getAllocatedJobs()
      },
    },
    created(){
      const query = {
        ...this.$route.query,
        job_page: this.$route.query.job_page || 1
      }
      this.currentPage = parseInt(query.job_page)
      let params = {
        viewing_practice_id : this.practice_id,
        surgery_id: this.practice_surgery ? this.practice_surgery.id : '',
        status : 'Allocated'
      }
      Promise.all([
        this.$axios.$get(`/api/v1/admin/jobs/count`,{ params }).then(res=>{
          // this.total = res.data.count
          this.$store.commit('jobs/SET_PRACTICE_ALLOCATED_SESSIONS_COUNT', res.data.count)
          this.perPage = 10
          this.totalPages = Math.ceil(this.total / this.perPage)
        })
      ]).then(() => {
        this.getAllocatedJobs('date_created:desc'),
        console.log(this.allocatedJobs)
      }).catch(err=>{
        console.log('get allocated jobs error!!!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })
    },
    computed:{
      total(){
        return this.$store.state.jobs.practice_allocated_sessions_count
      },
      allocatedJobs(){
        return this.$store.state.jobs.practice_allocated_sessions
      }
    },
    methods:{
      async getAllocatedJobs(orderBy){ 
        let offset = this.perPage * (parseInt(this.$route.query.job_page) - 1)
        let params = {
          viewing_practice_id : this.practice.id,
          status : 'Allocated',
          order_by :  orderBy ? orderBy : this.$route.query.order_by,
          surgery_id: this.practice_surgery ? this.practice_surgery.id : '',
          limit: this.perPage,
          offset: offset
        }
        await this.$axios.$get(`/api/v1/admin/jobs`,{ params }).then(res=>{
          this.$store.commit('jobs/SET_PRACTICE_ALLOCATED_SESSIONS', res.data.jobs)
          this.$store.commit('jobs/TOGGLE_LOADING', false)
          // this.allocatedJobs = res.data.jobs
        }).catch(err=>{
          console.log('get allocated jobs error!!!',err)
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
<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.job-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.job-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px orange;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .job-modal {
    width: 70%;
  }
}
</style>