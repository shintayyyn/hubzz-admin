<template>
  <div class="flex flex-col rounded-lg">
      <AppLoading :loading="loadingSurgeries" :message="'Loading Practice Surgeries'"/>
      <div class="flex overflow-hidden">
        <div class="flex overflow-x-auto mb-2">
            <div class="flex-3 mx-1 whitespace-no-wrap">
                <button
                  @click="show()"
                  class="inline-flex items-center no-underline py-2 px-4 bg-sunglow hover:bg-sunglow-dark text-sm font-semibold text-black rounded-lg shadow float-right"
                >Add Spoke for this Hub
                  <svgicon
                  name="add-rectangle"
                  width="21"
                  height="21"
                  color="black black"
                  class="mx-1 -my-1"/>
                </button>
            </div>
            <div v-if="deleteSurgery == true" class="flex-3 mx-1 whitespace-no-wrap">
                <button
                  @click="deleteSurgery = false"
                  class="inline-flex items-center no-underline py-2 px-4 bg-green-500 hover:bg-green-600 text-sm font-semibold text-white rounded-lg shadow float-right"
                >Done
                  <svgicon
                  name="circle-check"
                  width="21"
                  height="21"
                  color="white white"
                  class="mx-1 -my-1"/>
                </button> 
            </div>
              
        </div>
      </div>
      <!-- TABLE RESPONSIVE-->
      <div v-if="practiceChildren.length>0" class="flex flex-col mx-2 text-white"> 
        <!-- HEADER -->
        <div class="hidden md:inline-flex w-full font-bold text-white text-sm py-4"> 
          <div v-if="deleteSurgery == true" class="px-6"></div> 
          <div class="w-1/2">Practice Name</div> 
          <div class="w-1/2">Practice Code</div>
          <div class="w-1/2">Invited At</div>
          <div class="w-1/2">Status</div>
        </div>
        <!-- END HEADER -->
        <!-- BODY -->
        <!-- This table is a nuxt-link, going to surgery details -> :to="{path:`/practices/${practice.id}/practice-surgeries/${childSurgery.id}`}"  -->
        <div
          v-for="(childSurgery,index) in practiceChildren"
          :key="`childSurgery-${index}`"
          class="flex"
          >   
            
          <div 
            @click="viewTerminationModal(childSurgery.id)" v-if="childSurgery.termination_requested_at" 
            class='flex items-center pr-6 cursor-pointer text-red-600 hover:text-red-700'>
            <div class="p-1 bg-white rounded-lg">
              <svgicon
                name="exclamation-circle-solid"
                width="22"
                height="22"
                class="fill-current"
                />
            </div>
          </div>
          <!-- TABLE -->
          <nuxt-link 
            :to="{path:`/practices/${practice.id}/practice-surgeries/${childSurgery.id}` }" 
            class="w-full flex flex-col md:flex-row justify-between px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light" 
          >
            <div class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none text-white cursor-pointer md:w-1/3">
                <strong class="block md:hidden text-sm uppercase">Practice Name</strong>
                <span class="break-word">{{ childSurgery.surgery ? childSurgery.surgery.name :null }}</span>
            </div>
            <div class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none text-white cursor-pointer md:w-1/3">
              <strong class=" block md:hidden text-sm uppercase pr-2 align-middle">Practice Code</strong>
              <span class=" break-all">{{ childSurgery.surgery ? childSurgery.surgery.code :null }}</span>
            </div>
              <div class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none text-white cursor-pointer md:w-1/3">
              <strong class=" block md:hidden text-sm uppercase pr-2 align-middle">Invited At</strong>
              <span class=" break-all">{{ childSurgery ? $moment(childSurgery.created_at).format('MMM DD, YYYY | HH:mm:ss') :null }}</span>
            </div>
            <div class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none text-white cursor-pointer md:w-1/3">
              <strong class=" block md:hidden text-sm uppercase pr-2 align-middle">Status</strong>
              <span class="inline-flex justify-center text-black text-sm py-2 p-3 md:mx-4 rounded-full lg:px-8 sm:px-2 w-32 min-w-0 my-1" 
              :class="statusStyle(checkStatus(childSurgery))">
                {{ checkStatus(childSurgery) }}
              </span>
            </div>
            <!-- <div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 md:py-4 align-middle">
              <strong class="block md:hidden text-sm uppercase">Practice Location</strong>
              <div class="text-white text-sm px-2 py-1">
                <span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_1 :null }}</span><br>
                <span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_2 :null }}</span><br>
                <span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_3 :null }}</span><br>
              </div>
            </div> -->
          </nuxt-link>
          <!-- TABLE ENDS HERE-->
        </div>
        <transition name="fade" mode="out-in">
          <div class="confirm-termination-modal  justify-center xl:mx-32 xs:mx-2 shadow-lg" v-if="terminationModal">
            <TerminateSurgery @close="terminationModal = false" :practice="practice" :childSurgery="specificChildSurgery"/>
          </div>
        </transition>
        <!-- END BODY -->
        <!--put -->
      </div>
      <div v-else>
        <div
          class="mt-10 text-white w-full text-center"
          style="font-family: Nunito"
        >This practice has no children.</div>
      </div>
      <div v-if="!practiceChildren.length == 0">
        <AppPagination
          :total="total"
          :totalPages="totalPages"
          :currentPage="currentPage"
          @pagechanged="pagechanged"
        />
      </div>
      <!-- END TABLE -->
      
      <div class="add-practice-shield" v-if="modal || terminationModal" @click="closeModals()"></div>
      <transition name="slide" mode="out-in">
        <div class="add-practice-modal shadow-lg" v-if="modal">
          <AddPracticeSurgery @close="modal = false" :practice="practice" :spokesCount="total" />
        </div>
      </transition>
      
  </div>
</template>
<script>
import AddPracticeSurgery from '@/components/Practices/AddPracticeSurgery'
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'
import TerminateSurgery from '@/components/Practices/TerminateSurgery'
export default {
  props:['practice'],
  components:{
    AddPracticeSurgery,
    AppPagination,
    AppLoading,
    TerminateSurgery
  },
  data(){
    return{
      // practiceChildren:{},
      // total:0,
      // totalPages:0,
      deleteSurgery:false,
      currentPage:1,
      perPage:0,
      modal:false,
      loadingSurgeries:false,
      terminationModal: false,
      specificChildSurgery:'',
    }
  },
  beforeDestroy(){
    let query = Object.assign({},this.$route.query)
    delete query.practice_children_page
    this.$router.push({query})
  },
  watch: {
    $route(to, from) {
      this.currentPage = parseInt(to.query.practice_children_page)
      this.getChildren()
    },
  },
  computed:{
    total(){
      return this.$store.state.practices.practiceSpokesCount
    },
    practiceChildren(){
      return this.$store.state.practices.practiceSpokes
    },
    totalPages(){
      return this.$store.state.practices.practiceSpokesPageCount
    }
  },
  async created(){
    const query = {
      ...this.$route.query,
      practice_children_page: this.$route.query.practice_children_page || 1
    }
    try{
      this.loadingSurgeries = true
      await this.$axios.$get(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/count`).then(res=>{
        this.$store.commit('practices/SET_PRACTICE_SPOKES_COUNT',res.data.count) //quantity of spokes
        this.perPage = 5
        let pageCount = Math.ceil(this.total / this.perPage)
        this.$store.commit('practices/SET_PRACTICE_SPOKES_PAGE_COUNT',pageCount) //number of pages
        this.getChildren()
      })
    }catch(err){
      this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: err.response.data.message })
      console.log("get practice surgeries error!!!!",err)
    }
  },
  methods:{
    show(){
      this.modal = true
    },
    async viewTerminationModal(childId){
      await this.$axios.get(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries/${childId}`).then(res=> {
        this.specificChildSurgery = res.data.data.practice_surgery
      })
      this.terminationModal = true
    },
    closeModals(){
      this.modal = false
      this.terminationModal = false
    },
    async getChildren(){
      let limit = 5
      let offset = 0
      offset = this.perPage * (parseInt(this.$route.query.practice_children_page) - 1)
      let params = {limit, offset}
  
      await this.$axios.$get(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries`,{params}).then(res => {
        this.$store.commit('practices/SET_PRACTICE_SPOKES', res.data.practice_surgeries)
      }).catch(err=>{
        console.log('get children error!!!!',err)
        this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: err.response.data.message })
      })
      this.loadingSurgeries = false
    },

    goToChild(link) {
      this.$router.push()
    },
    pagechanged(e) {
      const query = {
        ...this.$route.query,
        practice_children_page: e || 1
      }
      this.$router.push({ query })
      this.getChildren()
    },
    statusStyle(status){
			switch(status){
				case 'Active':
					return 'bg-green-500 text-white'
					break;
				case 'Rejected':
					return 'bg-gray-500 text-gray-700'
					break;
				case 'Termination Requested':
          return 'bg-orange-500 text-white'
					break;
				case 'Terminated':
					return 'bg-red-800 text-red-400'
					break;
				default:
					return 'bg-yellow-400 text-black'
			}
    },
    checkStatus(invitation){
      let result = 'Invited'
      if(invitation.invitation_accepted_at){
        result = 'Active'
      }
      
      if(invitation.invitation_rejected_at){
        result = 'Rejected'
      }
      
      if(invitation.termination_requested_at){
        result = 'Termination Requested'
      }
      
      if(invitation.terminated_at){
        result = 'Terminated'
      }
      return result
    },
  },
}
</script>
<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.add-practice-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.add-practice-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px yellow;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}

.confirm-termination-modal {
  position: fixed;
  top: 20%;
  /* left: 10%; */
  border-radius: 25px;
  margin-right: 0%;
  width: 800px;
  max-width: 80%;
  height: 50%;
  overflow: auto;
  border-left: solid 2px orange;
  border-right: solid 2px orange;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}

@media screen and (min-width: 1200px) {
  .add-practice-modal {
    width: 70%;
  }
}
</style>