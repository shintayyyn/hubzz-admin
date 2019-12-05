<template>
   <div class="flex-1 flex flex-col py-2 px-4 md:px-6 overflow-y-auto">
	  <AppLoading :loading="loadingPractices" :message="'Loading Practices'"/>
		<div class="text-xl md:text-4xl text-white">Practices</div>
    <div class="flex justify-between items-center flex-wrap">
      <div class="flex items-center py-2">
        <div class="relative">
          <input class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo" placeholder="Search Practice by Name" v-model="search" @keyup.enter="searchSubmit">
          <button v-if="search" class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1" @click="search = '', searchSubmit()">
            <svgicon name="times-solid" height="12" width="12" class="text-white hover:text-yellow-500 fill-current -mx-2 md:-mx-6"/>
          </button>
        </div>
        <!-- <button class="rounded-lg text-sm text-white p-2 mx-2 hover:text-black hover:bg-yellow-500 focus:outline-none" @click="searchSubmit">Go</button> -->
      </div>
      <div>
        <button
          v-if="authAdminPermissions.includes('Add Practice') && authAdminPermissions.includes('Add Practice User')"
          @click="show()"
          class="inline-flex no-underline py-2 px-4 md:my-2 bg-sunglow text-sm font-semibold text-black rounded-lg shadow md:float-right"
        >Add Practice</button>
      </div>
      <div class="w-1/2 relative md:hidden flex flex-col justify-end md:items-end pb-2">
					<label class="text-sm text-white md:pr-2">Sort by</label>
					<select
						v-model="sort"
						class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option value selected>All</option>
						<option>Practice Name</option>
						<option>Practice Code</option>
						<option>Created</option>
						<option>Expires</option>
						<option>Status</option>
						<option>Type</option>
					</select>
				</div>
    </div>
	<!-- TABLE RESPONSIVE-->
    <div v-if="itemCount > 0" class="w-full" style="min-height: 70vh"> 
      <!-- HEADER -->
      <div class="hidden md:flex items-center text-white justify-around font-semibold"> 
        <div class="align-middle px-2 w-1/6 cursor-pointer" @click="sortBy('practice_name',currentPage,search)">
          Practice Name
          <svgicon v-if="sortedBy!='practice_name'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='practice_name'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='practice_name'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div> 
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy('practice_code',currentPage,search)">
          Practice Code
          <svgicon v-if="sortedBy!='practice_code'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='practice_code'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='practice_code'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy('created_at',currentPage,search)">
          Created
          <svgicon v-if="sortedBy!='created_at'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='created_at'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='created_at'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy('actived_until',currentPage,search)">
          Expires
          <svgicon v-if="sortedBy!='actived_until'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='actived_until'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='actived_until'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy('status',currentPage,search)">
          Status
          <svgicon v-if="sortedBy!='status'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='status'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='status'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
        <div class="align-middle px-2 text-center w-1/6 cursor-pointer" @click="sortBy('practice_type',currentPage,search)">
          Type
          <svgicon v-if="sortedBy!='practice_type'" class="inline align-baseline" name="sort" height="12" width="12" color="white black" />
          <svgicon v-if="sortType==true && sortedBy=='practice_type'" class="inline align-baseline" name="sort-ascend" height="12" width="12" color="white"/>
          <svgicon v-if="sortType==false && sortedBy=='practice_type'" class="inline align-baseline" name="sort-descend" height="12" width="12" color="white"/>
        </div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <!-- <transition-group name="slide" tag="p"> -->
        <nuxt-link
          v-for="(practice, index) in getAllPractices"
          :key="`practice-${index}`"
          :to="{path:`/practices/${practice.id}`,query:$route.query}"
          class="flex flex-col cursor-pointer md:flex-row px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light transition-hover" 
        >
          <div class="flex flex-col md:justify-center md:w-1/6 p-1 md:p-2 align-middle leading-none">
            <strong class="block md:hidden text-xs uppercase">Practice Name</strong>
            <span>{{ practice.surgery ? practice.surgery.name:null }}</span>
          </div>

          <div class="flex flex-col md:justify-center md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center">
            <strong class="block md:hidden text-xs uppercase">Practice Code</strong>
            <span class="break-words md:text-center w-full">{{ practice.surgery ? practice.surgery.code:null }}</span>
          </div>

          <div class="flex flex-col md:justify-center md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center">
            <strong class="block md:hidden text-xs uppercase">Created</strong>
            <span>{{ $moment(practice.created_at).format('MMM D, YYYY | hh:mm A') }}</span>
          </div>

          <div class="flex flex-col md:justify-center md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center">
            <strong class="block md:hidden text-xs uppercase">Expires</strong>
            <span>{{ practice && practice.actived_until ?  $moment(practice.actived_until).format('MMM D, YYYY | hh:mm A'): 'Unavailable' }}</span>
          </div>

          <div class="flex flex-col md:justify-center md:items-center sm:w-1/2 md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center">
            <strong class="block md:hidden text-xs uppercase pb-1">Status</strong>
            <span class="inline-flex justify-center no-underline px-8 py-2 text-sm text-white rounded-full shadow w-32 min-w-0"
            :class="`${practice.status === 'Active' ? 'bg-green-500' : 'bg-gray-500 text-gray-700'}`">{{ practice.status }}</span>
          </div>

          <div class="flex flex-col md:justify-center md:items-center sm:w-1/2 md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center">
            <strong class="block md:hidden text-xs uppercase pb-1">Type</strong>
            <span class="inline-flex justify-center no-underline px-4 py-2 w-32 min-w-0 text-sm rounded-full shadow whitespace-no-wrap"
            :class="typeStyle(practice.type)">{{ practice.type }}</span>
          </div>

        </nuxt-link>
      <!-- </transition-group> -->
      <!-- END BODY -->
    </div>
    <div v-else>
      <div
        class="mt-2 w-full text-center text-white"
        style="font-family: Nunito"
        >There are no registered practices.</div>
    </div>
    <!-- END TABLE -->
	<!-- PAGINATION -->
  <AppPagination
    :total="total"
    :totalPages="totalPages"
    :currentPage="currentPage"
    @pagechanged="pagechanged"
  />

	<div class="practice-shield" v-if="$route.name.includes('index-practices-id') || modal == true" @click="modal ? modal = false : $router.push('/practices')"></div>
  <transition name="slide" mode="out-in">
    <div class="practice-modal shadow-lg" v-if="modal">
      <AddPracticeSurgery @close="modal = false"/>
    </div>
  </transition>

    <nuxt-child/>
  </div>
</template>

<script>
import debounce from "lodash.debounce";
import AddPracticeSurgery from '@/components/Practices/AddPracticeSurgery'
import AppLoading from '@/components/Base/AppLoading'
import AppPagination from "@/components/Base/AppPagination";
export default {
	components:{
		AddPracticeSurgery,
    AppLoading,
    AppPagination
	},
	data() {
    return {
      loading: false,
      itemsPerPage: 10,
      // itemCount: 0,
      currentPage: 1,
      // practices: [],
		
      search: '',
      paramSort:{
        order_by:''
      },
      sort:'',
      sortedBy:'',
      sortType:'',
      order_by:'',
      practice_name:true,
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
      const limit = 10
      const offset = page * limit - limit
      order_by = createdRoute && createdRoute.order_by ? createdRoute.order_by : 'created_at:desc'
    const params = { limit, offset, order_by }
      
      if (search) {
        params.search = search
    }
      
      const getPracticesCountPromise = app.$axios.$get(`/api/v1/admin/practices/count`, { params })
    const getPracticesPromise = app.$axios.$get(`/api/v1/admin/practices`, { params })
      
    let response = null
    
    response = await getPracticesCountPromise
    const itemCount = response.data.count
    
    response = await getPracticesPromise
    const practices = response.data.practices
    
    await store.commit('practices/SET_PRACTICE_COUNT',itemCount)
    await store.commit('practices/SET_PRACTICES',practices)
    await store.commit('practices/TOGGLE_LOADING',false)
      return {
        loading: false,
        itemsPerPage: limit,
        // itemCount,
        currentPage: page,
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
    authAdminPermissions() {
      return this.$store.getters["auth/permissions"]
    },
    showPage() {
      return page => {
        if (page === 1) {
          return true
        }

        if (page === this.pageCount) {
          return true
        }

      if (page === this.pageCount) {
        return true
        }

        if (page === this.currentPage) {
          return true
        }

        if (page === this.currentPage + 1) {
          return true
        }

        if (page === this.currentPage - 1) {
          return true
        }

        if (this.currentPage === 1 && page < 5) {
          return true
        }

        if (this.currentPage === this.pageCount && page > this.pageCount - 4) {
          return true
        }

        if (this.currentPage === 2 && page === 4) {
          return true
        }

        if (this.currentPage === this.pageCount - 1 && page === this.pageCount - 3) {
          return true
        }

      return false
      }
    },
    totalPages() {
      return Math.ceil(this.itemCount / this.itemsPerPage);
    },
    total() {
      return this.getAllPractices.length;
    }
  },

  watch: {
    $route(to, from) {
			this.currentPage = parseInt(to.query.page);
			this.getPractices();
		},
    search(value){
      this.searchSubmit()
    },
    sort(value){
			if (value === 'Practice Name'){
				this.sortBy('practice_name', this.currentPage, this.search)
			}
			if (value === 'Practice Code'){
				this.sortBy('practice_code', this.currentPage, this.search)
			}
			if (value === 'Created'){
				this.sortBy('created_at', this.currentPage, this.search)
			}
			if (value === 'Expires'){
				this.sortBy('actived_until', this.currentPage, this.search)
      }
      if (value === 'Status'){
				this.sortBy('status', this.currentPage, this.search)
      }
      if (value === 'Type'){
				this.sortBy('practice_type', this.currentPage, this.search)
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
      const offset = parseInt(query.page)*10 - 10 
      return offset
    },

    getPractices(){
      this.$store.dispatch("practices/fetchPractices",{
        limit:10,
        search:this.search,
        order_by:this.paramSort.order_by,
        offset:this.getQuery()
      })
    },
      
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
      this.getPractices()
    },
    // goToPage(page,search,order_by) {
    //   if (page < 1) {
    //     return
    //   }

    //   if (page > this.pageCount) {
    //     return
    //   }
      
    //   let query = {
    //     ...this.$router.query,
    //     page
    //   }

    //   if(search){
    //     query = {
    //       ...this.$router.query,
    //       page,search
    //     }
    //   }
    //   if(order_by){
    //     query={
    //       ...this.$route.query,
    //       page,order_by
    //     }
    //   }
    //   if(search && order_by){
    //     query={
    //       ...this.$router.query,
    //       page,search,order_by
    //     }
    //   }

    //   if (page === 1) {
    //     delete query.page
    //   }

    //   if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
    //     this.loading = true
    //   }	
    //   this.$router.push({ query })
    // },

    searchSubmit: debounce(function(page, order_by) {
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
    }, 500),

    typeStyle(status){
      switch(status){
        case 'Hub':
          return 'bg-red-500 text-white lg:px-8 sm:px-2'
          break;
        case 'Spoke':
          return 'bg-blue-500 text-white lg:px-8 sm:px-2'
          break;
        case 'Stand Alone':
          return 'bg-indigo-600 text-white lg:px-8 sm:px-2'
          break;
        default:
          return
      }
    },
    pagechanged(e) {
			const query = {
				...this.$route.query,
				page: e || 1
			};
			this.$router.push({ query });
			this.getPractices(this.paramSort);
		}
  }
};
</script>
<style>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}

.page-button-disabled{
  background: linear-gradient(to top, #6b717e, #6b7386);
  cursor: not-allowed;
}

.page-button:active{
  transform: translate(2px, 2px);
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
  border-left: solid 2px yellow;
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
