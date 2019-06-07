<template>
  <div class="flex-1 flex flex-col px-4 py-2  overflow-auto">
    <div class="flex flex-wrap overflow-hidden sm:-mx-3">
      <div class="w-1/2  sm:my-3 sm:px-3 overflow-hidden">
        <div class="flex py-2">
          	<div class="relative">
              <input class="rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:border-sunglow bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
                <button class="p-2 absolute pin-t pin-r pin-b" @click="search = '', searchSubmit()">
                  <svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
                </button>
            </div>
        <button class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-dark" @click="searchSubmit">Go</button>
        </div>
      </div>

      <div class="w-1/2 sm:my-3 sm:px-3 overflow-hidden">
        <nuxt-link
          to="/practices/addpractice"
          class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow float-right"
        >Add Practice</nuxt-link>
      </div>
    </div>

    <!-- TABLE -->
    <div>
      <div class="flex flex-col">
        <!-- HEADER -->
        <div class="flex my-2">
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Practice Name</strong>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <strong>Practice Code</strong>
            </div>
          </div>
          <div style="width: 15%">
            <div class="flex text-white text-xs p-4">
              <strong>Created</strong>
            </div>
          </div>
          <div style="width: 15%;">
            <div class="flex text-white text-xs p-4">
              <strong>Expires</strong>
            </div>
          </div>
		  <div style="width:20%">
			<div class="flex text-white text-xs p-4">
				<strong>Status</strong>
			</div>  
		  </div>
		  

        </div>
        <!-- HEADER -->

        <!-- BODY -->
        <nuxt-link
          v-for="(practice, index) in practices"
          :key="`practice-${index}`"
          :to="{path:`/practices/${practice.id}`,query:$route.query}"
          class="flex no-underline rounded-lg bg-waterloo  shadow hover:bg-waterloo-light my-2"
        >
          <div class="flex" style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ practice.surgery ? practice.surgery.name:null }}</span>
            </div>
          </div>
          <div class="flex" style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ practice.surgery ? practice.surgery.code:null }}</span>
            </div>
          </div>
          <div class="flex" style="width: 15%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ $moment(practice.created).format('MMM D, YYYY | hh:mm A') }}</span>
            </div>
          </div>
          <div class="flex" style="width: 15%;">
            <div class="flex text-white text-xs p-4 ">
              <span>{{ practice.expires }}</span>
            </div>
          </div>
          <div class="flex" style="width: 10%">
            	<div class=" flex py-2 px-4 items-center">
                <span
					class=" inline-flex no-underline py-2 text-xs text-black rounded-full shadow "
					:class="`${practice.is_actived ? 'bg-green text-white lg:px-8 sm:px-2' : 'bg-yellow text-black lg:px-6 sm:px-2'}`"
				>{{ practice.is_actived ? 'Active':'Disabled' }}</span>
            	</div>
          </div>
        </nuxt-link>
        <!-- BODY -->
      </div>
    </div>
    <!-- TABLE -->
    <nuxt-child/>
  </div>
</template>

<script>
export default {

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
  			const limit = 10
  			const offset = page * limit - limit
  			const domain = 'locum'
  			const order_by = 'created_at:desc'
				const params = { limit, offset, domain, order_by }
				
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

    data() {
      return {
        loading: false,
        itemsPerPage: 10,
        itemCount: 0,
        activePage: 1,
        practices: [],
        search: ''
      };
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
