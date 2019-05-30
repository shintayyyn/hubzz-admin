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
          class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:hubzz-yellow bg-waterloo"
          id="grid-state"
        >
          <option>All</option>
          <option>Empty</option>
          <option>Incomplete</option>
          <option selected>Pending</option>
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
        :to="{ path: `/compliances/${locumUser.id}`, query: $route.query }"
        class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mt-2"
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
            <span>{{  }}</span>
          </div>
        </div>
        <!-- <div style="width: 25%;">
          <div class="flex lg:pl-6">
            <div class="inline-flex text-white text-xs mt-2 py-2 p-5 border border-white rounded-full">
                <span>{{ compliance.status }}</span>
            </div>
          </div>
        </div> -->
      </nuxt-link>
      <!-- BODY -->
    </div>
    <!-- TABLE -->

    <!-- PAGINATION -->
		<div v-if="pageCount > 1">
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" :class="`${activePage === page ? 'bg-waterloo' : ''}`" v-for="page in pageCount" :key="`page-${page}`" @click="goToPage(page)">{{ page }}</button>
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>																									<!-- ^ Removed the FF. code in this area: v-if="showPage(page)"-->
		</div>
		<!-- PAGINATION -->


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
        search=''
      } = route.query
      page = parseInt(page)
      const limit = 10
      const offset = page * limit - limit
      const order_by = 'created_at:desc'
      const params = { limit, offset, order_by }

      if (search) {
        params.search = search
      }

      const getUsersCountPromise = app.$axios.get(`/api/v1/admin/locum-users/count`, { params })
			const getUsersPromise = app.$axios.get(`/api/v1/admin/locum-users`, { params })
				
  		let response = null
			response = await getUsersCountPromise
				
  		const itemCount = response.data.data.count
			response = await getUsersPromise
				
  		const locumUsers = response.data.data.users
  		return {
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
  data() {
    return {
      loading: false,
  		itemsPerPage: 10,
  		itemCount: 0,
  		activePage: 1,
      locumUsers: [],
      seach:''
    };
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
