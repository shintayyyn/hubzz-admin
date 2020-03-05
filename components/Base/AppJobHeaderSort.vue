<template>
  <div>
    <div class="w-full md:mt-6">
      <div class="md:hidden flex items-center text-white">
        <label for="sort" class="text-sm whitespace-no-wrap">Sort by</label>
        <select 
          v-model="sort"
          class="outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 focus:hubzz-yellow bg-waterloo ml-2"
        >
          <option selected>
            Job Number
          </option>
          <option>Practice/Surgery</option>
          <option>Title</option>
          <option>From</option>
          <option>To</option>
          <option>Created</option>
        </select>
      </div>

      <div class="hidden md:flex items-center text-sm text-white justify-around font-semibold"> 
        <div class="align-middle px-2 w-1/6 cursor-pointer" @click="sortBy(isJobParts ? 'job_part_number':'job_number',currentPage,search)">
          {{ isJobParts ? 'Job Part Number' : 'Job Number' }}
          <svgicon v-if="sortedBy!='job_number' && sortedBy!='job_part_number' " class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && (sortedBy=='job_number' || sortedBy=='job_part_number')" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white" />
          <svgicon v-if="sortType==false && (sortedBy=='job_number' || sortedBy=='job_part_number')" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white" />
        </div> 
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy(isJobParts ? 'job_surgery_name':'surgery_name',currentPage,search)">
          Practice / Surgery
          <svgicon v-if="sortedBy!='surgery_name' && sortedBy!='job_surgery_name'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && (sortedBy=='surgery_name' || sortedBy=='job_surgery_name')" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white" />
          <svgicon v-if="sortType==false && (sortedBy=='surgery_name' || sortedBy=='job_surgery_name')" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white" />
        </div>
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy(isJobParts ? 'job_title':'title',currentPage,search)">
          Title
          <svgicon v-if="sortedBy!='title' && sortedBy!='job_title'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && (sortedBy=='title' || sortedBy=='job_title')" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white" />
          <svgicon v-if="sortType==false && (sortedBy=='title' || sortedBy=='job_title')" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white" />
        </div>
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy('date_start',currentPage,search)">
          From
          <svgicon v-if="sortedBy!='date_start'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='date_start'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white" />
          <svgicon v-if="sortType==false && sortedBy=='date_start'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white" />
        </div>
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy('date_end',currentPage,search)">
          To
          <svgicon v-if="sortedBy!='date_end'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='date_end'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white" />
          <svgicon v-if="sortType==false && sortedBy=='date_end'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white" />
        </div>
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy('date_created',currentPage,search)">
          Created
          <svgicon v-if="sortedBy!='date_created'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='date_created'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white" />
          <svgicon v-if="sortType==false && sortedBy=='date_created'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white" />
        </div>
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy('cancelled_at',currentPage,search)" v-if="tabStatus === 'Cancelled'">
          Cancelled At
          <svgicon v-if="sortedBy!='cancelled_at'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='cancelled_at'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white" />
          <svgicon v-if="sortType==false && sortedBy=='cancelled_at'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white" />
        </div>
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy('declined_at',currentPage,search)" v-if="tabStatus === 'Withdrawn'">
          Withdrawn At
          <svgicon v-if="sortedBy!='cancelled_at'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='cancelled_at'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white" />
          <svgicon v-if="sortType==false && sortedBy=='cancelled_at'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white" />
        </div>
        <div v-if="tabStatus == 'Completed'" class="align-middle px-2 text-center w-64" @click="sortBy('date_created',currentPage,search)">
          Invoice Status
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props:[
      'tabStatus',
      'locumTabStatus',
      'practice',
      'locumUser',
      'currentPage',
      'isJobParts',
    ],

    data (){
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

    watch: {
      sort (value){
        if (value === 'Job Number'){
          this.sortBy(this.isJobParts ? 'job_part_number':'job_number', this.currentPage, this.search)
        }
        if (value === 'Practice/Surgery'){
          this.sortBy(this.isJobParts ? 'job_surgery_name':'surgery_name', this.currentPage, this.search)
        }
        if (value === 'Title'){
          this.sortBy(this.isJobParts ? 'job_title':'title', this.currentPage, this.search)
        }
        if (value === 'From'){
          this.sortBy('date_start', this.currentPage, this.search)
        }
        if (value === 'To'){
          this.sortBy('date_end', this.currentPage, this.search)
        }
        if (value === 'Created'){
          this.sortBy('date_end', this.currentPage, this.search)
        }
      },
    },

    methods:{
      getQuery (){
        const query = {
          ...this.$route.query
        }

        const offset = parseInt(query.job_page) * 10 - 10 

        return offset
      },

      async sortBy (sortedBy,job_page,search) {
        await this.$store.commit('jobs/TOGGLE_LOADING', true)
        
        if(this.sortedBy == sortedBy && this.sortType == true) {
          this.paramSort.order_by ='date_created:desc'
          this.sortedBy = ''
        } else {
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

      async getJobs (){
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
        await this.$axios.$get(`/api/v1/admin/${ this.isJobParts === true ? 'job-parts' : 'jobs'}`,{ params }).then( async res => {
          if(this.practice){
            console.log('jobs', res.data.jobs)
            console.log('job parts', res.data.job_parts)
            await this.$store.commit(`jobs/SET_PRACTICE_${this.tabStatus.toUpperCase()}_SESSIONS`, this.isJobParts === true ? res.data.job_parts : res.data.jobs)
            await this.$store.commit('jobs/TOGGLE_LOADING', false)
          }else if(this.locumUser){
            console.log('jobs', res.data.jobs)
            console.log('job parts', res.data.job_parts)
            await this.$store.commit(`jobs/SET_LOCUM_${this.locumTabStatus.toUpperCase()}_JOBS`, this.isJobParts === true ? res.data.job_parts : res.data.jobs)
            await this.$store.commit('jobs/TOGGLE_LOADING', false)
          }
        })
      },  
    },  

  }
</script>
