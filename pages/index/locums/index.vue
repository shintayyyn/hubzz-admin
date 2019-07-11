<template>
	<div class="flex-1 flex flex-col py-2 px-6 overflow-auto">
		<div class="flex py-2">
			<div class="relative">
				<input class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
				<button class="p-2 absolute pin-t pin-r pin-b" @click="search = '', searchSubmit()">
					<svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
				</button>
			</div>
			<button class="rounded-lg text-sm text-white p-2 mx-1 hover:text-black hover:bg-yellow-dark" @click="searchSubmit">Go</button>
		</div>

		<!-- TABLE -->

			<div class="flex flex-col">

				<!-- HEADER -->
				<div class="flex my-2">
					<div class="flex" style="width: 20%;">
						<div class="flex text-white text-sm p-4">
							<strong>Name</strong>
						</div>
					</div>
					<div class="flex" style="width: 25%;">
						<div class="flex text-white text-sm p-4">
							<strong>Profession</strong>
						</div>
					</div>
					<div class="flex" style="width: 15%;">
						<div class="flex text-white text-sm p-4">
							<strong>Date signed-up</strong>
						</div>
					</div>
					<div class="flex" style="width: 15%;">
						<div class="flex text-white text-sm p-4">
							<strong>Sign-up verified</strong>
						</div>
					</div>
					<div class="flex" style="width: 20%;">
						<div class="flex text-white text-sm p-4">
							<strong>Status</strong>
						</div>
					</div>
				</div>
				<!-- HEADER -->

				<!-- BODY -->
				<nuxt-link v-for="(locumUser, index) in locumUsers" 
				:key="`locumUser-${index}`" 
				:to="{ path: `/locums/${locumUser.id}`, query: $route.query }" 
				 class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mt-2" draggable="false">
					
					<div style="width: 20%;">
						<div class="flex text-white text-sm p-4">
							<span>{{ locumUser.personal_detail ? locumUser.personal_detail.name : null }}</span>
						</div>
					</div>
					<div style="width: 25%;">
						<div class="flex text-white text-sm p-4">
							<span>{{ locumUser.locum_detail && locumUser.locum_detail.profession ? locumUser.locum_detail.profession.name : null }}</span>
						</div>
					</div>
					<div style="width: 15%;">
						<div class="flex text-white text-sm p-4">
							<span>{{ $moment(locumUser.created_at).format('MMM D, YYYY') }}</span>
						</div>
					</div>
					<div style="width: 15%;">
						<div class="flex text-white text-sm p-4">
							<span>{{ locumUser.email_verified_at ? $moment(locumUser.email_verified_at).format('MMM D, YYYY') : null }}</span>
						</div>
					</div>
					<div style="width:10%;">
						<div class=" flex py-2 px-4 items-center">
							<span
								class="inline-flex py-2 text-sm text-black rounded-full"
								:class="statusStyle(locumUser.status)"
							>{{ locumUser.status  }}</span>
						</div>
					</div>
					
				</nuxt-link>
				<!-- BODY -->


		</div>
		<!-- TABLE -->

		<!-- PAGINATION -->
		<div v-if="pageCount > 1">
			<button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
			<button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" :class="`${activePage === page ? 'bg-waterloo' : ''}`" v-for="page in pageCount" :key="`page-${page}`" v-if="showPage(page)" @click="goToPage(page)">{{ page }}</button>
			<button class="p-2 m-1 rounded-lg border text-sm text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>														<!-- ^ Removed the FF. code in this area: v-if="showPage(page)"-->
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
  				search = ''
  			} = route.query
  			page = parseInt(page)
  			const limit = 10
  			const offset = page * limit - limit
  			const order_by = 'created_at:desc'
			const params = { limit, offset, order_by }
				
  			if (search) {
  				params.search = search
				}
				
  			const getLocumUsersCountPromise = app.$axios.get(`/api/v1/admin/locum-users/count`, { params })
			const getLocumUsersPromise = app.$axios.get(`/api/v1/admin/locum-users`, { params })
			
			let response = await getLocumUsersCountPromise
			const itemCount = response.data.data.count
			
			response = await getLocumUsersPromise
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
  			console.log('index users index asyncData err', err)
  		}
  	},

  	data() {
  		return {
  			loading: false,
  			itemsPerPage: 10,
  			itemCount: 0,
  			activePage: 1,
  			locumUsers: {},
  			search: ''
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
		},

		statusStyle(status){
			switch(status){
				case 'Active':
					return 'bg-green text-white lg:px-8 sm:px-2'
					break;
				case 'Inactive':
					return 'bg-yellow text-black lg:px-8 sm:px-2'
					break;
				case 'Deactivated':
					return 'bg-grey text-black lg:px-8 sm:px-2'
					break;
				case 'Suspended':
					return 'bg-red text-black lg:px-8 sm:px-2'
					break;
				default:
					return
			}
		}
		  
  	}
  }
</script>
