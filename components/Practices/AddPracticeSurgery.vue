<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col overflow-auto">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <div @click="$emit('close')" class="cursor-pointer">
            <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
        </div>
      </div>
      <!-- HEADER -->

      <div class="flex flex-wrap overflow-auto p-6 text-base text-white py-2">
        <div class="w-full">
          <div
            class="flex items-center pd-4 border-grey-light"
            style="width: 400px;"
          >
            <input
              class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3  px-2 leading-tight focus:outline-none focus:border-orange"
              type="text"
              placeholder="Search for surgery by name, etc."
              v-model="search" @keyup.enter="searchSubmit()"
              aria-label="Full name"
            >
             <div class="self-end">
              <button class="rounded-lg text-xs text-black p-2 mx-1 my-2 bg-yellow-dark" @click="searchSubmit()">Search</button>
            </div>
          </div>
        </div>
        <div class="w-full overflow-hidden">
         
          <div>
            <!--TABLE-->
            <!-- BODY -->
            <div v-if="!practice||practice&&practice.type=='Hub'"> <!--IF PRACTICE IS A HUB / NEW PRACTICE IS BEING CREATED-->
              <div
                v-for="(surgery, index) in surgeries"
                :key="`surgery-${index}`"
                @click="practice &&practice.type=='Hub' ? newPracticeOrChild(surgery.id):show(surgery.id)"
                class="flex no-underline rounded-lg bg-waterloo shadow hover:bg-waterloo-light my-2 cursor-pointer"
              >
                <div class="flex" style="width: 100%;">
                  <div class="text-white text-xs p-4">
                    <span class="font-bold">{{ surgery.name }}</span><br><br><br>
                    <span>{{surgery.address.line_1}}</span>
                    <span>{{surgery.address.line_2}}</span>
                    <span>{{surgery.address.line_3}}</span><br><br><br>
                    <span class='p-2 bg-trout rounded'>CCG</span>
                    <span>{{surgery.clinical_commissioning_group.name}}</span><br><br><br>
                    <span class='p-2 bg-trout rounded'>Practice Code</span>
                    <span>{{ surgery.code }}</span><br>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="practice&&practice.type == 'Spoke'"> <!--IF PRACTICE IS A SPOKE-->
              <div
                v-for="(hub, index) in hubzz"
                :key="`hub-${index}`"
                @click="changeParent(hub.surgery.id)"
                class="flex no-underline rounded-lg bg-waterloo shadow hover:bg-waterloo-light my-2 cursor-pointer"
              >
                <div class="flex" style="width: 100%;">
                  <div class="text-white text-xs p-4">
                    <span class="font-bold">{{ hub.surgery.name }}</span><br><br><br>
                    <span class='p-2 bg-trout rounded'>Practice Code</span>
                    <span>{{ hub.surgery.code }}</span><br>
                  </div>
                </div>
              </div>
            </div>
              <!--TABLE ENDS HERE-->
          </div>
        </div>
      </div>
    <!-- PAGINATION -->
		<AppPagination
			:total="total"
			:totalPages="totalPages"
			:currentPage="currentPage"
			@pagechanged="pagechanged"
			:loading="loading"
		/>
		<!-- PAGINATION ENDS HERE -->

    <div class="practice-user-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="shadow-lg" :class="practice ? 'practice-user-modal-small' : 'practice-user-modal'" v-if="modal">
        <CreatePracticeUser @close="modal = false" :practice="practice" :surgery="surgery"/>
      </div>
    </transition>
    
    <nuxt-child/>
  </div>
</template>

<script>
import AppPagination from '@/components/Base/AppPagination'
import CreatePracticeUser from '@/components/Practices/CreatePracticeUser'
export default {
    props:['practice','practiceHub'],
    components:{
        AppPagination,
        CreatePracticeUser
    },
  
    data() {
      return {
        surgeries: [],
        surgery:null,
        search:'',
        hubzz:[],
        hub:null,
        practiceCount:null,
        modal:false,
        total:0,
        totalPages:0,
        currentPage:1,
        perPage:0,
        loading:false
      };
    },

    beforeDestroy() {
      let query = Object.assign({}, this.$route.query)
      delete query.add_practice_page
      this.$router.push({ query })
    },
    watch:{
      $route(to, from) {
        this.currentPage = parseInt(to.query.add_practice_page)
        this.getAllSurgeries()
        },
    },

    created(){
        const query = {
            ...this.$route.query,
            add_practice_page: this.$route.query.add_practice_page || 1
        }
        this.getData()
    },

  computed: {
      
  },

  methods: {
    // getQuery(){
    //   const query = {
    //     ...this.$route.query
    //   }
    //   const offset = parseInt(query.page)*8 - 8
    //   return offset
    // },
    getPractices(){
      this.$store.dispatch("practices/fetchPractices",{
        limit:8,
        order_by:'created_at:desc',
        // offset:this.getQuery()
      })
    },
    async getData(){
      if(this.practice && this.practice.type=="Spoke"){
        // const limit = this.perPage
        // const type = 'Hub'
        // let offset = 0
        // offset = this.perPage * (parseInt(this.$route.query.add_practice_page) - 1)
        // const params = {limit, offset}
        // if(this.search){
        //   params.search = this.search
        //   console.log('hello',params)
        // }
        await this.$axios.$get(`/api/v1/admin/practices/count?type="Hub"`).then(res=>{
          this.total = res.data.count
          this.perPage = 8
          this.totalPages = Math.ceil(this.total/this.perPage)
          this.getAllHubzz()
        })
      }else if(!this.practice || this.practice&&this.practice.type=="Hub"){
        const limit = this.perPage
        let offset = 0
        offset = this.perPage * (parseInt(this.$route.query.add_practice_page) - 1)
        const params = {limit, offset}
        if(this.search){
          params.search = this.search
          console.log('hello',params)
        }
        await this.$axios.$get(`/api/v1/admin/surgeries/count`,{params}).then(res=>{
          this.total = res.data.count
          this.perPage = 8
          this.totalPages = Math.ceil(this.total/this.perPage)
          this.getAllSurgeries()
        })
      }
    },
    async getAllSurgeries(){
        this.loading = true
        const limit = this.perPage
        let offset = 0
        offset = this.perPage * (parseInt(this.$route.query.add_practice_page) - 1)
        const params = {limit, offset}
        if(this.search){
          params.search = this.search
          console.log('hello',params)
        }
        await this.$axios.$get(`/api/v1/admin/surgeries`,{params}).then(res=>{
          this.surgeries = res.data.surgeries
        })
        this.loading = false 
    },
    async searchSubmit(){
        const query = {
          ...this.$route.query,
          
        }
        delete query.add_practice_page
        query.search = this.search
        console.log('fuck this',this.search)
        this.getData()
        
        if (this.search === '') {
          delete query.search
        }
    },
    async getAllHubzz(){
        this.loading = true
        let offset = 0
        offset = this.perPage * (parseInt(this.$route.query.add_practice_page) - 1)
        await this.$axios.$get(`/api/v1/admin/practices?type=Hub&limit=${this.perPage}&offset=${offset}`).then(res=>{
          this.hubzz = res.data.practices
          
        })
        console.log("hubzz",this.hubzz)
        this.loading = false 
    },

    async newPracticeOrChild(surgeryId){
      await this.$axios.$post(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries`,{
        parent_practice_id:this.practice.id,
        surgery_id:surgeryId
      }).then(res=>{
        getPractices()
        this.$store.commit('SET_NOTIFICATION',{enabled:true, status:'success', text:'Practice Child Added'})
      })
      
    },
    async changeParent(surgeryId){
      if(this.practiceHub.parent_surgery.id == surgeryId){
        this.$store.commit('SET_NOTIFICATION',{enabled:true, status:'danger', text:'That surgery is the current Practice Parent'})
      }else{
        await this.$axios.$post(`/api/v1/admin/practices/${this.practice.id}/parent-surgery`,{
          surgery_id:surgeryId
        }).then(res=>{
          this.$store.commit('SET_NOTIFICATION',{enabled:true, status:'success', text:'Parent Surgery Changed'})
        })
         
      }
    },
    async show(id){
      await this.$axios.$get(`/api/v1/admin/surgeries/${id}`).then(res =>{
        this.surgery = res.data.surgery
      }),

      await this.$axios.$get(`/api/v1/admin/practices/count/?search=${this.surgery.name}`).then(res => {
        this.practiceCount = res.data.count
      })
  
      if(this.practiceCount>0){
        this.$store.commit('SET_NOTIFICATION',{enabled:true, status:'danger', text:'Surgery Already Registered'})
      }else{
        console.log('The surgery opened is', this.surgery)
        this.modal = true
      }
          
        
    },
    pagechanged(e) {
			const query = {
				...this.$route.query,
				add_practice_page: e || 1
			}
			this.$router.push({ query })
		},
    
  }
};
</script>
<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.practice-user-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.practice-user-modal,.practice-user-modal-small {
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
  .practice-user-modal {
    width: 70%;
  }
  .practice-user-modal-small {
    width: 60%;
  }

}
</style>
