<template>
  <div class="flex-1 flex flex-col py-2 px-6 overflow-auto">
    <div class="flex justify-between">
      <div class="flex py-2">
       	<div class="relative">
				<input class="rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:border-sunglow bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
				<button class="p-2 absolute pin-t pin-r pin-b" @click="search = '', searchSubmit()">
					<svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
				</button>
			</div>
      <button class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-dark" @click="searchSubmit">Go</button>
      </div>
      <div class="relative">
        <label class="text-xs text-white">Filter by Status</label>
        <select
          v-model="filterCompliances"
          class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:hubzz-yellow bg-waterloo"
          id="grid-state"
        >
          <option :value="null">All</option>
          <option>Empty</option>
          <option>Incomplete</option>
          <option>Pending</option>
          <option>Expiring</option>
          <option>Expired</option>
          <option>Rejected</option>
          <option>Compliant</option>
        </select>
      </div>
  
    </div>

    <!-- TABLE -->
    <div class>
      <!-- HEADER -->
      <div class="flex my-2">
        <div style="width: 25%;">
          <div class="flex text-white text-xs p-4">
            <strong>Locum</strong>
          </div>
        </div>
        <div style="width: 25%;">
          <div class="flex text-white text-xs p-4">
            <strong>Profession</strong>
          </div>
        </div>
        <div style="width: 26%;">
          <div class="flex text-white text-xs p-4">
            <strong>Last file uploaded</strong>
          </div>
        </div>
        <div style="width: %;">
          <div class="flex text-white text-xs p-4">
            <strong>Status</strong>
          </div>
        </div>
      </div>
      <!-- HEADER -->

      <!-- BODY -->
      <nuxt-link
        v-for="(locumUser, index) in locumUsers"
        :key="`locumUser-${index}`"
        :event="locumUser.compliance_status==='Empty' ? disabled : 'click'"
        :class="locumUser.compliance_status==='Empty' ? '' :'hover:bg-waterloo-light' "
        :to="{ path: `/compliances/${locumUser.id}`, query: $route.query }"
        class="flex no-underline shadow-lg rounded-lg bg-waterloo mt-2"
      >
        <div style="width: 25%;">
          <div class="flex text-white text-xs p-4 content-center">
            <span>{{ locumUser.personal_detail ? locumUser.personal_detail.name : null}}</span>
          </div>
        </div>
        <div style="width: 25%;">
          <div class="flex text-white text-xs p-4">
            <span>{{ locumUser.locum_detail && locumUser.locum_detail.profession ? locumUser.locum_detail.profession.name : null }}</span>
          </div>
        </div>
        <div style="width: 25%;">
          <div class="flex text-white text-xs p-4">
            <span>{{ locumUser.last_file_upload ? $moment(locumUser.last_file_upload).format('DD-MM-YY HH:mm:ss'):null }}</span>
          </div>
        </div>
        <div style="width: 25%;">
          <div v-if="locumUser.compliance_status=='Empty'" class="flex py-2 lg:pl-6">
            <span
              class="inline-flex text-white text-xs p-2 px-8 border border-white focus:bg-green rounded-full"
            >{{locumUser.compliance_status }}</span>
          </div>
          <div v-else class="flex py-2 lg:pl-6">
            <span
              class="inline-flex no-underline py-2 text-xs text-black rounded-full shadow "
              :class="`${locumUser.compliance_status==='Compliant' ? 'bg-green text-white lg:px-8 sm:px-2' : 'bg-yellow text-black lg:px-6 sm:px-2' }`"
            >{{locumUser.compliance_status }}</span>
          </div>
        </div>
      </nuxt-link>
      <!-- BODY -->
    </div>
    <!-- TABLE -->

    <!-- PAGINATION -->
		<div v-if="pageCount > 1">
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
      <button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" :class="`${activePage === page ? 'bg-waterloo' : ''}`" v-for="page in pageCount" :key="`page-${page}`" v-if="showPage(page)"  @click="goToPage(page)">{{ page }}</button>                                                                                                                                                                                   <!-- ^ Removed the FF. code in this area: v-if="showPage(page)"-->                    
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>																									
		</div>
		<!-- PAGINATION -->


    <nuxt-child/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
  		itemsPerPage: 10,
  		itemCount: 0,
  		activePage: 1,
      locumUsers: [],
      filterCompliances:'',
      search:'',
      disabled:'true'
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
        search='',
        compliance_status='Pending'
      } = route.query
      page = parseInt(page)
      const limit = 10
      const offset = page * limit - limit
      const order_by = 'created_at:desc'
      const params = { limit, offset, order_by }

      if (search) {
        params.search = search
      }

      params.compliance_status = compliance_status

      const getUsersCountPromise = app.$axios.get(`/api/v1/admin/locum-users/count`, { params })
			const getUsersPromise = app.$axios.get(`/api/v1/admin/locum-users`, { params })
				
      let response = null
      
			response = await getUsersCountPromise
      const itemCount = response.data.data.count
      
			response = await getUsersPromise
      const locumUsers = response.data.data.users
      
  		return {
        filterCompliances: compliance_status,
  			loading: false,
  			itemsPerPage: limit,
  			itemCount,
  			activePage: page,
        locumUsers,
        search
  		}
    } catch (err) {
      console.log("index compliances index asyncData err", err);
    }
  },
   
  computed:{
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
      },
      
  

  },

  watch: {
    async filterCompliances() {
      console.log('filterCompliances', this.filterCompliances)
      
      const params = {}

      if (this.search) {
        params.search = this.search
      }

      if (this.filterCompliances) {
        params.compliance_status = this.filterCompliances
      }

      const getUsersCountPromise = this.$axios.get(`/api/v1/admin/locum-users/count`, { params })
			const getUsersPromise = this.$axios.get(`/api/v1/admin/locum-users`, { params })
				
      let response = null
      
			response = await getUsersCountPromise
      const itemCount = response.data.data.count
      
			response = await getUsersPromise
      const locumUsers = response.data.data.users

      this.itemCount = itemCount
      this.locumUsers = locumUsers
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
