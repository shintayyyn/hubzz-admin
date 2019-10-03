<template>
	<div class="flex-1 flex flex-col py-2 px-6 overflow-auto">

		<!-- BUTTON -->
		<div>
			<nuxt-link :to="{ path: `/surgeries/create`, query: $route.query }" class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow">Create</nuxt-link>
		</div>
		<!-- BUTTON -->

		<!-- FILTER -->
		<div class="flex py-2">
			<div class="relative">
				<input class="rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:border-sunglow bg-waterloo" placeholder="Search for..." v-model="search" @keyup.enter="searchSubmit">
				<button class="p-2 absolute top-0 right-0 bottom-0" @click="search = '', searchSubmit()">
					<svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
				</button>
			</div>
			<button class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-500" @click="searchSubmit">Go</button>
			<button class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-500" @click="refresh">Refresh</button>
		</div>
		<!-- FILTER -->

		<div class="pt-4">
			<span class="text-white text-xs">Showing {{ itemsPerPage * activePage - itemsPerPage + (surgeries.length > 0 ? 1 : 0) }}-{{ itemsPerPage * activePage - itemsPerPage + surgeries.length }} of {{ itemCount }} Practice Types</span>
		</div>

		<!-- TABLE -->
		<div class="w-full xl:w-4/5" v-if="!loading">
			<div class="flex flex-col">

				<!-- HEADER -->
				<div class="flex mt-2">
					<div class="flex w-full md:w-1/3">
						<div class="flex text-white text-xs p-4">
							<strong>Name</strong>
						</div>
					</div>
					<div class="flex w-1/6">
						<div class="flex text-white text-xs p-4">
							<strong>Code</strong>
						</div>
					</div>
					<div class="hidden md:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<strong>Clinical Commissioning Group</strong>
						</div>
					</div>
					<div class="hidden lg:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<strong>Address</strong>
						</div>
					</div>
				</div>
				<!-- HEADER -->

				<!-- BODY -->
				<nuxt-link v-for="(surgery, index) in surgeries" :key="`surgery-${index}`" :to="{ path: `/surgeries/${surgery.id}`, query: $route.query }" class="flex no-underline rounded-lg shadow-lg bg-waterloo hover:bg-waterloo-light my-2" draggable="false">
					<div class="flex w-full md:w-1/3">
						<div class="flex text-white text-xs p-4">
							<span>{{ surgery.name }}</span>
						</div>
					</div>
					<div class="flex w-1/6">
						<div class="flex text-white text-xs p-4">
							<span>{{ surgery.code }}</span>
						</div>
					</div>
					<div class="hidden md:flex w-1/4">
						<div class="flex text-white text-xs p-4">
							<span>{{ surgery.clinical_commissioning_group ? surgery.clinical_commissioning_group.name : null }}</span>
						</div>
					</div>
					<div class="hidden lg:flex w-1/4">
						<div class="flex flex-col text-white text-xs p-4">
							<span>{{ surgery.address ? surgery.address.line_1 : null  }}</span>
							<span>{{ surgery.address ? surgery.address.line_2 : null  }}</span>
							<span>{{ surgery.address ? surgery.address.line_3 : null  }}</span>
							<span>{{ surgery.address ? surgery.address.post_code : null  }}</span>
						</div>
					</div>
				</nuxt-link>
				<!-- BODY -->

			</div>
		</div>
		<!-- TABLE -->

		<!-- LOADING -->
		<div class="w-full p-12" v-if="loading">
			<span class="text-white">Loading...</span>
		</div>
		<!-- LOADING -->

		<!-- PAGINATION -->
		<div v-if="pageCount > 1" class="my-1">
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage - 1)">Prev</button>
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" :class="`${activePage === page ? 'bg-waterloo' : ''}`" v-for="page in pageCount" :key="`page-${page}`" v-if="showPage(page)" @click="goToPage(page)">{{ page }}</button>
			<button class="p-2 m-1 rounded-lg border text-xs text-white hover:bg-waterloo-light" @click="goToPage(activePage + 1)">Next</button>
		</div>
		<!-- PAGINATION -->

		<nuxt-child/>

	</div>
</template>

<script>
  export default {

	  watchQuery: [
	    'surgeries_page',
	    'surgeries_search'
	  ],

  	async asyncData({ app, route }) {

  		try {

  			let {
  				surgeries_page = 1,
  				surgeries_search = ''
  			} = route.query

  			let page = parseInt(surgeries_page)

  			const limit = 10

  			const offset = page * limit - limit

  			const order_by = 'created_at:desc'

  			const params = {
  				limit,
  				offset,
  				order_by
  			}

  			if (surgeries_search) {

  				params.search = surgeries_search

  			}

  			const getPracticeTypesCountPromise = app.$axios.get(`/api/v1/surgeries/count`, {
  				params
  			})

  			const getPracticeTypesPromise = app.$axios.get(`/api/v1/surgeries`, {
  				params
  			})

  			let response = null

  			response = await getPracticeTypesCountPromise

  			const itemCount = response.data.data.count

  			response = await getPracticeTypesPromise

  			const surgeries = response.data.data.surgeries

  			return {
  				loading: false,
  				itemsPerPage: limit,
  				itemCount,
  				activePage: page,
  				surgeries,
  				search: surgeries_search
  			}

  		} catch (err) {

  			console.log('index surgeries index asyncData err', err)

  		}

  	},

  	data() {

  		return {
  			loading: false,
  			itemsPerPage: 10,
  			itemCount: 0,
  			activePage: 1,
  			surgeries: [],
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

  		goToPage (page) {

  			if (page < 1) {

  				return

  			}

  			if (page > this.pageCount) {

  				return

  			}

  			const query = {
  				...this.$router.query,
  				surgeries_page: page
  			}

  			if (page === 1) {

  				delete query.surgeries_page

  			}

	      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {

	        this.loading = true

	      }

	      this.$router.push({ query })

  		},

  		searchSubmit () {

  			const query = {
  				...this.$router.query
  			}

  			delete query.page

  			query.surgeries_search = this.search

  			if (this.search === '') {

  				delete query.surgeries_search

  			}

	      if (this.$router.resolve({ query }).href !== this.$route.fullPath) {

	        this.loading = true

	      }

	      this.$router.push({ query })

  		},

  		refresh() {

  			let {
  				surgeries_page = 1,
  				surgeries_search = ''
  			} = this.$route.query

  			let page = parseInt(surgeries_page)

  			const limit = 10

  			const offset = page * limit - limit

  			const order_by = 'created_at:desc'

  			const params = {
  				limit,
  				offset,
  				order_by
  			}

  			if (surgeries_search) {

  				params.search = surgeries_search

  			}

  			this.loading = true

  			this.surgeries = []

  			this.$axios.get(`/api/v1/surgeries/count`, {
  				params
  			}).then(response => {

  				this.itemCount = response.data.data.count

  				return this.$axios.get(`/api/v1/surgeries`, {
	  				params
	  			})

  			}).then(response => {

  				this.surgeries = response.data.data.surgeries

  			}).catch(err => {

  				console.log('err', err)

  			}).finally(() => {

  				this.loading = false

  			})

  		}

  	}
  }
</script>
