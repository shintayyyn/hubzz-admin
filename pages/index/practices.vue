<template>
   <div class="flex-1 flex flex-col py-2 px-6 overflow-y-auto">
	<AppLoading :loading="loadingPractices" :message="'Loading Practices'"/>
    <div class="flex px-2 justify-between md:flex-row">
        <div class="flex py-2">
          	<div class="relative">
              <input class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
                <button class="p-2 absolute pin-t pin-r pin-b focus:outline-none" @click="search = '', searchSubmit()">
                  <svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
                </button>
            </div>
        <button class="rounded-lg text-sm text-white p-2 mx-1 hover:text-black hover:bg-yellow-dark focus:outline-none" @click="searchSubmit">Go</button>
        </div>
      <div>
        <button
          @click="show()"
          class="inline-flex no-underline py-2 px-4 md:my-2 bg-sunglow text-sm font-semibold text-black rounded-lg shadow md:float-right"
        >Add Practice</button>
      </div>
    </div>
	<!-- TABLE RESPONSIVE-->
    <div v-if="itemCount > 0" class="flex flex-col mx-2 text-white"> 
      <!-- HEADER -->
      <div class="w-full hidden md:flex text-sm lg:text-base font-bold mt-4 mb-2"> 
        <div class="w-1/6" @click="sortBy('name',activePage,search)">
			Practice Name
			<svgicon v-if="sortedBy!='name'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
			<svgicon v-if="sortType==true && sortedBy=='name'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
			<svgicon v-if="sortType==false && sortedBy=='name'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
		</div> 
        <div class="w-1/6">Practice Code</div>
        <div class="w-1/6" @click="sortBy('created_at',activePage,search)">
			Created
			<svgicon v-if="sortedBy!='created_at'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
			<svgicon v-if="sortType==true && sortedBy=='created_at'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
			<svgicon v-if="sortType==false && sortedBy=='created_at'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
		</div>
        <div class="w-1/6" @click="sortBy('actived_until',activePage,search)">
			Expires
			<svgicon v-if="sortedBy!='actived_until'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
			<svgicon v-if="sortType==true && sortedBy=='actived_until'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
			<svgicon v-if="sortType==false && sortedBy=='actived_until'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
		</div>
        <div class="w-1/6" @click="sortBy('status',activePage,search)">
			Status
			<svgicon v-if="sortedBy!='status'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
			<svgicon v-if="sortType==true && sortedBy=='status'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
			<svgicon v-if="sortType==false && sortedBy=='status'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
		</div>
		<div class="w-1/6">Type</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <div
        v-for="(practice, index) in getAllPractices"
		:key="`practice-${index}`"
		@click="$router.push(`/practices/${practice.id}`)"
        class="w-full flex flex-col md:flex-row rounded-lg bg-waterloo hover:bg-waterloo-light my-2 shadow-lg cursor-pointer p-4 md:p-2 border-l-8 border-yellow md:border-0" 
      >
        <div class="w-full md:w-1/6 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
          <strong class="block md:hidden text-sm uppercase">Practice Name</strong>
          <span class="break-word">{{ practice.surgery ? practice.surgery.name:null }}</span>
        </div>

        <div class="w-full md:w-1/6 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
          <strong class="block md:hidden text-sm uppercase">Practice Code</strong>
          <span class="break-all">{{ practice.surgery ? practice.surgery.code:null }}</span>
        </div>

        <div class="w-full md:w-1/6 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
          <strong class="block md:hidden text-sm uppercase">Created</strong>
          <span class="break-all">{{ $moment(practice.created_at).format('MMM D, YYYY | hh:mm A') }}</span>
        </div>

		<div class="w-full md:w-1/6 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
          <strong class="block md:hidden text-sm uppercase">Expires</strong>
          <span class="break-all">{{ practice && practice.actived_until ?  $moment(practice.actived_until).format('MMM D, YYYY | hh:mm A'): 'Unavailable' }}</span>
        </div>

        <div class="w-full md:w-1/6 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
          <strong class="block md:hidden">Status</strong>
          <span class="inline-flex no-underline py-2 text-sm text-black rounded-full shadow"
			:class="`${practice.status === 'Active' ? 'bg-green text-white lg:px-8 px-4' : 'bg-yellow text-black lg:px-6 px-4'}`">{{ practice.status }}</span>
		</div>
		<div class="w-full md:w-1/6 py-2 md:px-2 flex flex-col md:flex-row md:items-center">
          <strong class="block md:hidden">Type</strong>
          <span class="inline-flex no-underline py-2 px-4 text-sm text-black rounded-full shadow"
			:class="typeStyle(practice.type)">{{ practice.type }}</span>
		</div>

      </div>
      <!-- END BODY -->
    </div>
	<div v-else>
		<div
            class="mt-10 w-full text-center text-white"
            style="font-family: Nunito"
            >There are no registered practices.</div>
	</div>
    <!-- END TABLE -->
	<!-- PAGINATION -->
	<div v-if="itemCount > 0" class="flex justify-center">
		<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black"
			@click="goToPage(activePage - 1,search,order_by)" 
			:class="activePage === 1 ? 'text-grey-dark' : 'hover:bg-yellow'">Prev</button>
		<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light" 
			:class="`${activePage === page ? 'text-white' : ''}`" 
			v-for="page in pageCount" 
			v-if="showPage(page)"
			:key="`page-${page}`" 
			@click="goToPage(page,search,order_by)">{{ page }}</button>
		<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light" 
			@click="goToPage(activePage + 1,search,order_by)"
			:class="`${activePage == pageCount ? 'text-grey-dark': ''}`">Next</button>														
	</div>
	<!-- PAGINATION -->

	<div class="practice-shield" v-if="$route.name.includes('index-practices-id') || modal == true"></div>

    <transition name="slide" mode="out-in">
      <div class="practice-modal shadow-lg" v-if="modal">
        <AddPracticeSurgery @close="modal = false"/>
      </div>
    </transition>

    <nuxt-child/>
  </div>
</template>

<script>
import AddPracticeSurgery from '@/components/Practices/AddPracticeSurgery'
import AppLoading from '@/components/Base/AppLoading'
export default {
	components:{
		AddPracticeSurgery,
		AppLoading
	},
	data() {
      return {
        loading: false,
        itemsPerPage:10,
        // itemCount: 0,
        activePage: 1,
		// practices: [],
		
		search: '',
		paramSort:{
			order_by:''
		},
		sort:'',
		sortedBy:'',
		sortType:'',
		order_by:'',
		name:true,
		created_at:true,
		actived_until:true,
		status:true,
		modal:false

      };
    },

	watchQuery: [
	'page',
	'search'
	],

  	async asyncData({ app, store, route }) {
  		try {
			await store.commit('practices/TOGGLE_LOADING',true)
  			let {
  				page = 1,
				search = '',
				order_by=''  
			} = route.query 
			page = parseInt(page)
			const createdRoute = route.query  
  			const limit = 8
  			const offset = page * limit - limit
  			order_by = createdRoute && createdRoute.order_by ? createdRoute.order_by : 'created_at:desc'
			const params = { limit, offset, order_by }
				
  			if (search) {
  				params.search = search
			}
				
  			const getPracticesCountPromise = app.$axios.get(`/api/v1/admin/practices/count`, { params })
			const getPracticesPromise = app.$axios.get(`/api/v1/admin/practices`, { params })
				
			let response = null
			
			response = await getPracticesCountPromise
			const itemCount = response.data.data.count
			
			response = await getPracticesPromise
			const practices = response.data.data.practices
			
			await store.commit('practices/SET_PRACTICE_COUNT',itemCount)
			await store.commit('practices/SET_PRACTICES',practices)
			await store.commit('practices/TOGGLE_LOADING',false)
  			return {
  				loading: false,
  				itemsPerPage: limit,
  				// itemCount,
  				activePage: page,
  				// practices,
				search,
				order_by  
  			}
  		} catch (err) {
			store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
  			console.log('Get practices error!', err)
  		}
  	},

    computed: {
		loadingPractices(){
			return this.$store.state.practices.loading_practices
		},
		getAllPractices(){
			return this.$store.getters["practices/getAllPractices"]
		},
		itemCount(){
			return this.$store.state.practices.itemCount
		},
  		pageCount() {
  			return Math.ceil(this.itemCount / this.itemsPerPage)
  		},

	    showPage() {
	      return page => {
	        if (page === 1) {
	          return true
	        }

	        if (page === this.pageCount) {
	          return true
	        }

	        if (page === this.activePage) {
	          return true
	        }

	        if (page === this.activePage + 1) {
	          return true
	        }

	        if (page === this.activePage - 1) {
	          return true
	        }

	        if (this.activePage === 1 && page < 5) {
	          return true
	        }

	        if (this.activePage === this.pageCount && page > this.pageCount - 4) {
	          return true
	        }

	        if (this.activePage === 2 && page === 4) {
	          return true
	        }

	        if (this.activePage === this.pageCount - 1 && page === this.pageCount - 3) {
	          return true
	        }

	        return false
	      }
	    }
  	},
  
  	methods: {
		show(){
			this.modal=true
		},

		getQuery(){
			const query = {
				...this.$route.query
			}
			const offset = parseInt(query.page)*8 - 8 
			return offset
		},

		getPractices(params,search){
			this.$store.dispatch("practices/fetchPractices",{
				limit:8,
				search:search,
				order_by:params.order_by,
				offset:this.getQuery()
			})
		},
		async sortBy(sortedBy,page,search) {
			switch (sortedBy) {
				case 'name':
					this.sortedBy = sortedBy
					this.name = !this.name
					this.sortType = this.name
				case 'created_at':
					this.sortedBy = sortedBy
					this.created_at = !this.created_at
					this.sortType = this.created_at
				break;
				case 'actived_until':
					this.sortedBy = sortedBy
					this.actived_until = !this.actived_until
					this.sortType = this.actived_until
				break;
				case 'status':
					this.sortedBy = sortedBy
					this.status = !this.status
					this.sortType = this.status
				break;
			}
			this.paramSort.order_by = await `${sortedBy}:${this.sortType ? 'asc' : 'desc'}`
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
			this.getPractices(this.paramSort,this.search)
		},
  		goToPage(page,search,order_by) {
  			if (page < 1) {
  				return
  			}

  			if (page > this.pageCount) {
  				return
			  }
			  
  			let query = {
				...this.$router.query,
				page
			}

			if(search){
				query = {
					...this.$router.query,
					page,search
				}
			}
			if(order_by){
				query={
					...this.$route.query,
					page,order_by
				}
			}
			if(search && order_by){
				query={
					...this.$router.query,
					page,search,order_by
				}
			}

  			if (page === 1) {
  				delete query.page
  			}

	      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
	        this.loading = true
	      }	
	      this.$router.push({ query })
		},

  		searchSubmit(page, order_by) {
			let search = this.search
			let query = {
				...this.$router.query,
				search
			}
			if(page === 1){
				delete query.page
			}
			if(page && page>1){
				query = {
					...this.$router.query,
					page,search
				}
			}
			if(order_by){
				query = {
					...this.$router.query,
					search,order_by
				}
			}
			if(page && order_by){
				query = {
					...this.$router.query,
					page,search,order_by
				}
			}

  			if (this.search === '') {
  				delete query.search
  			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true
			}

	      	this.$router.push({ query })
		},

		typeStyle(status){
			switch(status){
				case 'Hub':
					return 'bg-red-light text-white lg:px-8 sm:px-2'
					break;
				case 'Spoke':
					return 'bg-blue-light text-white lg:px-8 sm:px-2'
					break;
				case 'Stand Alone':
					return 'bg-indigo-light text-white lg:px-8 sm:px-2'
					break;
				default:
					return
			}
		},
		  
  	}
};
</script>
<style>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.practice-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.practice-modal {
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
  .practice-modal {
    width: 80%;
  }
}
</style>
