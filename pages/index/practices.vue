<template>
   <div class="flex-1 flex flex-col py-2 px-6 overflow-y-auto">
    <div class="flex flex-col md:flex-row">
      <div class="w-1/2">
        <div class="flex py-2">
          	<div class="relative">
              <input class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
                <button class="p-2 absolute pin-t pin-r pin-b focus:outline-none" @click="search = '', searchSubmit()">
                  <svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
                </button>
            </div>
        <button class="rounded-lg text-sm text-white p-2 mx-1 hover:text-black hover:bg-yellow-dark focus:outline-none" @click="searchSubmit">Go</button>
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
          <span class="break-all">{{ practice && practice.actived_until ?  $moment(practice.actived_until).format('MMM D, YYYY | hh:mm A'): 'Unavailable' }}</span>
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
	<div class="flex justify-center">
		<div v-if="pageCount > 1">
			<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black"
				@click="goToPage(activePage - 1)" 
				:class="activePage === 1 ? 'text-grey-dark' : 'hover:bg-yellow'">Prev</button>
			<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light" 
				:class="`${activePage === page ? 'text-white' : ''}`" 
				v-for="page in pageCount" 
				v-if="showPage(page)"
				:key="`page-${page}`" 
				@click="goToPage(page)">{{ page }}</button>
			<button class="page-button p-2 px-4 m-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light" 
				@click="goToPage(activePage + 1)"
				:class="`${activePage == pageCount ? 'text-grey-dark': ''}`">Next</button>														
		</div>
	</div>
	<!-- PAGINATION -->

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
import AddPracticeSurgery from '@/components/Practices/AddPracticeSurgery'

export default {
	components:{
		AddPracticeSurgery
	},
	data() {
      return {
        loading: false,
        itemsPerPage:8,
        itemCount: 0,
        activePage: 1,
        practices: [],
		search: '',
		modal:false

      };
    },

	watchQuery: [
	'page',
	'search'
	],

  	async asyncData({ app, route }) {
  		try {
  			let {
  				page = 1,
  				search = ''
			} = route.query
			  
  			page = parseInt(page)
  			const limit = 8
  			const offset = page * limit - limit
  			const order_by = 'created_at:desc'
			const params = { limit, offset, order_by }
			console.log(params)
				
  			if (search) {
  				params.search = search
			}
				
  			const getPracticesCountPromise = app.$axios.get(`/api/v1/admin/practices/count`, { params })
			const getPracticesPromise = app.$axios.get(`/api/v1/admin/practices`, { params })
			console.log(getPracticesPromise)
				
			let response = null
			
			response = await getPracticesCountPromise
			const itemCount = response.data.data.count
			
			response = await getPracticesPromise
			const practices = response.data.data.practices

			console.log(practices.length)
				
  			return {
  				loading: false,
  				itemsPerPage: limit,
  				itemCount,
  				activePage: page,
  				practices,
  				search
  			}
  		} catch (err) {
  			console.log('index practices index asyncData err', err)
  		}
  	},

    
    computed: {
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
  		goToPage(page) {
  			if (page < 1) {
  				return
  			}

  			if (page > this.pageCount) {
  				return
  			}

  			const query = {
  				...this.$router.query,
  				page
  			}

  			if (page === 1) {
  				delete query.page
  			}

	      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
	        this.loading = true
	      }

	      this.$router.push({ query })
  		},

  		searchSubmit() {
  			const query = {
  				...this.$router.query
  			}

  			delete query.page

  			query.search = this.search

  			if (this.search === '') {
  				delete query.search
  			}

	      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
	        this.loading = true
	      }

	      this.$router.push({ query })
  		}
  	}
};
</script>
<style>
.page-button {
  background: linear-gradient(to top, #f2d024, #efde86);
}
</style>
