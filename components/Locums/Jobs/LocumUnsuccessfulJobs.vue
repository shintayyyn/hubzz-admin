<template>
    <div>
      <div class="overflow-x-auto overflow-y-hidden">
        <div v-if="unsuccessfulJobs.length === 0">
          <div
          class="mt-10 w-full text-white text-center"
          style="font-family: Nunito"
          >This locum hasn't been rejected to any jobs yet.</div>
        </div>
        <div v-else>
          <AppJobHeaderSort :locumUser="user" :locumTabStatus="'Unsuccessful'" :currentPage="currentPage" />
            <div class="w-full overflow-x-auto" > 
            <!-- HEADER -->
            <!-- <div class="w-full hidden md:flex text-sm lg:text-base font-bold mt-4 mb-2"> 
              <div class="w-1/6">Job Number</div> 
              <div class="w-1/6">Practice / Surgery</div>
              <div class="w-1/6">Title</div>
              <div class="w-1/6">From</div>
              <div class="w-1/6">To</div>
              <div class="w-1/6">Created</div>
            </div> -->
            <!-- BODY -->
            <div 
              v-for="(item, index) in unsuccessfulJobs" 
              @click="$router.push(`/locums/${user.id}/locum-jobs/locum-unsuccessful-jobs/${item.id}`)"
              :key="`item-${index}`" 
              class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light" 
            >
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
                <strong class="block md:hidden text-sm uppercase">Job Number</strong>
                <span class="">{{item.job_number}}</span>
              </div>
              <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle md:text-center">
                <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
                <span class="">{{item.platform_job.practice.surgery.name}}</span>
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
            </div>
          </div>
        </div>
        <div v-if="!unsuccessfulJobs.length == 0" class="">
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
import AppJobHeaderSort from '@/components/Base/AppJobHeaderSort'
export default {
    props:['user'],
    components:{
      AppPagination,
      LocumDetailJobModal,
      AppJobHeaderSort
    },
    data(){
      return{
        totalPages:0,
        currentPage:1,
        perPage:0,
        ascendDescend:0,
        modal:false
      }
    },
    beforeDestroy() {
      let query = Object.assign({}, this.$route.query)
      delete query.unsuccessful_job_page
      this.$router.push({ query })
    },
    watch: {
      $route(to, from) {
        this.currentPage = parseInt(to.query.unsuccessful_job_page)
        this.getUnsuccessfulJobs()
      },
    },
    async created(){
      await this.$store.commit('jobs/TOGGLE_LOADING',true)
      const query = {
        ...this.$route.query,
        unsuccessful_job_page: this.$route.query.unsuccessful_job_page || 1
      }
      this.currentPage = parseInt(query.unsuccessful_job_page)
      let params = {
        viewing_locum_user_id : this.user.id,
        locum_status : 'Unsuccessful'
      }
      Promise.all([
        console.log(this.user),
        this.$axios.$get(`/api/v1/admin/jobs/count`,{ params }).then(res=>{
          this.$store.commit('jobs/SET_LOCUM_UNSUCCESSFUL_JOBS_COUNT', res.data.count)
          this.perPage = 10
          this.totalPages = Math.ceil(this.total / this.perPage)
        })
      ]).then(() => {
        this.getUnsuccessfulJobs('date_created:desc'),
        console.log(this.unsuccessfulJobs)
      })
    },
    computed:{
      total(){
        return this.$store.state.jobs.locum_unsuccessful_jobs_count
      },
      unsuccessfulJobs(){
        return this.$store.state.jobs.locum_unsuccessful_jobs
      }
    },
    methods:{
      getUnsuccessfulJobs(orderBy){
        let offset = this.perPage * (parseInt(this.$route.query.unsuccessful_job_page) - 1)
        let params = {
          viewing_locum_user_id : this.user.id,
          locum_status : 'Unsuccessful',
          order_by : orderBy ? orderBy : this.$route.query.order_by,
          limit: this.perPage,
          offset: offset
        }
        this.$axios.$get(`/api/v1/admin/jobs`,{ params }).then(res=>{
          this.$store.commit('jobs/SET_LOCUM_UNSUCCESSFUL_JOBS', res.data.jobs)
          this.$store.commit('jobs/TOGGLE_LOADING',false)
        })
       
      },
      async pagechanged(e) {
        const query = {
          ...this.$route.query,
          unsuccessful_job_page: e || 1
        }
        await this.$store.commit('jobs/TOGGLE_LOADING', true)
        await this.$router.push({ query })
        await this.$store.commit('jobs/TOGGLE_LOADING', false)
      }
    }
}
</script>
