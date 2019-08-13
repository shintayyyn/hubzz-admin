<template>
  <div class="flex-1 flex flex-col py-2 px-6 overflow-y-auto">
    <div class="flex flex-col md:flex-row">
      <div class="w-1/2">
        <div class="flex py-2">
          	<div class="relative">
              <input class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
                <button class="p-2 absolute pin-t pin-r pin-b focus:outline-none">
                  <svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
                </button>
            </div>
        <button class="rounded-lg text-sm text-white p-2 mx-1 hover:text-black hover:bg-yellow-dark focus:outline-none">Go</button>
        </div>
      </div>
      <div class="w-1/2">
        <button
          @click="show()"
          class="inline-flex no-underline py-2 px-4 md:my-2 bg-sunglow text-sm text-black rounded-lg shadow md:float-right"
        >Add Practice</button>
      </div>
    </div>
		<!-- TABLE RESPONSIVE-->
    <div class="table border-separate" style="border-spacing: 0 10px;"> 
      <!-- HEADER -->
      <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
        <div class="table-cell p-2 align-middle">Practice Name</div> 
        <div class="table-cell p-2 align-middle">Practice Code</div>
        <div class="table-cell p-2 align-middle">Created</div>
        <div class="table-cell p-2 align-middle">Expires</div>
        <div class="table-cell p-2 align-middle">Status</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <nuxt-link
        v-for="(practice, index) in practices"
        :key="`practice-${index}`"
        :to="{path:`/practices/${practice.id}`,query:$route.query}"
        class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 my-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
        draggable="false"
      >
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Practice Name</strong>
          <span class="break-word">{{ practice.surgery ? practice.surgery.name:null }}</span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Practice Code</strong>
          <span class="break-all">{{ practice.surgery ? practice.surgery.code:null }}</span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Created</strong>
          <span class="break-all">{{ $moment(practice.created_at).format('MMM D, YYYY | hh:mm A') }}</span>
        </div>

				<div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Expires</strong>
          <span class="break-all">{{ practice && practice.actived_until ?  $moment(practice.actived_until).format('MMM D, YYYY | hh:mm A'): 'Not set' }}</span>
        </div>

        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
          <strong class="block md:hidden">Status</strong>
          <span class="inline-flex no-underline py-2 text-sm text-black rounded-full shadow"
					:class="`${practice.status === 'Active' ? 'bg-green text-white lg:px-8 px-4' : 'bg-yellow text-black lg:px-6 px-4'}`">{{ practice.status }}</span>
				</div>

      </nuxt-link>
      <!-- END BODY -->
    </div>
    <!-- END TABLE -->
    <!-- PAGINATION -->
		<div v-if="practices.length>0">
			<AppPagination
				:total="total"
				:totalPages="totalPages"
				:currentPage="currentPage"
				@pagechanged="pagechanged"
				:loading="loading"
			/>
		</div>
		<!-- PAGINATION ENDS HERE -->

    <div class="practice-shield" v-if="$route.name.includes('index-practices-id')"></div>

    <div class="practice-shield" v-if="modal"></div>
    <transition name="slide" mode="out-in">
      <div class="practice-modal shadow-lg" v-if="modal">
        <AddPracticeSurgery @close="modal = false"/>
      </div>
    </transition>

    <nuxt-child/>
  </div>
</template>

<script>
import AppPagination from '@/components/Base/AppPagination'
import AppLoading from '@/components/Base/AppLoading'
import PracticeDetailModal from '@/components/Practices/AllPractices'
import AddPracticeSurgery from '@/components/Practices/AddPracticeSurgery'
export default{
    components:{
      AppPagination,
      AppLoading,
      PracticeDetailModal,
      AddPracticeSurgery
    },
    data(){
        return{
          practices: [],
          user:null,
          modal:false,
          total: 0,
          totalPages: 0,
          currentPage: 1,
          perPage: 0,
          loading: false,
          modal:false,
          filterCompliances:'',
          search: '',
          sortBy: 'name',
          sortDirection:'asc'
        }
    },
    beforeDestroy(){
      let query = Object.assign({}, this.$route.query)
		  delete query.all_practice_page
		  this.$router.push({ query })
    },
    watch:{
      $route(to, from) {
        this.currentPage = parseInt(to.query.all_practice_page)
        this.getAllPractices('created_at:desc')
      },
    },
    created(){
        const query = {
            ...this.$route.query,
            all_practice_page: this.$route.query.all_practice_page || 1
        }
        Promise.all([
          this.$axios.$get(`/api/v1/admin/practices/count`).then(res=>{
              this.total = res.data.count
              this.perPage = 8
              this.totalPages = Math.ceil(this.total/this.perPage)
          })
        ]).then(()=>{
          this.getAllPractices()
        })  
        
    },
    computed:{

    },
    methods:{

      getAllPractices(){
        this.loading = true
        let offset = 0
        offset = this.perPage * (parseInt(this.$route.query.all_practice_page) - 1)
        
        this.$axios.$get(`/api/v1/admin/practices?limit=${this.perPage}&offset=${offset}`).then(res=>{
          this.practices = res.data.practices
        })
        this.loading = false 
      },
      show(){
        this.modal=true
      },
      pagechanged(e) {
        const query = {
          ...this.$route.query,
          all_practice_page: e || 1
        }
        this.$router.push({ query })
      },
    }
}
</script>

