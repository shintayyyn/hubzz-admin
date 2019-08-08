<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col overflow-auto">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <div @click="$emit('close')" class="cursor-pointer">
            <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
        </div>
      </div>
      <!-- HEADER -->

      <div class="flex flex-wrap overflow-hidden p-6 text-base text-white py-2">
        <div class="w-full overflow-hidden">
          <div class="pb-4">
            <strong>Add Practice</strong>
          </div>
        </div>
        <div class="w-full">
          <div
            class="flex items-center pd-4 border-grey-light"
            style="width: 400px;"
          >
            <input
              class="appearance-none mb-4 bg-transparent border-b w-full text-white mr-3  px-2 leading-tight focus:outline-none focus:border-orange"
              type="text"
              placeholder="Search for surgery by name, etc."
              
              aria-label="Full name"
            >
            <!-- v-model="search" @keyup.enter="searchSubmit" -->
          </div>
        </div>
        <div class="w-full overflow-hidden">
          <div class="self-end">
            <button class="rounded-lg text-xs text-black p-2 mx-1 my-2 bg-yellow-dark">Search</button>
          </div>
          <div>
            <!--TABLE-->
            <!-- BODY -->
            <div
              v-for="(surgery, index) in surgeries"
              :key="`surgery-${index}`"
              @click = show(surgery.id)
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
              <!--TABLE ENDS HERE-->
          </div>
        </div>
      </div>

    <div class="practice-user-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="practice-user-modal shadow-lg" v-if="modal">
        <CreatePracticeUser @close="modal = false" :surgery="surgery"/>
      </div>
    </transition>
    
    <nuxt-child/>
  </div>
</template>

<script>
import AppPagination from '@/components/Base/AppPagination'
import CreatePracticeUser from '@/components/Practices/CreatePracticeUser'
export default {
    components:{
        AppPagination,
        CreatePracticeUser
    },
  
    data() {
      return {
        surgeries: [],
        surgery:null,
        modal:false,
        loading: false,
        itemsPerPage:10,
        itemCount:0,
        activePage:1,
        search: '',
        disabled:'true'
      };
    },

    created(){
        const query = {
            ...this.$route.query,
            current_page: this.$route.query.current_page || 1
        }

        this.$axios.$get(`/api/v1/admin/surgeries/count`).then(res=>{
            this.total = res.data.count
            this.perPage = 8
            this.totalPages = Math.ceil(this.total/this.perPage)
            this.getAllSurgeries()
        })
        
    },

  computed: {
      
  },

  methods: {
    getAllSurgeries(){
        this.loading = true
        let offset = 0
        offset = this.perPage * (parseInt(this.$route.query.current_page) - 1)
        
        this.$axios.$get(`/api/v1/admin/surgeries?limit=${this.perPage}&offset=${offset}`).then(res=>{
          this.surgeries = res.data.surgeries
        })
        this.loading = false 
    },
    show(id){
        console.log(id)
        Promise.all([
          this.$axios.$get(`/api/v1/admin/surgeries/${id}`).then(res =>{
            this.surgery = res.data.surgery
          })
        ]).then(()=>{
          console.log('The surgery opened is', this.surgery)
          this.modal = true
        })
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
.practice-user-modal {
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
}
</style>
