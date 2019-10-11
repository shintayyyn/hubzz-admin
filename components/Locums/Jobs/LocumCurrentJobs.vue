<template>
    <div>
        <div class="overflow-x-auto xl:overflow-hidden">
          <div v-if="currentJobs.length === 0">
            <div
            class="mt-10 text-white w-full text-center"
            style="font-family: Nunito"
            >This locum is not currently hired to any job.</div>
          </div>
          <div v-else>
            <div class="flex flex-col text-white md:px-6" > 
              <!-- HEADER -->
              <div class="w-full hidden md:flex text-sm lg:text-base font-bold mt-4 mb-2"> 
                <div class="w-1/6">Job Number</div> 
                <div class="w-1/6">Practice / Surgery</div>
                <div class="w-1/6">Title</div>
                <div class="w-1/6">From</div>
                <div class="w-1/6">To</div>
                <div class="w-1/6">Created</div>
              </div>
              <!-- BODY -->
              <div 
                v-for="(item, index) in currentJobs" 
				        @click="$router.push(`/locums/${user.id}/locum-jobs/locum-current-jobs/${item.id}`)"
                :key="`item-${index}`" 
                class="w-full flex flex-col md:flex-row rounded-lg bg-waterloo hover:bg-waterloo-light my-2 shadow-lg cursor-pointer p-4 md:p-2 border-l-8 border-yellow-500 md:border-0" 
              >
                <div class="flex flex-col sm:w-1/2 md:w-1/6 md:table-cell p-2 md:py-4 align-middle">
                  <strong class="block md:hidden text-sm uppercase">Job Number</strong>
                  <span class="">{{item.job_number}}</span>
                </div>
                <div class="flex flex-col sm:w-1/2 md:w-1/6 md:table-cell p-2 md:py-4 align-middle">
                  <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
                  <span v-if="item.platform_job" class="">{{item.platform_job.practice.surgery.name}}</span>
                  <span v-else-if="item.private_job" class="">{{item.private_job.private_practice.surgery.name}}</span>
                </div>
                <div class="flex flex-col sm:w-1/2 md:w-1/6 md:table-cell p-2 md:py-4 align-middle">
                  <strong class="block md:hidden text-sm uppercase">Title</strong>
                  <span class="">{{item.title}}</span>
                </div>
                <div class="flex flex-col sm:w-1/2 md:w-1/6 md:table-cell p-2 md:py-4 align-middle">
                  <strong class="block md:hidden text-sm uppercase">From</strong>
                  <span class="">{{item.date_start}}</span>
                </div>
                <div class="flex flex-col sm:w-1/2 md:w-1/6 md:table-cell p-2 md:py-4 align-middle">
                  <strong class="block md:hidden text-sm uppercase">To</strong>
                  <span class="">{{item.date_end}}</span>
                </div>
                <div class="flex flex-col sm:w-1/2 md:w-1/6 md:table-cell p-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Created</strong>
                  <span class="">{{item.date_created}}</span>
                </div>
              </div>
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
    props:['user'],
    components:{
      AppPagination,
      LocumDetailJobModal
    },
    data(){
      return{ 
        // currentJobs:[],
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
      delete query.current_job_page
      this.$router.push({ query })
    },
    watch: {
      $route(to, from) {
        this.currentPage = parseInt(to.query.current_job_page)
        this.getCurrentJobs('date_created:desc')
      },

    },
    async created(){
      await this.$store.commit('jobs/TOGGLE_LOADING', true)
      const query = {
        ...this.$route.query,
        current_job_page: this.$route.query.current_job_page || 1
      }
      this.currentPage = parseInt(query.current_job_page)
      let params = {
        viewing_locum_user_id : this.user.id,
        locum_status: 'Current'
      }
      Promise.all([
        this.$axios.$get(`/api/v1/admin/jobs/count`,{ params }).then(res=>{
          this.$store.commit('jobs/SET_LOCUM_CURRENT_JOBS_COUNT', res.data.count)
          // this.total = res.data.count
          this.perPage = 10
          this.totalPages = Math.ceil(this.total / this.perPage)
        })
      ]).then(() => {
        this.getCurrentJobs('date_created:desc')
      })
    },
    computed:{
      total(){
        return this.$store.state.jobs.locum_current_jobs_count
      },
      currentJobs(){
        return this.$store.state.jobs.locum_current_jobs
      }
    },
    methods:{
      getCurrentJobs(orderBy){
        let offset = 0
        if(this.ascendDescend == 0){
          orderBy = orderBy.replace('desc','asc')
          this.ascendDescend = 1
        }else if(this.ascendDescend == 1){
          orderBy = orderBy.replace('asc','desc')
          this.ascendDescend = 0
        }
        
        offset = this.perPage * (parseInt(this.$route.query.current_job_page) - 1)
        let params = {
          viewing_locum_user_id : this.user.id,
          locum_status:'Current',
          order_by:['id:desc',orderBy],
          limit:this.perPage,
          offset:offset
        }
        this.$axios.$get(`/api/v1/admin/jobs`,{ params }).then(res => {
          this.$store.commit('jobs/SET_LOCUM_CURRENT_JOBS', res.data.jobs)
          this.$store.commit('jobs/TOGGLE_LOADING', false)
        })
      },
      async pagechanged(e) {
        const query = {
          ...this.$route.query,
          current_job_page: e || 1
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