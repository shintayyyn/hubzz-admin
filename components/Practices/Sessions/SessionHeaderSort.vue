<template>
  <div>
    <div class="w-4/6 mx-6 font-semibold">
       <div class="flex flex-row text-white"> 
        <div class="w-1/6 align-middle">
          Job Number
          <svgicon v-if="sortedBy!='job_number'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='job_number'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='job_number'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div> 
        <div class="w-2/6 align-middle">
          Practice / Surgery
          <svgicon v-if="sortedBy!='surgery_name'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='surgery_name'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='surgery_name'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="w-1/6 align-middle">
          Title
          <svgicon v-if="sortedBy!='title'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='title'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='title'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="w-1/6 align-middle">
          From
          <svgicon v-if="sortedBy!='date_start'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='date_start'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='date_start'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="w-1/6 align-middle">
          To
           <svgicon v-if="sortedBy!='date_end'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='date_end'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='date_end'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="w-1/6 align-middle">
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
  props:['tabStatus', 'tabType'],
  data(){
    return{
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
  created(){

  },
  methods:{
    async sortBy(sortedBy,page,search) {
      if(this.sortedBy == sortedBy && this.sortType == true){
        this.paramSort.order_by ='created_at:desc'
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
			if (page === 1) {
				delete query.page
			}
			if(page){
				query = {
					...this.$router.query,
					page,order_by
				}
			}
			if(search){
				query = {
					...this.$router.query,
					search,order_by
				}
			}
			if(page & search){
				query = {
					...this.$router.query,
					page,search,order_by
				}
			}
			
			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
			this.loading = true
			}
			this.$router.push({ query })
			this.getJobs(this.paramSort)
    },
    getJobs(){
      
    },  
  },  

}
</script>
<style>

</style>