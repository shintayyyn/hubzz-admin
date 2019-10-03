<template>
	<div class="flex-1 flex flex-col py-2 px-6 overflow-auto">

		<div>
			<nuxt-link to="/users/create" class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow">Create</nuxt-link>
		</div>

		<div class="flex py-2">
			<div class="relative">
				<input class="rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:border-sunglow bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
				<button class="p-2 absolute top-0 right-0 bottom-0" @click="search = '', searchSubmit()">
					<svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
				</button>
			</div>
			<button class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-500" @click="searchSubmit">Go</button>
		</div>

		<!-- TABLE -->
		<div>
			<div class="flex flex-col">

				<!-- HEADER -->
				<div class="flex my-2">
					<div style="width: 25%;">
						<div class="flex text-white text-xs p-4">
							<strong>Name</strong>
						</div>
					</div>
					<div style="width: 20%;">
						<div class="flex text-white text-xs p-4">
							<strong>Email</strong>
						</div>
					</div>
					<div style="width: 15%;">
						<div class="flex text-white text-xs p-4">
							<strong>Domain</strong>
						</div>
					</div>
					<div style="width: 25%;">
						<div class="flex text-white text-xs p-4">
							<strong>Created At</strong>
						</div>
					</div>
					<div style="width: 15%;">
						<div class="flex text-white text-xs p-4">
							<strong>Actions</strong>
						</div>
					</div>
				</div>
				<!-- HEADER -->

				<!-- BODY -->
				<nuxt-link v-for="(user, index) in users" :key="`user-${index}`" :to="`/users/${user.id}`" class="flex no-underline rounded-lg shadow-lg bg-waterloo hover:bg-waterloo-light my-2">
					<div class="flex" style="width: 25%;">
						 <div class="flex text-white text-xs py-4 p-2">
							<span>{{ user.personal_detail && user.personal_detail.name ? user.personal_detail.name : null }}</span>
						</div>
					</div>
					<div class="flex" style="width: 20%;">
						 <div class="flex text-white text-xs py-4 p-2">
							<span>{{ user.email }}</span>
						</div>
					</div>
					<div class="flex" style="width: 15%;">
						 <div class="flex text-white text-xs py-4 p-2">
							<span>{{ user.domain }}</span>
						</div>
					</div>
					<div class="flex" style="width: 25%;">
						 <div class="flex text-white text-xs py-4 p-2">
							<span>{{ $moment(user.createdAt).format('MMM D, YYYY | hh:mm A') }}</span>
						</div>
					</div>
					<div class="flex" style="width: 15%;">
						 <div class="flex text-white text-xs py-4 p-2">
						</div>
					</div>
				</nuxt-link>
				<!-- BODY -->

			</div>
		</div>
		<!-- TABLE -->

		<!-- PAGINATION -->
		<div v-if="pageCount > 1">
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" :class="`${activePage === page ? 'bg-waterloo' : ''}`" v-for="page in pageCount" :key="`page-${page}`" @click="goToPage(page)">{{ page }}</button>
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>
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

  			const params = { limit, offset }

  			if (search) {
  				params.search = search
  			}

  			const getUsersCountPromise = app.$axios.get(`/api/v1/users/count`, { params })

  			const getUsersPromise = app.$axios.get(`/api/v1/users`, { params })

  			let response = null

  			response = await getUsersCountPromise

  			const itemCount = response.data.data.count

  			response = await getUsersPromise

  			const users = response.data.data.users

  			return {
  				loading: false,
  				itemsPerPage: limit,
  				itemCount,
  				activePage: page,
  				users,
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
  			users: [],

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
  		}
  	}
  }
</script>
