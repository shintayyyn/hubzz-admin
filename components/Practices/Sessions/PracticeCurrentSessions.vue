<template>
    <div>
        <div class="overflow-x-auto xl:overflow-hidden">
          <div v-if="currentJobs.length === 0">
            <div
            class="mt-10 w-full text-center text-white"
            >This practice is no currently ongoing session/s.</div>
          </div>
          <div v-else>
            <div class="table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
              <!-- HEADER -->
              <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
                <div class="table-cell p-2 align-middle">Job Number</div> 
                <div class="table-cell p-2 align-middle">Practice / Surgery</div>
                <div class="table-cell p-2 align-middle">Title</div>
                <div class="table-cell p-2 align-middle">From</div>
                <div class="table-cell p-2 align-middle">To</div>
                <div class="table-cell p-2 align-middle">Created</div>
              </div>
              <!-- BODY -->
              <nuxt-link 
                v-for="(item, index) in currentJobs" 
                 :to="{ path: `/practices/${practice.id}/practice-sessions/practice-current-sessions/${item.id}`}"
                :key="`item-${index}`" 
                class="flex flex-col cursor-pointer xl:rounded-lg sm:flex-row sm:flex-wrap py-2 my-2 rounded-lg border-l-8 border-yellow-dark md:border-l-0 md:table-row text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light" 
                draggable="false"
              >
                <div class="flex flex-col xl:px-6 sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 py-2 md:py-4 align-middle">
                  <strong class="block md:hidden text-sm uppercase">Job Number</strong>
                  <span class="">{{item.job_number}}</span>
                </div>
                <div class="flex flex-col xl:px-6 w-full  sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                  <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
                  <span v-if="item.platform_job" class="">{{item.platform_job.practice.surgery.name}}</span>
                  <span v-else-if="item.private_job" class="">{{item.private_job.private_practice.surgery.name}}</span>
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
          <!--PAGINATION-->
          <div v-if="!currentJobs.length == 0" class="m-10 xl:-ml-32">
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
export default {
    props:['practice'],
    components:{
      AppPagination,
      PracticeSessionModal
    },
    data(){
      return{ 
        // currentJobs:[], 
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
      delete query.current_job_page
      this.$router.push({ query })
    },
    watch: {
      $route(to, from) {
        this.currentPage = parseInt(to.query.current_job_page)
        this.getCurrentJobs('date_created:desc')
      },

    },
    created(){
      const query = {
        ...this.$route.query,
        current_job_page: this.$route.query.current_job_page || 1
      }
      let params = {
        practince_id : this.practice_id,
        status : 'Current'
      }
      Promise.all([
        this.$axios.$get(`/api/v1/admin/jobs/count?practice_id=${this.practice.id}&status=Current`).then(res=>{
          // this.total = res.data.count
          this.$store.commit('jobs/SET_PRACTICE_CURRENT_SESSIONS_COUNT', res.data.count)
          this.perPage = 5
          this.totalPages = Math.ceil(this.total / this.perPage)
        })
      ]).then(() => {
        this.getCurrentJobs('date_created:desc'),
        console.log(this.currentJobs)
      }).catch(err=>{
        console.log('get current jobs error!!!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      })
    },
    computed:{ 
      total(){
        return this.$store.state.jobs.practice_current_sessions_count
      },
      currentJobs(){
        return this.$store.state.jobs.practice_current_sessions
      }
    },
    methods:{
      async getCurrentJobs(orderBy){ 
        let offset = 0
        if(this.ascendDescend == 0){
          orderBy = orderBy.replace('desc','asc')
          this.ascendDescend = 1
          console.log('true',this.ascendDescend)
        }else if(this.ascendDescend == 1){
          orderBy = orderBy.replace('asc','desc')
          this.ascendDescend = 0
        }
        let params = {
          practice_id : this.practice.id,
          status : 'Current',
          order_by : ['id:desc',orderBy],
          limit: this.perPage,
          offset: offset
        }
        offset = this.perPage * (parseInt(this.$route.query.current_job_page) - 1)
        await this.$axios.$get(`/api/v1/admin/jobs`,{ params }).then(res=>{
          this.$store.commit('jobs/SET_PRACTICE_CURRENT_SESSIONS', res.data.jobs)
          // this.currentJobs = res.data.jobs
        }).catch(err=>{
          console.log('get current jobs error!!!',err)
          this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
        })
      
      },
      pagechanged(e) {
        const query = {
          ...this.$route.query,
          current_job_page: e || 1
        }
        this.$router.push({ query })
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