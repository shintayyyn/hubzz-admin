<template>
    <div class="flex flex-col rounded-lg">
        <AppLoading :loading="loadingSurgeries" :message="'Loading Practice Surgeries'"/>
        <div class="flex px-4 overflow-hidden">
            <div class="flex">
                <div class="flex-3 mx-2">
                    <button
                        @click="show()"
                        class="inline-flex no-underline py-2 px-4 bg-sunglow text-sm font-semibold text-black rounded-lg shadow float-right"
                    >Add Surgery
                        <svgicon
                        name="add-rectangle"
                        width="21"
                        height="21"
                        color="black black"
                        class="mx-1 -my-1"/>
                    </button>
                </div>
                <div v-if="deleteSurgery == false" class="flex-3 mx-2">
                    <button
                        @click="deleteSurgery = true"
                        class="inline-flex no-underline py-2 px-4 bg-red text-sm font-semibold text-white rounded-lg shadow float-right"
                    >Delete Surgery
                        <svgicon
                        name="garbage"
                        width="21"
                        height="21"
                        color="white white"
                        class="mx-1 -my-1"/>
                    </button>
                </div>
                <div v-if="deleteSurgery == true" class="flex-3 mx-2">
                   <button
                        @click="deleteSurgery = false"
                        class="inline-flex no-underline py-2 px-4 bg-green text-sm font-semibold text-white rounded-lg shadow float-right"
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
        <div v-if="practiceChildren.length>0" class="border-separate overflow-x-auto px-6" style="border-spacing: 0 10px;"> 
            <!-- HEADER -->
            <div class="inline-flex font-bold text-white text-sm py-4"> 
                <div class="flex p-2 mx-8 align-middle">Practice Name</div> 
                <div class="flex p-2 mx-8 align-middle">Practice Code</div>
                <!-- <div class="table-cell p-2 align-middle">Practice Location</div> -->
            </div>
            <!-- END HEADER -->
            <!-- BODY -->
            <div
            v-for="(childSurgery,index) in practiceChildren"
            :key="`childSurgery-${index}`"
            >   
                <div class="inline-flex w-full">
                    <div @click="toDeleteSurgery(practice.id,childSurgery.id)" v-if="deleteSurgery == true" class='flex'>
                        <svgicon
                        name="garbage"
                        width="25"
                        height="25"
                        color="red red"
                        class="mt-12 mx-2"/>
                    </div>
                    <div  class="flex flex-wrap w-4/5 justify-between px-2 border-l-8 border-yellow-500 md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo">
                        <div class="flex flex-col mx-6  sm:w-full md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
                            <strong class="block md:hidden text-sm uppercase">Practice Name</strong>
                            <span class="whitespace-no-wrap">{{ childSurgery.surgery ? childSurgery.surgery.name :null }}</span>
                        </div>
                        <div class="flex flex-col mx-6  items-center sm:w-full md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
                            <strong class=" block md:hidden text-sm uppercase pr-2 align-middle">Practice Code:</strong>
                            <span class=" break-all">{{ childSurgery.surgery ? childSurgery.surgery.code :'null' }}</span>
                        </div>
                        <div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 md:py-4 align-middle">
                            <strong class="block md:hidden text-sm uppercase">Practice Location</strong>
                            <div class="text-white text-sm px-2 py-1">
                                <span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_1 :null }}</span><br>
                                <span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_2 :null }}</span><br>
                                <span>{{ childSurgery.surgery.address ? childSurgery.surgery.address.line_3 :null }}</span><br>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                
            </div>
            <!-- END BODY -->
            <!--put -->
        </div>
        <div v-else>
            <div
            class="mt-10 text-white w-full text-center"
            style="font-family: Nunito"
            >This practice has no children.</div>
        </div>
        <div v-if="!practiceChildren.length == 0" class="m-10 xl:-ml-32">
          <AppPagination
            :total="total"
            :totalPages="totalPages"
            :currentPage="currentPage"
            @pagechanged="pagechanged"
          />
        </div>

        <!-- END TABLE -->
        <div class="add-practice-shield" v-if="modal"></div>
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
export default {
    props:['practice'],
    components:{
        AddPracticeSurgery,
        AppPagination,
        AppLoading
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
            loadingSurgeries:false
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
            this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
            console.log("get practice surgeries error!!!!",err)
        }
    },

    methods:{
        show(){
            this.modal = true
        },
        async getChildren(){
            let limit = 5
            let offset = 0
            offset = this.perPage * (parseInt(this.$route.query.practice_children_page) - 1)
            let params = {limit, offset}
        
            await this.$axios.$get(`/api/v1/admin/practices/${this.practice.id}/practice-surgeries`,{params}).then(res=>{
                this.$store.commit('practices/SET_PRACTICE_SPOKES', res.data.practice_surgeries)
            }).catch(err=>{
                console.log('get children error!!!!',err)
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
            })
            this.loadingSurgeries = false
        },
        async toDeleteSurgery(pracId,childId){
            await this.$axios.delete(`/api/v1/admin/practices/${pracId}/practice-surgeries/${childId}`).then(res=>{
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'success', text: 'Child Surgery Successfully Removed' })
                this.getChildren()
            }).catch(err=>{
                console.log('delete children error!!!!',err)
                this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
            })
        },
        pagechanged(e) {
            const query = {
                ...this.$route.query,
                practice_children_page: e || 1
            }
            this.$router.push({ query })
            this.getChildren()
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
  border-left: solid 2px orange;
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