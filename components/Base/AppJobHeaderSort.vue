<template>
  <div>
    <div class="w-4/6 mx-6 mt-6 font-semibold">
       <div class="flex flex-row text-white"> 
        <div class="w-1/6 align-middle" @click="sortBy('job_number',currentPage,search)">
          Job Number
          <svgicon v-if="sortedBy!='job_number'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='job_number'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='job_number'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div> 
        <div class="w-2/6 align-middle" @click="sortBy('surgery_name',currentPage,search)">
          Practice / Surgery
          <svgicon v-if="sortedBy!='surgery_name'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='surgery_name'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='surgery_name'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="w-1/6 align-middle" @click="sortBy('title',currentPage,search)">
          Title
          <svgicon v-if="sortedBy!='title'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='title'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='title'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="w-1/6 align-middle" @click="sortBy('date_start',currentPage,search)">
          From
          <svgicon v-if="sortedBy!='date_start'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='date_start'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='date_start'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="w-1/6 align-middle" @click="sortBy('date_end',currentPage,search)">
          To
           <svgicon v-if="sortedBy!='date_end'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='date_end'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='date_end'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="w-1/6 align-middle" @click="sortBy('date_created',currentPage,search)">
          Created
           <svgicon v-if="sortedBy!='date_created'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='date_created'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='date_created'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
      </div>
    </div>
   
  </div>
</template>
<script>
export default {
  props:['tabStatus','locumTabStatus', 'practice','locumUser', 'currentPage'],
  data(){
    return{
      jobs:{},
      counter: 0,
      perPage: 10,

      search: '',
      paramSort:{
        order_by:''
      },
      sort:'',
      sortedBy:'',
      sortType:'',
      order_by:'',
    }
  },  
  methods:{
    getQuery(){
			const query = {
				...this.$route.query
			}
			const offset = parseInt(query.job_page)*10 - 10 
			return offset
		},
    async sortBy(sortedBy,job_page,search) {
      await this.$store.commit('jobs/TOGGLE_LOADING', true)
      if(this.sortedBy == sortedBy && this.sortType == true){
        this.paramSort.order_by ='date_created:desc'
        this.sortedBy = ''
      }else{
        this.sortedBy = sortedBy
        this.sortType = !this.sortType
        this.paramSort.order_by = await `${sortedBy}:${this.sortType ? 'asc' : 'desc'}`
      }
			let order_by = await this.paramSort.order_by
			let query = {
				...this.$router.query,
				order_by
			}
			if (job_page === 1) {
				delete query.job_page
			}
			if(job_page){
				query = {
					...this.$router.query,
					job_page,order_by
				}
			}
			if(search){
				query = {
					...this.$router.query,
					search,order_by
				}
			}
			if(job_page & search){
				query = {
					...this.$router.query,
					job_page,search,order_by
				}
			}
			
			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
			this.loading = true
      }
      this.getJobs()
			this.$router.push({ query })

    },
    async getJobs(){
      let params = {
        viewing_practice_id : this.practice ? this.practice.id : null,
        viewing_locum_user_id: this.locumUser ? this.locumUser.id : null,
        status : this.tabStatus ? this.tabStatus : null,
        locum_status : this.locumTabStatus ? this.locumTabStatus : null,
        order_by : this.paramSort.order_by,
        surgery_id: this.practice_surgery ? this.practice_surgery.id : '',
        limit: this.perPage,
        offset: this.getQuery()
      }
      await this.$axios.$get(`/api/v1/admin/jobs`,{ params }).then( async res => {
        if(this.practice){
          await this.$store.commit(`jobs/SET_PRACTICE_${this.tabStatus.toUpperCase()}_SESSIONS`, res.data.jobs)
          await this.$store.commit('jobs/TOGGLE_LOADING', false)
        }else if(this.locumUser){
          await this.$store.commit(`jobs/SET_LOCUM_${this.locumTabStatus.toUpperCase()}_JOBS`, res.data.jobs)
          await this.$store.commit('jobs/TOGGLE_LOADING', false)
        }
      })
    },  
  },  

}
</script>
<style>

</style>