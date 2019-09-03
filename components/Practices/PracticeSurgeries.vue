<template>
    <div class="flex flex-col rounded-lg">
        <div class="flex px-4 overflow-hidden">
            <div>
                <button
                    @click="show()"
                    class="inline-flex no-underline py-2 px-4 bg-sunglow text-sm text-black rounded-lg shadow float-right"
                >Add Surgery
                </button>
            </div>
        </div>
        <!-- TABLE RESPONSIVE-->
        <div v-if="practiceChildren.length>0" class="table border-separate overflow-x-auto px-6" style="border-spacing: 0 10px;"> 
            <!-- HEADER -->
            <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
            <div class="table-cell p-2 align-middle">Practice Name</div> 
            <div class="table-cell p-2 align-middle">Practice Code</div>
            <div class="table-cell p-2 align-middle">Practice Location</div>
            </div>
            <!-- END HEADER -->
            <!-- BODY -->
            <div
            v-for="(childSurgery,index) in practiceChildren"
            :key="`childSurgery-${index}`"
            class="flex flex-wrap justify-between px-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo" 
            >
                <div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
                    <strong class="block md:hidden text-sm uppercase">Practice Name</strong>
                    <span class="whitespace-no-wrap">{{ childSurgery.surgery ? childSurgery.surgery.name :null }}</span>
                </div>
                <div class="flex items-center sm:w-full md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
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
export default {
    props:['practice'],
    components:{
        AddPracticeSurgery,
        AppPagination
    },
    data(){
        return{
            // practiceChildren:{},
            // total:0,
            // totalPages:0,
            currentPage:1,
            perPage:0,
            modal:false
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